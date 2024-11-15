import logging
from aiogram import Bot, Dispatcher
from aiogram.types import Update, Message
from fastapi import FastAPI
from fastapi.requests import Request
from aiogram import types
from aiogram import F
import uvicorn
from contextlib import asynccontextmanager
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import datetime

load_dotenv()


class Notification(BaseModel):
    id: int
    type: int


bot = Bot(
    token=str(os.getenv("BOT_TOKEN")),
)
dp = Dispatcher()


@dp.message(F.photo)
async def get_photo(message: types.Message):
    if bot and message.photo and message.from_user:
        await bot.download(
            message.photo[-1],
            "./photos/{}_{}.png".format(message.from_user.id, datetime.datetime.now()),
        )


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
    await bot.send_message(
        chat_id=notification.id,
        text=f"""
            You have selected the following options:

            {notification.type}

            Please let me know if you need any further assistance!
            """.strip(),
    )


@app.post("/")
async def webhook(request: Request) -> None:
    update = Update.model_validate(await request.json(), context={"bot": bot})
    await dp.feed_update(bot, update)


def process(path) -> dict:
    return {"bpm": 120, "up": 80, "down": 120}


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(filename)s:%(lineno)d #%(levelname)-8s [%(asctime)s] - %(name)s - %(message)s",
    )

    uvicorn.run(app, host="0.0.0.0", port=8000)
