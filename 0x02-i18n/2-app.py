#!/usr/bin/env python3
"""
Flask app sample.
"""
from flask_babel import Babel
from flask import Flask, render_template, request


class Config:
    """
    Representation of flask Babel configuration.
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)


@babel.localeselector
def get_locale() -> str:
    """
    Retrieving the  web page.
    """
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route('/')
def get_index() -> str:
    """
    Home page.
    """
    return render_template('2-index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
