require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSNullLiteralTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSNullLiteralParser.new
  end
end
