from dataclasses import dataclass
from pydantic import BaseModel


@dataclass
class PatientNotification:
    patient_id: int
    requested_measurement: str
    text: str


@dataclass
class HeartData:
    user_id: int
    heart_rate: int
    systolic_pressure: int
    diastolic_pressure: int


@dataclass
class Notification(BaseModel):
    id: int
    type: str


@dataclass
class OxygenData:
    user_id: int
    oxygen: int


@dataclass
class BloodSugarData:
    user_id: int
    blood_sugar: float
