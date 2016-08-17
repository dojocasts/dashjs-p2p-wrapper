#!/usr/bin/env ruby

require 'fileutils'

BROWSERIFY = File.join ".", "node_modules", ".bin", "browserify"

DIST_BUNDLE = File.join "dist", "bundle", "dashjs-p2p-bundle.js"
DASHJS_BUNDLE = File.join "lib", "DashjsBundle.js"

FileUtils.mkdir_p File.join("dist", "bundle")

def command(cmd)
  puts "\e[36m#{cmd}\e[0m"
  puts %x(#{cmd})
end

command "#{BROWSERIFY} -p browserify-derequire -t [babelify] -s DashjsP2PBundle #{DASHJS_BUNDLE} | uglifyjs -m --compress warnings=false,drop_console=true > #{DIST_BUNDLE}"


