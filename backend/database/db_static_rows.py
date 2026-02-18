import csv
import os
from database.extensions import db
from database.models import Category, CategoryType, Ingredient

#from pathlib import Path
#BASE_DIR = Path(__file__).resolve().parent
#CSV_PATH = BASE_DIR / "categories.csv"

def define_static_categories():
    with open("./database/categories.csv", "rt") as categories:
        reader = csv.DictReader(categories)
        rows = list(reader)
        for row in rows:
            db.session.add(
                Category(
                    name=row["name"],
                    type=CategoryType[row["type"]]
                )
            )
            db.session.commit()

    with open("./database/ingredients.csv", "rt") as ingredients:
        reader = csv.DictReader(ingredients)
        rows = list(reader)
        for row in rows:
            db.session.add(
                Ingredient(
                    name=row["name"]
                )
            )
            db.session.commit()