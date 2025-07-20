const std = @import("std");
const httpz = @import("httpz");

pub fn serve(req: *httpz.Request, res: *httpz.Response) !void {
    const uuid = req.param("uuid").?;
    std.log.info("uuid: {s}, size: {d} bytes", .{ uuid, req.body().?.len });

    res.status = 200;
    res.content_type = .HTML;
    try res.writer().writeAll("");
}
