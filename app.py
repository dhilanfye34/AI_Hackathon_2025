import os
import uuid
from flask import Flask, request, jsonify
from ultralytics import YOLO

# Initialize the Flask app
app = Flask(__name__)

# Load the YOLO model once at startup
# Make sure you have your best.pt file in the 'weights/' folder
MODEL_PATH = "weights/best.pt"
model = YOLO(MODEL_PATH)

# Optional: specify a list of recognized class names if you want
# But YOLOv8 automatically has 'model.names' after loading

@app.route("/")
def index():
    return "Hello from the Trash Detector Flask app!"

@app.route("/classify", methods=["POST"])
def classify_image():
    """
    Expects an image file from the client, field name 'file'.
    Returns detected objects with label, confidence, and bounding box.
    """

    # 1. Ensure 'file' is in request
    if "file" not in request.files:
        return jsonify({"error": "No 'file' field in request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # 2. Save the image temporarily
    os.makedirs("temp", exist_ok=True)
    temp_filename = str(uuid.uuid4()) + "_" + file.filename
    temp_filepath = os.path.join("temp", temp_filename)
    file.save(temp_filepath)

    try:
        # 3. Run YOLO inference
        results = model.predict(source=temp_filepath)

        # 4. Parse detection results
        # YOLOv8 returns a list of 'Results' objects (one per image)
        predictions = []
        for r in results:
            for box in r.boxes:
                class_idx = int(box.cls[0])
                label = model.names[class_idx]   # e.g., "Recyclable", "Trash", etc.
                conf = float(box.conf[0])
                # bounding box coordinates: (x1, y1, x2, y2)
                x1, y1, x2, y2 = box.xyxy[0]
                predictions.append({
                    "label": label,
                    "confidence": conf,
                    "bbox": [float(x1), float(y1), float(x2), float(y2)]
                })

        # 5. Return JSON response
        return jsonify({"predictions": predictions})

    finally:
        # 6. Clean up the temp file
        os.remove(temp_filepath)

# Run the Flask app (for local development)
if __name__ == "__main__":
    # You can change host="0.0.0.0" and port=5000 as needed
    app.run(debug=True, host="0.0.0.0", port=5000)
