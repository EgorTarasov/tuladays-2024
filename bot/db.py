from aiogram import types
import psycopg
import psycopg_pool
from models import PatientNotification


def create_pool(posgtres_dsn: str) -> psycopg_pool.ConnectionPool:
    return psycopg_pool.ConnectionPool(posgtres_dsn)


def insert_user_data(
    conn: psycopg.Connection, user_data: types.User, system_user_id: int
) -> int | None:
    """
        CREATE TABLE IF NOT EXISTS telegram_data(
        telegram_id BIGINT PRIMARY KEY NOT NULL,
        user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
        username TEXT,
        first_name TEXT,
        last_name TEXT,
        language_code TEXT,
        last_activity TIMESTAMP NOT NULL DEFAULT NOW(),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP DEFAULT NULL
    );
    """
    query = """
    INSERT INTO telegram_data(telegram_id, user_id, username, first_name, last_name, language_code)
    VALUES (%s, %s, %s, %s, %s, %s)
    ON CONFLICT (telegram_id) DO UPDATE SET
    username = EXCLUDED.username,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    language_code = EXCLUDED.language_code,
    updated_at = NOW()
    RETURNING telegram_id;
    """
    result = conn.execute(
        query,
        (
            user_data.id,
            system_user_id,
            user_data.username,
            user_data.first_name,
            user_data.last_name,
            user_data.language_code,
        ),
    ).fetchall()
    if result:
        return result[0][0]
    return None


def get_telegram_id(conn: psycopg.Connection, user_id: int) -> int | None:
    query = """
    SELECT telegram_id FROM telegram_data WHERE user_id = %s;
    """
    result = conn.execute(query, (user_id,)).fetchall()
    if result:
        return result[0][0]
    return None


def get_user_id(conn: psycopg.Connection, telegram_id: int) -> int | None:
    query = """
    SELECT user_id FROM telegram_data WHERE telegram_id = %s;
    """
    result = conn.execute(query, (telegram_id,)).fetchall()
    if result:
        return result[0][0]
    return None


def insert_patient_notification(conn: psycopg.Connection, payload: PatientNotification):
    query = """
    INSERT INTO patient_notifications(patient_id, requested_measurement, notification)
    VALUES (%s, %s, %s)
    RETURNING id;
    """
    result = conn.execute(
        query, (payload.patient_id, payload.requested_measurement, payload.text)
    ).fetchall()
    if result:
        return result[0][0]
    return None
