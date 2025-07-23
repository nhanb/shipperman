const std = @import("std");
const httpz = @import("httpz");
const constants = @import("./constants.zig");

pub fn serve(req: *httpz.Request, res: *httpz.Response) !void {
    const uid_b64 = req.param("uid_b64").?;

    const resp_body = (try std.fs.cwd().openDir(constants.uploads_dir, .{})).readFileAlloc(
        res.arena,
        uid_b64,
        constants.max_body_bytes,
    ) catch |err| switch (err) {
        error.FileNotFound => {
            res.status = 404;
            res.content_type = .TEXT;
            try res.writer().writeAll("File Not Found");
            return;
        },
        else => {
            return err;
        },
    };

    res.status = 200;
    res.content_type = .HTML;
    try res.writer().writeAll(resp_body);
}
