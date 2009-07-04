require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSStringLiteralTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSStringLiteralParser.new
  end
  
  def test_singlequotes
    assert_parsed "'hello world!'"
  end
  
  def test_doublequotes
    assert_parsed '"hello world!"'
  end
end
