.PHONY: build clean lint lint-fix wrapper bundle

DASHJS_SRC_FILES = $(shell find node_modules/dashjs -type f -name "*.js")

LIB_FILES = $(shell find lib -type f -name "*.js")

DIST_WRAPPER = dist/wrapper/dashjs-p2p-wrapper.js
DIST_BUNDLE = dist/bundle/dashjs-p2p-bundle.js

NODE_BIN = ./node_modules/.bin

# default target "all"
build: wrapper bundle

wrapper: $(DIST_WRAPPER)

bundle: $(DIST_BUNDLE)

lint:
	npm run lint

lint-fix:
	npm run lint-fix

clean:
	npm run clean

dashjs: $(DASHJS_SRC_FILES)
	npm run dashjs

$(DIST_BUNDLE): $(LIB_FILES) dashjs
	npm run bundle

$(DIST_WRAPPER): $(LIB_FILES) dashjs
	npm run wrapper
