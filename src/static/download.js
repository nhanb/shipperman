import { humanFileSize } from "./utils.js";

addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");

  const params = new URLSearchParams(location.hash.slice(1));
  const fileName = params.get("name");
  const size = humanFileSize(params.get("size"));
  const key = new Uint8Array(params.get("key").split("."));

  let downloading = true;

  m.mount(main, {
    view: () => {
      return [
        m("p", m("strong", fileName), ` (${size})`),
        downloading
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
              [m("span.spin", "/"), m("span", "downloading file...")],
            )
          : null,
      ];
    },
  });
});
