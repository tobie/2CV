require 'test/unit'
require 'rubygems'
require File.expand_path(File.join(File.dirname(__FILE__), '..', '..', 'lib', 'parser'))

class Treetop::Runtime::SyntaxNode 
  def method_missing(method, *args)
    raise "Node representing '#{text_value}' does not respond to '#{method}'"
  end
end

module TestHelper
  attr_reader :parser
  
  def parse(input)
    result = parser.parse(input)
    unless result
      puts "\n" << parser.terminal_failures.join("\n") << "\n"
    end
    assert !result.nil?
    result
  end
  
  def assert_parsed(input, message = '')
    _wrap_assertion do
      assert_block(build_message(message, "<?> cannot be parsed.", input)) { !parser.parse(input).nil? }
    end
  end
  
  def assert_not_parsed(input, message = '')
    _wrap_assertion do
      assert_block(build_message(message, "<?> was unexpectedly parsed.", input)) { parser.parse(input).nil? }
    end
  end
end
