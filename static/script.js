// static/script.js

// Global variable to hold the image blob (from live capture or file upload)
let imageBlob = null;

// -----------------------
// Registration Section
// -----------------------
const registerButton = document.getElementById("register-button");
const registerStatus = document.getElementById("register-status");
const usernameInput = document.getElementById("username-input");

// -----------------------
// Live Camera Elements
// -----------------------
const video = document.getElementById("video");
const captureButton = document.getElementById("capture-button");

// -----------------------
// File Upload Elements
// -----------------------
const fileInput = document.getElementById("file-input");

// -----------------------
// Classification and Upload Elements
// -----------------------
const classifySection = document.getElementById("classify-section");
const uploadBtn = document.getElementById("upload-btn");

// -----------------------
// Result and Leaderboard Elements
// -----------------------
const resultEl = document.getElementById("result");
const refreshLeaderboardButton = document.getElementById("refresh-leaderboard");
const leaderboardTableBody = document.querySelector("#leaderboard-table tbody");

// =======================
// 1. Register a New User
// =======================
registerButton.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  if (!username) {
    registerStatus.textContent = "Please enter a username.";
    registerStatus.style.color = "red";
    return;
  }

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();
    if (!response.ok) {
      registerStatus.textContent = data.error || "Registration error";
      registerStatus.style.color = "red";
    } else {
      registerStatus.textContent = data.message;
      registerStatus.style.color = "green";
      // Optionally, disable the registration section
      usernameInput.disabled = true;
      registerButton.disabled = true;
    }
  } catch (error) {
    registerStatus.textContent = "Network or server error: " + error;
    registerStatus.style.color = "red";
  }
});

// =======================
// 2. Live Camera Capture Setup
// =======================
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      video.srcObject = stream;
      video.play();
    })
    .catch(err => {
      console.error("Error accessing camera: ", err);
    });
}

captureButton.addEventListener("click", () => {
  // Create a temporary canvas to capture the video frame
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  // Convert the canvas image to a JPEG Blob
  canvas.toBlob(blob => {
    imageBlob = blob;
    resultEl.textContent = "Live photo captured.";
    classifySection.classList.remove("hidden");
  }, "image/jpeg");
});

// =======================
// 3. File Upload from Gallery
// =======================
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    imageBlob = file;
    resultEl.textContent = "Image selected from gallery.";
    classifySection.classList.remove("hidden");
  }
});

// =======================
// 4. Upload Image for Classification
// =======================
uploadBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  if (!username) {
    resultEl.textContent = "Please enter a username.";
    return;
  }
  if (!imageBlob) {
    resultEl.textContent = "No image captured or selected.";
    return;
  }
  const formData = new FormData();
  formData.append("username", username);
  // Append the image blob with a filename; ensure it has a .jpg extension
  formData.append("file", imageBlob, "upload.jpg");

  try {
    const response = await fetch("/classify", {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (!response.ok) {
      resultEl.textContent = "Error: " + (data.error || response.statusText);
    } else {
      resultEl.textContent = JSON.stringify(data, null, 2);
      fetchLeaderboard();
    }
  } catch (err) {
    resultEl.textContent = "Error: " + err;
  }
});

// =======================
// 5. Leaderboard
// =======================
refreshLeaderboardButton.addEventListener("click", fetchLeaderboard);

async function fetchLeaderboard() {
  try {
    const response = await fetch("/leaderboard");
    const data = await response.json();
    leaderboardTableBody.innerHTML = "";
    data.forEach((user, index) => {
      const tr = document.createElement("tr");
      const rankTd = document.createElement("td");
      const userTd = document.createElement("td");
      const pointsTd = document.createElement("td");

      rankTd.textContent = index + 1;
      userTd.textContent = user.username;
      pointsTd.textContent = user.points;

      tr.appendChild(rankTd);
      tr.appendChild(userTd);
      tr.appendChild(pointsTd);

      leaderboardTableBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
  }
}

window.addEventListener("DOMContentLoaded", fetchLeaderboard);
