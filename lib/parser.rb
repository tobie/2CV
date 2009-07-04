require 'rubygems'
require 'treetop'

%w[basic js_numeric_literal js_string_literal js_literal].each do |file_name|
  Treetop.load File.expand_path(File.join(File.dirname(__FILE__), 'parser', file_name))
end