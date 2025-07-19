const std = @import("std");
const log = std.log;
const httpz = @import("httpz");
const home = @import("route_home.zig");
const static = @import("route_static.zig");

pub fn main() !void {
    log.info("Starting server", .{});

    var dba: std.heap.DebugAllocator(.{}) = .init;
    const allocator = dba.allocator();

    // More advanced cases will use a custom "Handler" instead of "void".
    // The last parameter is our handler instance, since we have a "void"
    // handler, we passed a void ({}) value.
    var server = try httpz.Server(void).init(allocator, .{ .port = 8000 }, {});
    defer {
        // clean shutdown, finishes serving any live request
        server.stop();
        server.deinit();
    }

    var router = try server.router(.{});
    router.get("/", home.serve, .{});
    router.get("/static/:filename", static.serve, .{});

    // blocks
    try server.listen();
}
