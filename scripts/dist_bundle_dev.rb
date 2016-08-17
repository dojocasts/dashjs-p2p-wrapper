#!/usr/bin/env ruby

require 'fileutils'

WATCHIFY = File.join ".", "node_modules", ".bin", "watchify"

DIST_BUNDLE_DEV = File.join "dist", "bundle", "dashjs-p2p-bundle.debug.js"
DASHJS_BUNDLE = File.join "lib", "DashjsBundle.js"

FileUtils.mkdir_p File.join("dist", "bundle")

def command(cmd)
  cmd.gsub! "/", "\\" if Gem.win_platform?
  puts "\e[36m#{cmd}\e[0m"
  puts %x(#{cmd})
end

command "#{WATCHIFY} -o #{DIST_BUNDLE_DEV} --debug -v -p browserify-derequire -t [babelify] -s DashjsP2PBundle #{DASHJS_BUNDLE}"
