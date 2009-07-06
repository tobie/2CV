require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSBooleanLiteralTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSBooleanLiteralParser.new
  end
  
  def test_boolean
    assert_parsed 'false'
    assert_parsed 'true'
  end
end
