const std = @import("std");
const httpz = @import("httpz");
const options = @import("options");

// To add a new static asset, simply put it in ./src/static/
// Such files will be automatically embedded into our program executable.
//
// Remember to define a public const for each file for other code to access:
pub const style_css = assets.get("style.css").?;
pub const home_js = assets.get("home.js").?;

pub const URL_PATH = "/static";
const FS_PATH = "./static";

pub const Asset = struct {
    name: []const u8,
    kind: union(enum) {
        img: struct {
            // these are used in <img width="xx" height="yy">
            // to avoid DOM shifting on page load.
            width: []const u8,
            height: []const u8,
        },
        other: void,
    },
    content_type: httpz.ContentType,
    data: []const u8,
    url_path: []const u8,
};

const assets: std.StaticStringMap(Asset) = blk: {
    var kvs: [options.static_files.len]struct { []const u8, Asset } = undefined;
    for (options.static_files, 0..) |filename, i| {
        kvs[i] = .{
            filename,
            .{
                .name = filename,
                .kind = .other,
                .data = @embedFile(FS_PATH ++ "/" ++ filename),
                .url_path = URL_PATH ++ "/" ++ filename,
                .content_type = httpz.ContentType.forFile(filename),
            },
        };
    }
    const map = std.StaticStringMap(Asset).initComptime(kvs);
    break :blk map;
};

pub fn serve(req: *httpz.Request, res: *httpz.Response) !void {
    const filename = req.param("filename").?;

    if (assets.get(filename)) |asset| {
        res.status = 200;
        res.body = asset.data;
        res.content_type = asset.content_type;
    } else {
        res.status = 404;
        res.body = "Not Found";
        res.content_type = .TEXT;
    }
}
