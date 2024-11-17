import logging

import uvicorn
from fastapi import FastAPI
from fastapi.requests import Request

from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart, CommandObject

from contextlib import asynccontextmanager

from models import PatientNotification, BloodSugarData, OxygenData, Notification

from dotenv import load_dotenv
import os
import pathlib

from ml import process


from minio import Minio
from datetime import datetime

import db
import ch


load_dotenv()


ACCESS_KEY = os.getenv("ACCESS_KEY")
SECRET_KEY = os.getenv("SECRET_KEY")
BUCKET_NAME = os.getenv("BUCKET_NAME")

BOT_TOKEN = os.getenv("BOT_TOKEN")
POSTGRES_DSN = os.getenv("POSTGRES_DSN")
CLICKHOUSE_DSN = os.getenv("CLICKHOUSE_DSN")

if not BOT_TOKEN or not POSTGRES_DSN or not CLICKHOUSE_DSN:
    exit(-1)

if not ACCESS_KEY or not SECRET_KEY:
    exit(-1)

client = Minio(
    "10.0.1.80:9000",
    access_key=ACCESS_KEY,
    secret_key=SECRET_KEY,
    secure=False,
)


bot = Bot(token=str(BOT_TOKEN))
dp = Dispatcher()

db_pool = db.create_pool(POSTGRES_DSN)
ch_client = ch.get_clickhouse_client(CLICKHOUSE_DSN)

current_requests: dict = dict()


@dp.message()
async def get_message(message: types.Message):
    print(message.text)
    if message.from_user:
        user_key = str(message.from_user.id)
        if user_key in current_requests:
            with db_pool.connection() as conn:
                user_id = db.get_user_id(conn, message.from_user.id)
            if not user_id:
                return {"error": "user not found"}
            match current_requests.get(user_key):
                case "oxygen":
                    await process_oxygen(message=message, user_id=user_id)
                    current_requests.pop(user_key, None)
                case "sugar":
                    await process_blood_sugar(message=message, user_id=user_id)
                    current_requests.pop(user_key, None)
                case "pressure":
                    await get_photo(message=message)
                    current_requests.pop(user_key, None)


async def get_photo(message: types.Message):
    if bot and message.photo and message.from_user:

        with db_pool.connection() as conn:
            user_id = db.get_user_id(conn, message.from_user.id)
            if not user_id:
                return

        new_file = pathlib.Path("tmp.jpg")

        await bot.download(
            message.photo[-1],
            new_file,
        )

        client.fput_object(
            str(BUCKET_NAME),
            "{}_{}.jpg".format(
                message.from_user.id,
                datetime.strftime(datetime.now(), "%d.%m.%y_%H.%M"),
            ),
            str(new_file),
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
            f"""Отлично! 🎉 Данные успешно обработаны! Вот что я записал:\n\nПульс: {result.heart_rate}\nСистолическое давление: {result.systolic_pressure}\nДиастолическое давление: {result.diastolic_pressure}"""
        )


async def process_temperature(message: types.Message, user_id: int):
    if message.from_user:
        if message.text:
            data = BloodSugarData(
                user_id=message.from_user.id,
                blood_sugar=float(message.text),
            )
            ch.insert_sugar_data(
                ch_client,
                data,
            )
    await message.reply(
        f"""Отлично! 🎉 Данные успешно обработаны! Вот что я записал:\n\nТемпература: {message.text}°C"""
    )


async def process_oxygen(message: types.Message, user_id: int):
    if message.from_user:
        if message.text:
            data = OxygenData(
                user_id=user_id,
                oxygen=int(message.text),
            )
            ch.insert_oxygen_data(
                ch_client,
                data,
            )
    await message.reply(
        f"""Отлично! 🎉 Данные успешно обработаны! Вот что я записал:\n\nУровень кислорода в крови: {message.text}%"""
    )


async def process_blood_sugar(message: types.Message, user_id: int):
    if message.from_user:
        if message.text:
            data = BloodSugarData(
                user_id=user_id,
                blood_sugar=float(message.text),
            )
            ch.insert_sugar_data(
                ch_client,
                data,
            )
    await message.reply(
        f"""Отлично! 🎉 Данные успешно обработаны! Вот что я записал:\nУровень сахара в крови: {message.text} мг/дл"""
    )


