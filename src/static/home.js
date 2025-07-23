import { humanFileSize } from "./utils.js";

addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");

  let originalFile = null;
  let uploading = false;
  let errorMsg = null;

  let uploadedFiles = [];

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

              Promise.all([
                originalFile.arrayBuffer(),
                window.crypto.subtle.generateKey(
                  {
                    name: "AES-GCM",
                    length: 256,
                  },
                  true,
                  ["encrypt", "decrypt"],
                ),
              ]).then(([inputArrayBuffer, key]) => {
                const iv = window.crypto.getRandomValues(new Uint8Array(12));

                window.crypto.subtle
                  .encrypt({ name: "AES-GCM", iv }, key, inputArrayBuffer)
                  .then((encryptedArrayBuffer) => {
                    // Upload encrypted blob
                    uploading = true;
                    errorMsg = null;

                    m.request({
                      url: `/upload`,
                      method: "POST",
                      body: encryptedArrayBuffer,
                      serialize: (body) => body,
                      extract: (xhr, options) => xhr.responseText,
                    })
                      .then((uid) => {
                        window.crypto.subtle
                          .exportKey("raw", key)
                          .then((exportedKey) => {
                            // There's an Uint8Array.toBase64() but it's only
                            // implemented in Firefox, so we'll have to settle
                            // with this dumb "period-separated numbers" format
                            // for now.
                            const keyString = new Uint8Array(exportedKey).join(
                              ".",
                            );
                            uploadedFiles.push({
                              uid: uid,
                              name: originalFile.name,
                              size: originalFile.size,
                              key: keyString,
                            });
                            m.redraw();
                          });
                      })
                      .catch((err) => {
                        if (err.code !== 400) {
                          errorMsg = "Unexpected error occurred.";
                        } else {
                          errorMsg = err.response.message;
                        }
                      })
                      .finally(() => {
                        uploading = false;
                      });
                  });
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

        errorMsg ? m(".error", errorMsg) : null,

        uploadedFiles.length > 0
          ? m(
              "ul",
              uploadedFiles.map(({ uid, name, key, size }) => {
                const params = new URLSearchParams({
                  name,
                  size,
                  key,
                });
                const href = `/download/${uid}#${params}`;
                return m(
                  "li",
                  m("a", { href }, `${name} (${humanFileSize(size)})`),
                );
              }),
            )
          : null,
      ];
    },
  });
});
