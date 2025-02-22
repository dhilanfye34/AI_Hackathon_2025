const uploadForm = document.getElementById("upload-form");
const fileInput = document.getElementById("file-input");
const outputDiv = document.getElementById("output");

uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!fileInput.files.length) {
    outputDiv.textContent = "No file selected.";
    return;
  }

  // Prepare the form data
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  try {
    // POST to /classify (Flask endpoint)
    const response = await fetch("/classify", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      // If the response is not 2xx, handle error
      const errorData = await response.json();
      outputDiv.textContent = `Error: ${errorData.error || response.statusText}`;
      return;
    }

    // If successful, parse JSON
    const data = await response.json();
    // Display or process detection results
    outputDiv.textContent = JSON.stringify(data, null, 2);

    // Example: If you want to handle bounding boxes, you'd parse data.predictions
    // and overlay them on an image, etc.

  } catch (error) {
    outputDiv.textContent = `Error: ${error.message}`;
  }
});
