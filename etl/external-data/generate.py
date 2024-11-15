import pandas as pd
from faker import Faker
import click

fake = Faker("ru_RU")

EXTERNAL_SOURCE_COLUMNS = [
    "external_id",  # string
    "fio",  # string
    "sex",  # male / female
    "date_of_birth",  # date in format YYYY-MM-DD
    "email",  # string
    "address",  # string
    "risk_of_hearth_disease",  # 0.0 - 1.0
]


def generate_record():
    sex = fake.random_element(elements=("male", "female"))
    fio = fake.name_male() if sex == "male" else fake.name_female()
    return {
        "external_id": fake.uuid4(),
        "fio": fio,
        "sex": sex,
        "date_of_birth": fake.date_of_birth(maximum_age=100).strftime("%Y-%m-%d"),
        "email": fake.email(),
        "address": fake.address(),
        "risk_of_hearth_disease": round(fake.random.uniform(0.0, 1.0), 2),
    }


@click.command()
@click.option("--size", default=10, help="Number of records to generate")
@click.option("--output", default="dataset.csv", help="Output CSV file")
def generate_dataset(size, output):
    """Generate a dataset with the given size and save it to a CSV file."""
    data = [generate_record() for _ in range(size)]
    df = pd.DataFrame(data, columns=EXTERNAL_SOURCE_COLUMNS)
    df.to_csv(output, index=False)
    click.echo(f"Generated {size} records and saved to {output}")


if __name__ == "__main__":
    generate_dataset()
