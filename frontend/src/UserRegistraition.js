import React, { useState } from "react";
import { registerUser } from "@/api";

function RegistrationForm() {
  const [username, setUsername] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await registerUser(username);
    if (data.error) {
      setResponseMessage(`Error: ${data.error}`);
    } else {
      setResponseMessage(data.message);  // e.g. "User 'alice' created successfully."
      // Optionally store user_id or proceed to login, etc.
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium">
          Enter Username
        </label>
        <input
          id="username"
          type="text"
          className="border p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </form>

      {responseMessage && (
        <div className="mt-4 text-sm">
          {responseMessage}
        </div>
      )}
    </div>
  );
}

export default RegistrationForm;
