from flask import Blueprint, jsonify, request
from database.extensions import db
from database.models import Ingredient

ingredients_bp = Blueprint("ingredients", __name__, url_prefix="/ingredients")


@ingredients_bp.get("/")
def get_ingredients():
    ingredients = Ingredient.query.all()
    result = [
        {
            "id": i.id,
            "name": i.name
        }
        for i in ingredients
    ]
    return jsonify(result)


@ingredients_bp.post("/")
def create_ingredient():
    data = request.json
    new_ingredient = Ingredient(
        name=data["name"]
    )
    db.session.add(new_ingredient)
    db.session.commit()
    return jsonify({"message": "Ingredient created"}), 201


@ingredients_bp.delete("/<int:ingredient_id>")
def delete_ingredient(ingredient_id):
    ingredient = Ingredient.query.get_or_404(ingredient_id)
    db.session.delete(ingredient)
    db.session.commit()
    return jsonify({"message": "Ingredient deleted"})
