const std = @import("std");
const base64 = std.base64;
const cwd = std.fs.cwd;
const httpz = @import("httpz");
const constants = @import("./constants.zig");

pub fn serve(req: *httpz.Request, res: *httpz.Response) !void {
    const encrypted_bytes = req.body().?;
    std.log.info("got {d} bytes", .{encrypted_bytes.len});

    // Generate unique ID for this file. It's 128-bit strong, which is on par
    // with UUIDv4, meaning it's pretty much safe from accidental collision.
    var uid: [16]u8 = undefined;
    std.crypto.random.bytes(&uid);
    var uid_b64_buf: [24]u8 = undefined;
    const uid_b64 = base64.url_safe_no_pad.Encoder.encode(&uid_b64_buf, &uid);

    // Write the file to disk
    const uploads_dir = try cwd().openDir(constants.uploads_dir, .{});
    try uploads_dir.writeFile(.{
        .sub_path = uid_b64,
        .data = encrypted_bytes,
    });

    // Return this file's unique ID in response
    res.status = 200;
    res.content_type = .TEXT;
    try res.writer().writeAll(uid_b64);
}
