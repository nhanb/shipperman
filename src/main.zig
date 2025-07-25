const std = @import("std");
const log = std.log;
const httpz = @import("httpz");
const constants = @import("./constants.zig");
const home = @import("./route_home.zig");
const static = @import("./route_static.zig");
const upload = @import("./route_upload.zig");
const download = @import("./route_download.zig");
const fetch = @import("./route_fetch.zig");

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
            .max_body_size = constants.max_body_bytes,
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
    router.get("/download/:uid_b64", download.serve, .{});
    router.get("/fetch/:uid_b64", fetch.serve, .{});

    // blocks
    try server.listen();
}
