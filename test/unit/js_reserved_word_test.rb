require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSReservedWordTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSReservedWordParser.new
  end
  
  def test_keywords
    assert_parsed 'if'
  end
  
  def test_future_reserved_keywords
    assert_parsed 'goto'
  end
end
