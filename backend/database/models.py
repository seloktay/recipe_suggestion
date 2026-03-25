import enum
from sqlalchemy import Enum, CheckConstraint
from database.extensions import db


class CategoryType(enum.Enum):
    meal_type = "meal_type"
    nutritional_profile = "nutritional_profile"
    temperature = "temperature"


class Category(db.Model):
    __tablename__ = "category"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(Enum(CategoryType), nullable=False)


recipe_category = db.Table(
    "recipe_category",
    db.Column("recipe_id", db.Integer, db.ForeignKey("recipe.id"), primary_key=True),
    db.Column("category_id", db.Integer, db.ForeignKey("category.id"), primary_key=True),
)


class Ingredient(db.Model):
    __tablename__ = "ingredient"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    # TODO: add ingredient status like optional/necessary/substitutable

class RecipeIngredient(db.Model):
    __tablename__ = "recipe_ingredient"

    recipe_id = db.Column(db.Integer, db.ForeignKey("recipe.id"), primary_key=True)
    ingredient_id = db.Column(db.Integer, db.ForeignKey("ingredient.id"), primary_key=True)

    quantity = db.Column(db.String(50))

    recipe = db.relationship("Recipe", back_populates="recipe_ingredients")
    ingredient = db.relationship("Ingredient")


class RecipeImage(db.Model):
    __tablename__ = "recipe_images"

    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipe.id"), nullable=False, unique=True)
    image_path = db.Column(db.String(255), nullable=False)

    recipe = db.relationship("Recipe", back_populates="image")


class Recipe(db.Model):
    __tablename__ = "recipe"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    instructions = db.Column(db.Text, nullable=False)

    cooking_time = db.Column(
        db.Integer,
        CheckConstraint("cooking_time <= 600"),
        nullable=False,
    )

    recipe_ingredients = db.relationship(
        "RecipeIngredient",
        back_populates="recipe",
        cascade="all, delete-orphan"
    )

    image = db.relationship(
        "RecipeImage",
        back_populates="recipe",
        cascade="all, delete-orphan",
        uselist=False
    )

    categories = db.relationship(
        "Category",
        secondary=recipe_category,
        backref="recipes"
    )
