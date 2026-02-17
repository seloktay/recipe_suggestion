from flask import Blueprint, jsonify, request
from database.extensions import db
from database.models import Category

ingredients_bp = Blueprint("ingredients", __name__, url_prefix="/ingredients")


@ingredients_bp.get("/")
def get_ingredients():
    categories = Category.query.all()

    result = [
        {
            "id": c.id,
            "name": c.name,
            "type": c.type.value
        }
        for c in categories
    ]

    return jsonify(result)


@ingredients_bp.post("/")
def create_category():
    data = request.json

    new_category = Category(
        name=data["name"],
        type=data["type"]  # adjust if Enum
    )

    db.session.add(new_category)
    db.session.commit()

    return jsonify({"message": "Category created"}), 201


@ingredients_bp.delete("/<int:id>")
def delete_category(id):
    category = Category.query.get_or_404(id)

    db.session.delete(category)
    db.session.commit()

    return jsonify({"message": "Deleted"})
