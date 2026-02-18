from flask import Blueprint, jsonify, request
from database.extensions import db
from database.models import Recipe, Ingredient, Category
from sqlalchemy.orm import selectinload

recipes_bp = Blueprint("recipes", __name__, url_prefix="/recipes")


@recipes_bp.get("/")
def list_recipes():
    recipes = Recipe.query.options(selectinload(Recipe.images)).all()
    result = [
        {
            "cooking_time": r.cooking_time,
            "name": r.name,
            "images": r.images,
            "meal_type": r.meal_type,
            "nutritional_profile": r.nutritional_profile,
            "temperature": r.temperature
        }
        for r in recipes
    ]
    return jsonify(result)


@recipes_bp.post("/")
def create_recipe():
    data = request.get_json()
    recipe = Recipe(
        name=data["name"],
        instructions=data["instructions"],
        cooking_time=data["cooking_time"]
    )

    recipe.ingredients = Ingredient.query.filter(
        Ingredient.id.in_(data["ingredient_ids"])
    ).all()

    recipe.categories = Category.query.filter(
        Category.id.in_(data["category_ids"])).all()

    db.session.add(recipe)
    db.session.commit()

    return jsonify({
        "id": recipe.id,
        "name": recipe.name
    }), 201


@recipes_bp.delete("/<int:recipe_id>")
def delete_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    db.session.delete(recipe)
    db.commit()
    return jsonify({"message": "Recipe deleted"})
