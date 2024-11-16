import logging
from aiogram import Bot, Dispatcher
from models import PatientNotification
from fastapi import FastAPI
from fastapi.requests import Request
from aiogram import types, F
from ml import process

from aiogram.utils.deep_linking import decode_payload
from aiogram.filters import CommandStart, Command, CommandObject
import uvicorn
from contextlib import asynccontextmanager
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import datetime
import db
import ch
import pathlib


load_dotenv()


class Notification(BaseModel):
    id: int
    type: str


BOT_TOKEN = os.getenv("BOT_TOKEN")
POSTGRES_DSN = os.getenv("POSTGRES_DSN")
CLICKHOUSE_DSN = os.getenv("CLICKHOUSE_DSN")

if not BOT_TOKEN or not POSTGRES_DSN or not CLICKHOUSE_DSN:
    exit(-1)


bot = Bot(
    token=str(BOT_TOKEN),
)
dp = Dispatcher()
db_pool = db.create_pool(POSTGRES_DSN)
ch_client = ch.get_clickhouse_client(CLICKHOUSE_DSN)


@dp.message(F.photo)
async def get_photo(message: types.Message):
    if bot and message.photo and message.from_user:
        new_file = pathlib.Path(
            f"./photos/{message.from_user.id}_{message.photo[-1].file_id}.png"
        )
        with db_pool.connection() as conn:
            user_id = db.get_user_id(conn, message.from_user.id)
            if not user_id:
                return

        await bot.download(
            message.photo[-1],
            new_file,
        )
        try:
            result = process(new_file, user_id)
        except FileNotFoundError as e:
            logging.error(e)
            return

        ch.insert_heart_data(
            ch_client,
            result,
        )
        await message.reply(
            f"Данные успешно обработаны, записываю:\nпульс: {result.heart_rate}\n систолическое: {result.systolic_pressure}\nдиастолическое: {result.diastolic_pressure}"
        )


@dp.message(CommandStart(deep_link=True))
async def start(message: types.Message, command: CommandObject):
    if not message.from_user:
        await message.reply("невалидная ссылка.")
        return

    args = command.args
    # payload = decode_payload(args)
    # convert args to int
    if not args:
        await message.reply("невалидная ссылка..")
        return
    try:
        user_code = int(args)
    except Exception as e:
        await message.reply("невалидная ссылка...")
        return

    with db_pool.connection() as conn:
        user_id = db.insert_user_data(conn, message.from_user, user_code)
        if user_id:
            await message.reply(
                f"Привет! {message.from_user.username} теперь я буду тебя знать! и в случае чего свяжусь с тобой!"
            )
            return

    await message.reply("что-то пошло не так свяжитесь с администратором")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await bot.set_webhook(
        url=str(os.getenv("REDIRECT_URL")),
        allowed_updates=dp.resolve_used_update_types(),
        drop_pending_updates=True,
    )

    yield
    await bot.delete_webhook()


app = FastAPI(lifespan=lifespan)


@app.post("/notification")
async def send_notification(notification: Notification):
    # TODO: update message by notification type
    with db_pool.connection() as conn:
        user_id = db.get_telegram_id(conn, notification.id)
        if not user_id:
            return {"error": "user not found"}

    msg_text = f"""
            You have selected the following options:

            {notification.type}

            Please let me know if you need any further assistance!
            """.strip()

    with db_pool.connection() as conn:
        db.insert_patient_notification(
            conn,
            PatientNotification(
                patient_id=notification.id,
                requested_measurement=notification.type,
                text=msg_text,
            ),
        )

    await bot.send_message(
        chat_id=user_id,
        text=msg_text,
    )


@app.post("/")
async def webhook(request: Request) -> None:
    update = types.Update.model_validate(await request.json(), context={"bot": bot})
    await dp.feed_update(bot, update)


<<<<<<< Updated upstream
=======
def process(path) -> dict:
    return {"bpm": 120, "up": 120, "down": 80}


>>>>>>> Stashed changes
if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(filename)s:%(lineno)d #%(levelname)-8s [%(asctime)s] - %(name)s - %(message)s",
    )

    uvicorn.run(app, host="0.0.0.0", port=8000)
