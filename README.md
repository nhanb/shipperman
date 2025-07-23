I got bored and tried to implement a [Firefox Send](https://github.com/mozilla/send).

From what I can remember, FF Send was a fire sharing service with real end-to-end encryption. To summarize how it works:

- Client (i.e. js code running in browser) generates a key for symmetric encryption, then encrypts the file.
- Client uploads encrypted blob to server.
- Client gives user a download url that includes the key **after a `#` sign**, making it a [URI fragment](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment).
- User opens said url. Because the key is in a URI fragment, it's never sent to the server, meaning the server can never decrypt the file itself.
- But because client-side javascript _can_ read the fragment via `window.location.hash`, it can decrypt the blob downloaded from the server.

Turns out browsers these days have access to [usable crypto APIs](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) out of the box, so I really need no library for the encryption/decryption logic.

Here's a demo:

<https://private-user-images.githubusercontent.com/1446315/469890865-f5c48e00-be48-499f-b4f5-5469822da97d.mp4?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTMyOTAyNDksIm5iZiI6MTc1MzI4OTk0OSwicGF0aCI6Ii8xNDQ2MzE1LzQ2OTg5MDg2NS1mNWM0OGUwMC1iZTQ4LTQ5OWYtYjRmNS01NDY5ODIyZGE5N2QubXA0P1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDcyMyUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA3MjNUMTY1OTA5WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9YTQ0MjI5MTNjYTljMmQ3NTczNDE0Yzg4MDIwMzA2MmYyNDZiODY1M2M4ZDYyNWZkYWJkNDU5YzlhNmEzOWM3MiZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.Pi2_GtxSkOb6PP_FqCLgplYZ_Bzeiiad2_6ZDpqv6Js>

# Thoughts

Ideally Alice should send the URL to Bob via some secure communication channel, but then, maybe effort is better spent on building a secure communication channel that can efficiently handle large file transfers as well?

Of course a production grade service would include some sort of checksum: an SHA-256 for the original file, and maybe another for the encrypted blob - just so we know if the server mangled our stuff without wasting effort on decrypting.
