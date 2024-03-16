## Blueprint py file to run all db py files in parallel

from flask import Flask
from flask_cors import CORS
from users import users_bp
from playlist import playlist_bp

app = Flask(__name__)
CORS(app)

# Registering Blueprints)
app.register_blueprint(users_bp, url_prefix='/users')
app.register_blueprint(playlist_bp, url_prefix='/playlist')

if __name__ == '__main__':
    app.run(debug=True, port=5000)