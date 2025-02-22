// src/api.js

const BACKEND_URL = "http://localhost:5001"; // or wherever Flask is running

// 1. Register a user
export async function registerUser(username) {
  const response = await fetch(`${BACKEND_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
  return response.json(); // { message, user_id } or { error }
}

// 2. Classify an image
export async function classifyImage(username, file) {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("file", file);

  const response = await fetch(`${BACKEND_URL}/classify`, {
    method: "POST",
    body: formData,
  });
  return response.json(); // { predictions: [...], message: ... } or { error }
}

// 3. Get the leaderboard
export async function getLeaderboard() {
  const response = await fetch(`${BACKEND_URL}/leaderboard`);
  return response.json(); // an array of {username, points}
}
