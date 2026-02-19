from flask import Blueprint
from database.extensions import db
from database.models import Recipe, Ingredient, Category, RecipeIngredient, CategoryType, RecipeImage
from sqlalchemy.orm import selectinload
import uuid
import os
from flask import request, jsonify, current_app
from werkzeug.utils import secure_filename
import json

recipes_bp = Blueprint("recipes", __name__, url_prefix="/recipes")


@recipes_bp.get("/")
def list_recipes():
    recipes = Recipe.query.options(selectinload(Recipe.images)).all()
    result = [
        {
            "id": r.id,
            "cooking_time": r.cooking_time,
            "name": r.name,
            "images": [img.image_path for img in r.images],
            "categories": [c.name for c in r.categories],
            "ingredients": [{
                "name": i.ingredient.name,
                "quantity": i.quantity
            } for i in r.recipe_ingredients]
        }
        for r in recipes
    ]
    return jsonify(result)


@recipes_bp.route("/", methods=["POST"])
def create_recipe():
    category_ids = json.loads(request.form.get("category_ids", []))
    ingredients = json.loads(request.form.get("ingredients", []))
    name = request.form.get("name")
    cooking_time = request.form.get("cooking_time")
    instructions = request.form.get("instructions")

    categories = []
    if category_ids:
        categories = Category.query.filter(
            Category.id.in_(category_ids)
        ).all()

    recipe = Recipe(
        name=name,
        cooking_time=cooking_time,
        instructions=instructions
    )
    db.session.add(recipe)
    db.session.flush()
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

    files = request.files.getlist("images")
    upload_folder = os.path.join(current_app.root_path, "uploads")
    os.makedirs(upload_folder, exist_ok=True)

    for file in files:
        filename = secure_filename(file.filename)

        unique_filename = f"{uuid.uuid4()}_{filename}"
        filepath = os.path.join(upload_folder, unique_filename)

        file.save(filepath)
        recipe.images.append(
            RecipeImage(image_path=f"/uploads/{unique_filename}")
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

@recipes_bp.route("/<recipe_id>", methods=["PUT"])
def update_recipe(recipe_id):
    data = request.get_json()
    recipe = Recipe.query.get_or_404(recipe_id)
    recipe.name = data["name"]
    recipe.instructions = data["instructions"]
    recipe.cooking_time = data["cooking_time"]
    category_ids = data.get("category_ids",[])
    if category_ids:
        categories = Category.query.filter(
            Category.id.in_(data["category_ids"])
        ).all()
        recipe.categories = categories

    if "ingredients" in data:
        incoming = {i["id"]: i["quantity"] for i in data["ingredients"]}
        existing = {ri.ingredient_id: ri for ri in recipe.recipe_ingredients}
        for ingredient_id, quantity in incoming.items():
            # if ingredient already exists, update it
            if ingredient_id in existing:
                existing[ingredient_id].quantity = quantity
            else:
                # if ingredient is new, add to recipe
                new_item = RecipeIngredient(
                    recipe_id=recipe.id,
                    ingredient_id=ingredient_id,
                    quantity=quantity
                )
                db.session.add(new_item)
        # delete removed ingredients
        for ingredient_id, ri in existing.items():
            if ingredient_id not in incoming:
                db.session.delete(ri)
    db.session.commit()
    return jsonify({"message": f"Recipe updated"})


@recipes_bp.delete("/<int:recipe_id>")
def delete_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    db.session.delete(recipe)
    db.commit()
    return jsonify({"message": "Recipe deleted"})

