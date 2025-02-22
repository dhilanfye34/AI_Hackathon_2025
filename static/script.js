// script.js

// DOM elements
const registerSection = document.getElementById("register-section");
const registerButton = document.getElementById("register-button");
const registerStatus = document.getElementById("register-status");
const usernameInput = document.getElementById("username-input");

const classifySection = document.getElementById("classify-section");
const classifyForm = document.getElementById("classify-form");
const classifyUsername = document.getElementById("classify-username");
const classifyResult = document.getElementById("classify-result");

const leaderboardSection = document.getElementById("leaderboard-section");
const leaderboardButton = document.getElementById("refresh-leaderboard");
const leaderboardTableBody = document.querySelector("#leaderboard-table tbody");

// ======================================================
// 1. REGISTER A NEW USER
// ======================================================
registerButton.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  if (!username) {
    registerStatus.textContent = "Please enter a username.";
    registerStatus.style.color = "red";
    return;
  }

  // Send POST /register with JSON {username: "xyz"}
  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();
    if (!response.ok) {
      // error from server
      registerStatus.textContent = data.error || "Registration error";
      registerStatus.style.color = "red";
    } else {
      registerStatus.textContent = data.message;
      registerStatus.style.color = "green";

      // Fill classify section's username
      classifyUsername.value = username;
      // Show classify section
      classifySection.classList.remove("hidden");
    }
  } catch (error) {
    registerStatus.textContent = "Network or server error: " + error;
    registerStatus.style.color = "red";
  }
});

// ======================================================
// 2. CLASSIFY AN IMAGE
// ======================================================
classifyForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = classifyUsername.value.trim();
  const fileInput = document.getElementById("image-file");
  if (!fileInput.files.length) {
    classifyResult.textContent = "No file selected.";
    return;
  }

  // Prepare form-data: username + file
  const formData = new FormData();
  formData.append("username", user);
  formData.append("file", fileInput.files[0]);

  try {
    const response = await fetch("/classify", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      // If server returned an error
      classifyResult.textContent = "Error: " + (data.error || response.statusText);
    } else {
      // Display predictions + message
      classifyResult.textContent = JSON.stringify(data, null, 2);
      // Optionally refresh leaderboard
      fetchLeaderboard();
    }
  } catch (err) {
    classifyResult.textContent = "Error: " + err;
  }
});

// ======================================================
// 3. LEADERBOARD
// ======================================================
leaderboardButton.addEventListener("click", () => {
  fetchLeaderboard();
});

async function fetchLeaderboard() {
  try {
    const response = await fetch("/leaderboard");
    const data = await response.json();
    // Clear existing rows
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

// ======================================================
// OPTIONAL: AUTO-REFRESH LEADERBOARD ON PAGE LOAD
// ======================================================
window.addEventListener("DOMContentLoaded", () => {
  fetchLeaderboard();
});
