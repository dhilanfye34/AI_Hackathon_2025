import os
import uuid
from flask import Flask, request, jsonify
from ultralytics import YOLO

# Import DB functions
from db import init_db, get_user, create_user, add_points, get_leaderboard

app = Flask(__name__)

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

@app.route("/classify", methods=["POST"])
def classify_image():
    """
    Form-data:
      - 'username' (the user's name)
      - 'file' (the image to classify)
    After inference, user is awarded points (e.g., +1).
    Returns JSON with predictions and a message.
    """
    if model is None:
        return jsonify({
            "error": "Model not loaded. Ensure 'best.pt' is in 'weights/' folder."
        }), 500

    username = request.form.get("username")
    if not username:
        return jsonify({"error": "Missing 'username' in form-data"}), 400

    # Check user in DB
    user_record = get_user(username)
    if not user_record:
        return jsonify({"error": f"User '{username}' does not exist. Please register first."}), 400

    # Check file
    if "file" not in request.files:
        return jsonify({"error": "No 'file' field in form-data"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # Save temporarily
    os.makedirs("temp", exist_ok=True)
    temp_filename = str(uuid.uuid4()) + "_" + file.filename
    temp_filepath = os.path.join("temp", temp_filename)
    file.save(temp_filepath)

    try:
        # Inference
        results = model.predict(source=temp_filepath)
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

        # Award points
        add_points(username, 1)

        return jsonify({
            "predictions": predictions,
            "message": f"1 point awarded to '{username}'"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(temp_filepath):
            os.remove(temp_filepath)

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

if __name__ == "__main__":
    # Initialize DB on startup (creates 'users' table if needed)
    init_db()

    # Run the Flask server
    app.run(debug=True, host="0.0.0.0", port=5000)
