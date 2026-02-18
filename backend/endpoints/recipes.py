from flask import Blueprint, jsonify, request
from database.extensions import db
from database.models import Recipe, Ingredient, Category, RecipeIngredient, CategoryType
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
            "categories": [{
                "name": c.name
            } for c in r.categories],
            "ingredients": [{
                "name": i.ingredient.name,
                "quantity": i.quantity
            } for i in r.recipe_ingredients]
        }
        for r in recipes
    ]
    return jsonify(result)


@recipes_bp.route("", methods=["POST"])
def create_recipe():
    data = request.get_json()
    category_ids = data.get("category_ids", [])
    ingredients = data.get("ingredients", [])

    categories = []
    if category_ids:
        categories = Category.query.filter(
            Category.id.in_(category_ids)
        ).all()

    recipe = Recipe(
        name=data["name"],
        cooking_time=data.get("cooking_time"),
        instructions=data.get("instructions")
    )
    db.session.add(recipe)
    recipe.categories = categories

    if ingredients:
        ingredient_map = {
            item["id"]: item["quantity"]
            for item in ingredients
        }

        ingredient_objects = Ingredient.query.filter(
            Ingredient.id.in_(ingredient_map.keys())
        ).all()

        for ingredient in ingredient_objects:
            recipe.recipe_ingredients.append(
                RecipeIngredient(
                    ingredient=ingredient,
                    quantity=ingredient_map[ingredient.id]
                )
            )

    db.session.commit()

    return jsonify({
        "id": recipe.id,
        "name": recipe.name,
        "categories": [
            {
                "id": c.id,
                "name": c.name,
                "type": c.type.value
            } for c in recipe.categories
        ],
        "ingredients": [
            {
                "ingredient": i.ingredient.name,
                "quantity": i.quantity
            } for i in recipe.recipe_ingredients
        ]
    }), 201


@recipes_bp.delete("/<int:recipe_id>")
def delete_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    db.session.delete(recipe)
    db.commit()
    return jsonify({"message": "Recipe deleted"})
