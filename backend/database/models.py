import enum
from sqlalchemy import Enum
from database.extensions import db

class CategoryType(enum.Enum):
    meal_type = "meal_type"
    nutritional_profile = "nutritional_profile"
    temperature = "temperature"


# immutable table (for now), populate then leave it to be
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(Enum(CategoryType), nullable=False)


class Ingredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)


class RecipeIngredient(db.Model):
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), primary_key=True)
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredient.id'), primary_key=True)
    quantity = db.Column(db.String(50))


class RecipeImage(db.Model):
    __tablename__ = "recipe_images"
    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipe.id"), nullable=False)
    image_path = db.Column(db.String(255), nullable=False)
    recipe = db.relationship("Recipe", back_populates="images")


class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    ingredients = db.relationship(
        'Ingredient',
        secondary='recipe_ingredient',
        backref='recipe'
    )
    images = db.relationship(
        "RecipeImage",
        back_populates="recipe",
        cascade="all, delete-orphan"
    )
    meal_type_id = db.Column(db.Integer, db.ForeignKey("category.id"), nullable=True)
    nutritional_profile_id = db.Column(db.Integer, db.ForeignKey("category.id"), nullable=True)
    temperature_id = db.Column(db.Integer, db.ForeignKey("category.id"), nullable=True)
    meal_type = db.relationship("Category", foreign_keys=[meal_type_id])
    nutritional_profile = db.relationship("Category", foreign_keys=[nutritional_profile_id])
    temperature = db.relationship("Category", foreign_keys=[temperature_id])
