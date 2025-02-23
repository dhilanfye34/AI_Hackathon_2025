import os
import uuid
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image

# Import DB and hashing functions
from db import init_db, get_user, create_user, add_points, get_leaderboard, photo_hash_exists, add_photo_hash
from hashing import compute_file_hash

app = Flask(__name__)
CORS(app)

# Path to your YOLO model
MODEL_PATH = os.path.join("train20", "weights", "best.pt")
try:
    model = YOLO(MODEL_PATH)
    print("YOLO model loaded successfully.")
except Exception as e:
    print(f"Warning: Could not load YOLO model from {MODEL_PATH}: {e}")
    model = None

def convert_to_jpeg(filepath):
    # If the file already has a JPEG extension, skip conversion.
    if filepath.lower().endswith(('.jpg', '.jpeg')):
        return filepath
    try:
        im = Image.open(filepath)
    except Exception as e:
        raise Exception("Could not open image for conversion: " + str(e))
    
    # Otherwise, convert the image to JPEG
    new_filepath = os.path.splitext(filepath)[0] + ".jpg"
    im.convert("RGB").save(new_filepath, "JPEG")
    os.remove(filepath)
    return new_filepath

@app.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()
    print("Register payload:", data)  # Debug print
    if not data or "username" not in data:
        return jsonify({"error": "Missing 'username' in JSON"}), 400

    username = data["username"].strip()
    if not username:
        return jsonify({"error": "Username cannot be empty"}), 400

    if get_user(username) is not None:
        return jsonify({"error": f"Username '{username}' is taken."}), 400

    user_id = create_user(username)
    print("User created with ID:", user_id)  # Debug print
    return jsonify({
        "message": f"User '{username}' created successfully.",
        "user_id": user_id
    })

@app.route("/classify", methods=["POST"])
def classify_image():
    if model is None:
        return jsonify({"error": "Model not loaded."}), 500

    print("request.form keys:", list(request.form.keys()))
    print("request.files:", request.files)

    username = request.form.get("username")
    print("Username received:", repr(username))
    if not username:
        return jsonify({"error": "Missing 'username'"}), 400

    user_record = get_user(username)
    if not user_record:
        print(f"User '{username}' not found. Creating user automatically for testing.")
        create_user(username)
        user_record = get_user(username)
        print("User record after creation:", user_record)

    if "file" not in request.files:
        return jsonify({"error": "No 'file' field"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # Use an absolute path for the temporary directory:
    temp_dir = os.path.join(os.path.dirname(__file__), "temp")
    os.makedirs(temp_dir, exist_ok=True)
    temp_filename = str(uuid.uuid4()) + "_" + file.filename
    temp_filepath = os.path.join(temp_dir, temp_filename)
    file.save(temp_filepath)
    print("File saved to:", temp_filepath)

    try:
        converted_filepath = convert_to_jpeg(temp_filepath)
        print("Converted file:", converted_filepath)
        if not os.path.exists(converted_filepath):
            print("Warning: Converted file not found, proceeding anyway.")

        file_hash = compute_file_hash(converted_filepath)
        if photo_hash_exists(file_hash):
            return jsonify({
                "predictions": [],
                "message": "Duplicate image detected - no points awarded."
            })

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

        add_photo_hash(file_hash, username)
        add_points(username, 1)

        return jsonify({
            "predictions": predictions,
            "message": f"1 point awarded to '{username}'"
        })
    except Exception as e:
        print("Error during classification:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(converted_filepath):
            os.remove(converted_filepath)

@app.route("/leaderboard", methods=["GET"])
def leaderboard():
    top_users = get_leaderboard(limit=10)
    leaderboard_data = [
        {"username": row[0], "points": row[1]} for row in top_users
    ]
    return jsonify(leaderboard_data)

# Serve the React build output from frontend/dist
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    build_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
    if path != "" and os.path.exists(os.path.join(build_dir, path)):
        return send_from_directory(build_dir, path)
    else:
        return send_from_directory(build_dir, 'index.html')

if __name__ == "__main__":
    init_db()  # Create tables if needed
    app.run(debug=True, port=5001)
