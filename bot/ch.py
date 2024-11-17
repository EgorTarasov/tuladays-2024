from clickhouse_driver import Client
from models import HeartData, OxygenData, BloodSugarData, TemperatureData
import datetime as dt


def get_clickhouse_client(clickhouse_dsn: str) -> Client:
    return Client.from_url(clickhouse_dsn)


def insert_heart_data(
    client: Client,
    heart_data: HeartData,
) -> None:
    query = """
    INSERT INTO heart_data (patient_id, timestamp, heart_rate, systolic_pressure, diastolic_pressure)
    VALUES (%(patient_id)s, %(timestamp)s, %(heart_rate)s, %(systolic_pressure)s, %(diastolic_pressure)s)
    """
    data = {
        "patient_id": heart_data.user_id,
        "timestamp": dt.datetime.now(),
        "heart_rate": heart_data.heart_rate,
        "systolic_pressure": heart_data.systolic_pressure,
        "diastolic_pressure": heart_data.diastolic_pressure,
    }
    client.execute(query, data)


def insert_oxygen_data(
    client: Client,
    oxygen_data: OxygenData,
) -> None:
    query = """
    INSERT INTO blood_oxygen_data (patient_id, timestamp, blood_oxygen_level)
    VALUES (%(patient_id)s, %(timestamp)s, %(blood_oxygen_data)s)
    """
    data = {
        "patient_id": oxygen_data.user_id,
        "timestamp": dt.datetime.now(),
        "blood_oxygen_data": oxygen_data.oxygen,
    }
    client.execute(query, data)


def insert_sugar_data(
    client: Client,
    sugar_data: BloodSugarData,
) -> None:
    query = """
    INSERT INTO sugar_level_data (patient_id, timestamp, sugar_level)
    VALUES (%(patient_id)s, %(timestamp)s, %(sugar_level)s)
    """
    data = {
        "patient_id": sugar_data.user_id,
        "timestamp": dt.datetime.now(),
        "sugar_level": sugar_data.blood_sugar,
    }
    client.execute(query, data)


# def insert_temperature_data(
#     client: Client,
#     temperature_data: TemperatureData,
# ) -> None:
#     query = """
#     INSERT INTO sugar_level_data (patient_id, timestamp, sugar_level)
#     VALUES (%(patient_id)s, %(timestamp)s, %(sugar_level)s)
#     """
#     data = {
#         "patient_id": sugar_data.user_id,
#         "timestamp": dt.datetime.now(),
#         "sugar_level": sugar_data.blood_sugar,
#     }
#     client.execute(query, data)
