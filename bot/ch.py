from clickhouse_driver import Client
from models import HeartData
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
