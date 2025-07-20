addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.querySelector("#upload-form");
  const fileInput = document.querySelector("#file-input");

  uploadForm.addEventListener("submit", (ev) => {
    const file = fileInput.files[0];
    const uuid = crypto.randomUUID();

    fetch(`/upload/${uuid}`, {
      method: "POST",
      body: file,
    })
      .then(() => {
        console.log("Saul Goodman");
      })
      .catch((err) => {
        console.log("EHHHH", err);
      });

    ev.preventDefault();
  });
});
