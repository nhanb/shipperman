import { humanFileSize } from "./utils.js";

addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");

  const params = new URLSearchParams(location.hash.slice(1));
  const fileName = params.get("name");
  const size = humanFileSize(params.get("size"));
  const keyData = new Uint8Array(params.get("key").split("."));
  const iv = new Uint8Array(params.get("iv").split("."));
  const uid = location.pathname.split("/").slice(-1)[0];

  let decryptedFileUrl = null;

  m.mount(main, {
    oninit: () => {
      fetch(`/fetch/${uid}`)
        .then((resp) => {
          resp.arrayBuffer().then((buf) => {
            const ciphertext = new Uint8Array(buf);

            window.crypto.subtle
              .importKey("raw", keyData, "AES-GCM", true, ["decrypt"])
              .then((key) => {
                // let's decrypt!
                window.crypto.subtle
                  .decrypt({ name: "AES-GCM", iv }, key, ciphertext)
                  .then((decryptedBuf) => {
                    const blob = new Blob([decryptedBuf]);
                    decryptedFileUrl = URL.createObjectURL(blob);
                    m.redraw();
                  });
              });
          });
        })
        .catch((err) => {
          console.log({ err });
        })
        .finally(() => {
          m.redraw();
        });
    },
    view: () => {
      return [
        decryptedFileUrl
          ? [
              m(
                "a",
                { href: decryptedFileUrl, download: fileName },
                m("span", m("strong", fileName), ` (${size})`),
              ),
              m(
                "p",
                "Successfully downloaded and decrypted your file. Click the link above to save it.",
              ),
            ]
          : [
              m("p", m("strong", fileName), ` (${size})`),
              m(
                ".blink",
                {
                  style: {
                    display: "flex",
                    width: "fit-content",
                    gap: "0.5rem",
                    marginLeft: "0.5rem",
                  },
                },
                [m("span.spin", "/"), m("span", "downloading file...")],
              ),
            ],
      ];
    },
  });
});
