# Trash Detector Website

A simple Flask-based web application that uses [YOLOv8](https://github.com/ultralytics/ultralytics) for **trash vs. recycling classification**. Users can upload an image, and the app will detect and label objects (e.g., plastics, bottles, cans) to help streamline waste sorting.

---

## Features

- **Flask API** with an endpoint (`/classify`) to accept image uploads.
- **YOLOv8** integration for object detection.
- Returns **bounding boxes**, **labels**, and **confidence scores** in JSON.
- **Lightweight** and easy to deploy, with no need to commit large model files into Git.

---

## Project Structure

1. **`app.py`**: Contains the Flask routes and code to load/run the YOLO model.  
2. **`requirements.txt`**: Python packages needed to run the app (Flask, PyTorch, ultralytics, etc.).  
3. **`weights/`**: Place your YOLOv8 `best.pt` file here (excluded from Git by default).  
4. **`.gitignore`**: Ensures you don’t commit large files or virtual environments.  

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<YourUsername>/<YourRepo>.git
cd TrashDetectorWebsite
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Flask App

```bash
python app.py
```

