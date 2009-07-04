require 'rubygems'
require 'treetop'

%w[basic js_null_literal js_boolean_literal js_reserved_word js_numeric_literal js_string_literal js_literal js_regular_expression_literal].each do |file_name|
  Treetop.load File.expand_path(File.join(File.dirname(__FILE__), 'parser', file_name))
end