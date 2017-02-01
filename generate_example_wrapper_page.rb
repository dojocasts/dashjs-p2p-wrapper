#!/usr/bin/ruby

# Path constants
EXAMPLE_DIR = "./example"
TEMPLATE_FILENAME = "wrapper.html"
TEMPLATE_FILE = File.join(EXAMPLE_DIR, TEMPLATE_FILENAME)
CDN_TEMPLATE = "https://cdnjs.cloudflare.com/ajax/libs/dashjs/%s/dash.all.debug.js"

input_array = ARGV

if input_array.length != 1 or input_array[0] == "-h" or input_array[0] == "--help"
  puts "Usage: generate_example_wrapper_page.rb <Dash.js version>"
else
  dashjs_version = input_array[0]
  html = IO.read(TEMPLATE_FILE)
  html_modded = html.gsub(/\.\.\/node_modules\/dashjs\/dist\/dash\.all\.debug\.js/, CDN_TEMPLATE % dashjs_version)
  File.write(File.join(EXAMPLE_DIR, "dashjs#{dashjs_version}.#{TEMPLATE_FILENAME}"), html_modded)
  puts "Generated wrapper test page with Dash.js #{dashjs_version}"
end
