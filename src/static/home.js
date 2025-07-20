addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");

  let originalFile = null;
  let uploading = false;
  let errorMsg = null;

  m.mount(main, {
    view: () => {
      return [
        m("p", "Choose a file to upload:"),

        m(
          "form",
          {
            style: { display: "flex", gap: "0.4rem" },
            onsubmit: (ev) => {
              ev.preventDefault();

              uploading = true;
              m.request({
                url: `/upload/${crypto.randomUUID()}`,
                method: "POST",
                body: originalFile,
              })
                .then(() => {
                  console.log("Saul Goodman");
                })
                .catch((err) => {
                  errorMsg = err.toString();
                })
                .finally(() => {
                  uploading = false;
                });
            },
          },
          [
            m("input", {
              style: { flexGrow: "1" },
              type: "file",
              required: true,
              disabled: uploading,
              onchange: (e) => {
                originalFile = e.target.files[0];
              },
            }),
            m("input", {
              type: "submit",
              value: "upload",
              disabled: uploading,
            }),
          ],
        ),

        uploading
          ? m(
              ".blink",
              {
                style: {
                  display: "flex",
                  width: "fit-content",
                  gap: "0.5rem",
                  marginLeft: "0.5rem",
                },
              },
              [m("span.spin", "/"), m("span", "uploading...")],
            )
          : null,
      ];
    },
  });
});
