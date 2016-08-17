#!/usr/bin/env ruby

require 'fileutils'

WATCHIFY = File.join ".", "node_modules", ".bin", "watchify"

DIST_WRAPPER_DEV = File.join "dist", "wrapper", "dashjs-p2p-wrapper.debug.js"
DASHJS_WRAPPER = File.join "lib", "DashjsWrapper.js"

FileUtils.mkdir_p File.join("dist", "bundle")

def command(cmd)
  puts "\e[36m#{cmd}\e[0m"
  puts %x(#{cmd})
end

command "#{WATCHIFY} -o #{DIST_WRAPPER_DEV} --debug -v -p browserify-derequire -t [babelify] -s DashjsWrapper #{DASHJS_WRAPPER}"
