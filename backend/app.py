from flask import Flask
from database.extensions import db
from endpoints.categories import categories_bp
from endpoints.ingredients import ingredients_bp
from endpoints.recipes import recipes_bp
from database.db_static_rows import define_static_categories
#TODO: add error handling to endpoints
app = Flask(__name__) # best practice: inside function

def create_app():
    app.config.from_object("config.Config")
    db.init_app(app)
    app.register_blueprint(categories_bp)
    app.register_blueprint(ingredients_bp)
    app.register_blueprint(recipes_bp)

    # for first-time db creation, uncomment these line
    # with app.app_context():
    #     import database.models
    #     db.create_all()
    #     define_static_categories()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
