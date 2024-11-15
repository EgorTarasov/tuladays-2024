from dataclasses import dataclass


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
    # patient_id Int64,
    # -- external_data (id)
    # timestamp DateTime DEFAULT now(),
    # heart_rate UInt32,
    # systolic_pressure UInt32,
    # diastolic_pressure UInt32u