@dp.message(CommandStart())
async def start(message: types.Message, command: CommandObject):
    await message.reply(
        """Похоже, что вам не назначен курс обследования.\n
    😊 Пожалуйста, обратитесь к вашему врачу, и он поможет вам с этим!"""
    )
    return


@dp.message(CommandStart(deep_link=True))
async def deeplink_start(message: types.Message, command: CommandObject):
    print("new message!")
    if not message.from_user:
        await message.reply("Неправильная ссылка. Код ошибки: 1")
        return

    args = command.args

    # payload = decode_payload(args)
    # convert args to int
    if not args:
        await message.reply("Неправильная ссылка. Код ошибки: 2")
        return

    with db_pool.connection() as conn:
        query = """
        SELECT * from users
        WHERE id IN (%s);
        """
        result = conn.execute(
            query,
            ((args),),
        ).fetchall()
        if len(result) == 0:
            await message.reply(
                "Упс! 😊 Пользователь с таким ID не найден в базе.\n Пожалуйста, свяжитесь с вашим лечащим врачом, и он поможет вам разобраться!"
            )
            return

    try:
        user_code = int(args)
    except Exception as e:
        await message.reply("Неправильная ссылка. Код ошибки: 3")
        return

    user_id = db.insert_user_data(conn, message.from_user, user_code)
    if user_id:
        await message.reply(
            f"""Привет! 😊 Я рад тебя видеть, {message.from_user.username}! Теперь я буду твоим медицинским помощником.\n
            Если у тебя возникнут вопросы или понадобится помощь, не стесняйся обращаться!\n 
            Здоровье — это важно, и я здесь, чтобы поддержать тебя"""
        )
        return

    await message.reply(
        "Ой, похоже, что-то пошло не так! 😊 Пожалуйста, свяжитесь с администратором, и мы всё исправим!"
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    await bot.set_webhook(
        url=str(os.getenv("REDIRECT_URL")),
        allowed_updates=dp.resolve_used_update_types(),
        drop_pending_updates=True,
    )
    app
    yield
    await bot.delete_webhook()


app = FastAPI(lifespan=lifespan)

blood_pressure_notification = f"""
Запрос: Пожалуйста, измерьте ваше артериальное давление. 😊\n

Что нам нужно знать:\n

- Фотография вашего манометра\n
            """

sugar_notification = f"""
Давайте проверим уровень сахара 🍭\n

Запрос: Пожалуйста, измерьте уровень сахара в крови.\n

Что нам нужно знать:\n

- Уровень сахара  
            """

oxygen_notification = f"""
Время проверить уровень кислорода 🌬️\n

Запрос: Пожалуйста, измерьте уровень кислорода в крови.\n

Что нам нужно знать:\n

Уровень кислорода
            """

temperature_notification = f"""
Давайте измерим температуру 🌡️\n

Запрос: Пожалуйста, измерьте вашу температуру тела.\n

Что нам нужно знать:\n

Температура
            """


@app.post("/notification")
async def send_notification(
    notification: Notification,
):
    with db_pool.connection() as conn:
        user_id = db.get_telegram_id(conn, notification.id)
        if not user_id:
            return {"error": "user not found"}

    match notification.type:
        case "sugar":
            current_requests.update({str(user_id): "sugar"})
            msg_text = sugar_notification

        case "oxygen":
            current_requests.update({str(user_id): "oxygen"})
            msg_text = oxygen_notification

        case "pressure":
            current_requests.update({str(user_id): "pressure"})
            msg_text = blood_pressure_notification

    with db_pool.connection() as conn:
        db.insert_patient_notification(
            conn,
            PatientNotification(
                patient_id=notification.id,
                requested_measurement=notification.type,
                text=notification.type,
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


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(filename)s:%(lineno)d #%(levelname)-8s [%(asctime)s] - %(name)s - %(message)s",
    )

    uvicorn.run(app, host="0.0.0.0", port=8000)
