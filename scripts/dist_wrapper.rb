#!/usr/bin/env ruby

require 'fileutils'

NODE_BIN = File.join ".", "node_modules", ".bin"
BROWSERIFY = File.join NODE_BIN, "browserify"
UGLIFYJS = File.join NODE_BIN, "uglifyjs"

DIST_WRAPPER = File.join "dist", "wrapper", "dashjs-p2p-wrapper.js"
DASHJS_WRAPPER = File.join "lib", "DashjsWrapper.js"

FileUtils.mkdir_p File.join("dist", "wrapper")

def command(cmd)
  cmd.gsub! "/", "\\" if Gem.win_platform?
  puts "\e[36m#{cmd}\e[0m"
  puts %x(#{cmd})
end

command "#{BROWSERIFY} -p browserify-derequire -t [babelify] -s DashjsWrapper #{DASHJS_WRAPPER} | #{UGLIFYJS} -m --compress warnings=false > #{DIST_WRAPPER}"

