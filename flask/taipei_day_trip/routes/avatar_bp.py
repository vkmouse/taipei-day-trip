import io
import os

from flask import Blueprint
from flask import request
from flask import send_file
from PIL import Image

default_avatar_size = 160
max_avatar_size = 600


def avatar_bp():
    bp = Blueprint("avatar", __name__)

    @bp.route("/api/avatar/<uuid:id>", methods=["GET"])
    def get_avatar(id: int):
        size = request.args.get("size")
        if size != None and size.isdigit():
            size = min(int(size), max_avatar_size)
        else:
            size = default_avatar_size

        image_path = "avatar/default.png"
        if os.path.exists(f"avatar/{id}.png"):
            image_path = f"avatar/{id}.png"

        stream = io.BytesIO()
        with Image.open(image_path) as image:
            resized_image = image.resize((size, size))
            resized_image.save(stream, "PNG")
        stream.seek(0)
        return send_file(stream, mimetype='image/png')

    return bp
