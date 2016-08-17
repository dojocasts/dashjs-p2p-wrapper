#!/usr/bin/env ruby

require 'fileutils'

def log(message)
  puts "\e[36m#{message}\e[0m"
end

log "Removing dashjs folder…"
FileUtils.rm_r "dashjs", force: true

log "Removing dist folder…"
FileUtils.rm_r "dist", force: true
