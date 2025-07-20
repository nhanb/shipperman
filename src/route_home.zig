const std = @import("std");
const httpz = @import("httpz");
const static = @import("route_static.zig");
const home_template = @embedFile("./route_home.html");

pub fn serve(_: *httpz.Request, res: *httpz.Response) !void {
    res.status = 200;
    res.content_type = .HTML;
    try res.writer().writeAll(home_html);
}

const home_html: []const u8 = blk: {
    var buf: [1024]u8 = undefined;
    const result = std.fmt.bufPrint(&buf, home_template, .{
        static.style_css.url_path,
        static.mithril_js.url_path,
        static.home_js.url_path,
    }) catch unreachable;

    // Copy to a const because `buf` is a comptime var which is not allowed to
    // "leak": https://ziggit.dev/t/comptime-mutable-memory-changes/3702
    const final = buf[0..result.len].*;
    break :blk &final;
};
