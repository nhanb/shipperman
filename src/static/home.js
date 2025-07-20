addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.querySelector("#upload-form");
  const fileInput = document.querySelector("#file-input");

  uploadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append("encrypted-file", file, "cipher.bin");

    fetch("/upload", {
      method: "POST",
      body: formData,
    });
  });
});
