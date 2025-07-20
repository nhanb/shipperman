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

/**
 * https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}
