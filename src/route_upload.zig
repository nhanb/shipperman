const std = @import("std");
const httpz = @import("httpz");

pub fn serve(req: *httpz.Request, res: *httpz.Response) !void {
    const formData = try req.formData();

    const file = formData.get("encrypted-file");
    std.log.info("file: {d}", .{file.?.len});

    res.status = 200;
    res.content_type = .HTML;
    try res.writer().writeAll("");
}
