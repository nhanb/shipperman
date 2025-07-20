const std = @import("std");
const httpz = @import("httpz");

pub fn serve(req: *httpz.Request, res: *httpz.Response) !void {
    std.log.info("got {d} bytes", .{req.body().?.len});

    // Generate unique ID for this file. It's 128-bit strong, which is on par
    // with UUIDv4, meaning it's pretty much safe from accidental collision.
    var uid: [16]u8 = undefined;
    std.crypto.random.bytes(&uid);

    // TODO: actually store the file

    res.status = 200;
    res.content_type = .TEXT;
    try std.base64.url_safe_no_pad.Encoder.encodeWriter(res.writer(), &uid);
}
