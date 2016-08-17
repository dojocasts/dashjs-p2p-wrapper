#!/usr/bin/env ruby

require 'fileutils'

BROWSERIFY = File.join ".", "node_modules", ".bin", "browserify"

DIST_WRAPPER = File.join "dist", "wrapper", "dashjs-p2p-wrapper.js"
DASHJS_WRAPPER = File.join "lib", "DashjsWrapper.js"

FileUtils.mkdir_p File.join("dist", "wrapper")

def command(cmd)
  puts "\e[36m#{cmd}\e[0m"
  puts %x(#{cmd})
end

command "#{BROWSERIFY} -p browserify-derequire -t [babelify] -s DashjsP2PWrapper #{DASHJS_WRAPPER} | uglifyjs -m --compress warnings=false,drop_console=true > #{DIST_WRAPPER}"

