require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSLiteralTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSLiteralParser.new
  end
  
  def test_NullLiteral
    assert_parsed 'null'
  end
  
  def test_BooleanLiteral
    assert_parsed 'true'
    assert_parsed 'false'
  end
end
