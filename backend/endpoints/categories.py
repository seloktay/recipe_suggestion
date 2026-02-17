from flask import Blueprint, jsonify, request
from database.extensions import db
from database.models import Category

categories_bp = Blueprint("categories", __name__, url_prefix="/categories")


@categories_bp.get("/")
def get_categories():
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