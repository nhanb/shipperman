const std = @import("std");
const log = std.log;
const httpz = @import("httpz");
const home = @import("./route_home.zig");
const static = @import("./route_static.zig");
const upload = @import("./route_upload.zig");
const constants = @import("./constants.zig");

const port = 8000;

pub fn main() !void {
    log.info("Starting server at port {d}", .{port});

    var dba: std.heap.DebugAllocator(.{}) = .init;
    const allocator = dba.allocator();

    // Make sure uploads dir exists
    std.fs.cwd().makeDir(constants.uploads_dir) catch |err| switch (err) {
        error.PathAlreadyExists => {},
        else => return err,
    };

    // More advanced cases will use a custom "Handler" instead of "void".
    // The last parameter is our handler instance, since we have a "void"
    // handler, we passed a void ({}) value.
    var server = try httpz.Server(void).init(allocator, .{
        .port = port,
        .request = .{
            .max_body_size = 1024 * 1024 * 512,
        },
    }, {});
    defer {
        // clean shutdown, finishes serving any live request
        server.stop();
        server.deinit();
    }

    var router = try server.router(.{});
    router.get("/", home.serve, .{});
    router.get(static.URL_PATH ++ "/:filename", static.serve, .{});
    router.post("/upload", upload.serve, .{});

    // blocks
    try server.listen();
}
