import pathlib
from models import HeartData
import random


HEART_RATE_RANGE = (60, 100)  # Normal resting heart rate range
SYSTOLIC_PRESSURE_RANGE = (90, 140)  # Normal systolic blood pressure range
DIASTOLIC_PRESSURE_RANGE = (60, 90)  # Normal diastolic blood pressure range


def process(image_path: pathlib.Path, user_id: int) -> HeartData:
    if not image_path.exists():
        raise FileNotFoundError(f"File {image_path} not found")
    heart_rate = random.randint(*HEART_RATE_RANGE)
    systolic_pressure = random.randint(*SYSTOLIC_PRESSURE_RANGE)
    diastolic_pressure = random.randint(*DIASTOLIC_PRESSURE_RANGE)
    return HeartData(
        user_id=user_id,
        heart_rate=heart_rate,
        systolic_pressure=systolic_pressure,
        diastolic_pressure=diastolic_pressure,
    )
    # return {"bpm": 120, "up": 80, "down": 120}
