const API_BASE_URL = 'http://localhost:5001'; // Adjust this to match your Flask backend URL

export async function getLeaderboard() {
  const response = await fetch(`${API_BASE_URL}/leaderboard`);
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }
  return response.json();
}

export async function classifyImage(username: string, file: File) {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/classify`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to classify image');
  }
  return response.json();
}

export async function registerUser(username: string) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    throw new Error('Failed to register user');
  }
  return response.json();
}