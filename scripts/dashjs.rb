#!/usr/bin/env ruby

BABEL = File.join ".", "node_modules", ".bin", "babel"

NM_EXTERNALS = File.join ".", "node_modules", "dashjs", "externals"
EXTERNALS = File.join "dashjs", "externals"

NM_DASHJS_SRC = File.join ".", "node_modules", "dashjs", "src"
DASHJS_SRC = File.join "dashjs", "src"

NM_DASHJS_INDEX = File.join ".", "node_modules", "dashjs", "index.js"
DASHJS_INDEX = File.join "dashjs", "all.js"

def command(cmd)
  puts "\e[36m#{cmd}\e[0m"
  puts %x(#{cmd})
end

command "#{BABEL} #{NM_EXTERNALS} --out-dir #{EXTERNALS}"
command "#{BABEL} #{NM_DASHJS_SRC} --out-dir #{DASHJS_SRC}"
command "#{BABEL} #{NM_DASHJS_INDEX} --out-file #{DASHJS_INDEX}"
