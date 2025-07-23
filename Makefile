build:
	zig build

watch:
	find . -path '*/src/*' -or -name '*.zig' -not -path '*/.zig-cache/*' \
		| entr -rc zig build run

clean:
	rm -rf .zig-cache zig-out
