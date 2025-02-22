import os
import uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from hashing import compute_file_hash
from PIL import Image

# Import DB functions
from db import init_db, get_user, create_user, add_points, get_leaderboard, photo_hash_exists, add_photo_hash

app = Flask(__name__, static_folder="static")
CORS(app)

# YOLO model path
MODEL_PATH = "weights/best.pt"
try:
    model = YOLO(MODEL_PATH)
    print("YOLO model loaded successfully.")
except Exception as e:
    print(f"Warning: Could not load YOLO model from {MODEL_PATH}: {e}")
    model = None

@app.route("/")
def index():
    return "Welcome to the Gamified Trash Detector!"

@app.route("/register", methods=["POST"])
def register_user():
    """
    Expects JSON: {"username": "<string>"}
    Creates a new user in the DB if not already taken.
    Returns JSON with success or error message.
    """
    data = request.get_json()
    if not data or "username" not in data:
        return jsonify({"error": "Missing 'username' in JSON"}), 400

    username = data["username"].strip()
    if not username:
        return jsonify({"error": "Username cannot be empty"}), 400

    # Check if user already exists
    if get_user(username) is not None:
        return jsonify({"error": f"Username '{username}' is taken."}), 400

    user_id = create_user(username)
    return jsonify({
        "message": f"User '{username}' created successfully.",
        "user_id": user_id
    })

def convert_to_jpeg(filepath):
    """
    Opens an image from 'filepath', and if its format is not JPEG,
    converts and saves it as a JPEG. Returns the new file path.
    """
    try:
        im = Image.open(filepath)
    except Exception as e:
        raise Exception("Could not open image for conversion: " + str(e))

    # If the image is already JPEG, return the original filepath
    if im.format == "JPEG":
        return filepath

    # Convert the image to RGB (required for JPEG) and save as JPEG
    new_filepath = os.path.splitext(filepath)[0] + ".jpg"
    rgb_im = im.convert("RGB")
    rgb_im.save(new_filepath, "JPEG")

    # Optionally, remove the original file to save space:
    os.remove(filepath)

    return new_filepath

@app.route("/classify", methods=["POST"])
def classify_image():
    if model is None:
        return jsonify({"error": "Model not loaded."}), 500

    username = request.form.get("username")
    if not username:
        return jsonify({"error": "Missing 'username'"}), 400

    user_record = get_user(username)
    if not user_record:
        return jsonify({"error": f"User '{username}' not found. Please register first."}), 400

    if "file" not in request.files:
        return jsonify({"error": "No 'file' field"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # Save file temporarily
    os.makedirs("temp", exist_ok=True)
    temp_filename = str(uuid.uuid4()) + "_" + file.filename
    temp_filepath = os.path.join("temp", temp_filename)
    file.save(temp_filepath)

    try:
        # Convert the uploaded image to JPEG if necessary
        converted_filepath = convert_to_jpeg(temp_filepath)

        # Compute the file hash on the converted image
        file_hash = compute_file_hash(converted_filepath)

        if photo_hash_exists(file_hash):
            return jsonify({
                "predictions": [],
                "message": "Duplicate image detected - no points awarded."
            })

        # Run YOLO inference on the JPEG image
        results = model.predict(source=converted_filepath)
        predictions = []
        for r in results:
            for box in r.boxes:
                class_idx = int(box.cls[0])
                label = model.names.get(class_idx, "unknown")
                conf = float(box.conf[0])
                x1, y1, x2, y2 = box.xyxy[0]
                predictions.append({
                    "label": label,
                    "confidence": conf,
                    "bbox": [float(x1), float(y1), float(x2), float(y2)]
                })

        # Save the new hash and award points
        add_photo_hash(file_hash, username)
        add_points(username, 1)

        return jsonify({
            "predictions": predictions,
            "message": f"1 point awarded to '{username}'"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up: Remove the temporary converted file if it exists
        if os.path.exists(converted_filepath):
            os.remove(converted_filepath)

@app.route("/leaderboard", methods=["GET"])
def leaderboard():
    """
    Returns a JSON array of top users:
    [
      {"username": "<str>", "points": <int>},
      ...
    ]
    """
    top_users = get_leaderboard(limit=10)
    leaderboard_data = [
        {"username": row[0], "points": row[1]} for row in top_users
    ]
    return jsonify(leaderboard_data)

@app.route("/")
def home():
    return app.send_static_file("index.html")

if __name__ == "__main__":
    # Initialize DB on startup (creates 'users' table if needed)
    #init_db()

    # Run the Flask server
    app.run(debug=True, port=5001)
