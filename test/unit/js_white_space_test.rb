require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSWhiteSpaceTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSWhiteSpaceParser.new
  end
  
  def test_WhiteSpace
    assert_parsed " "
    assert_parsed "\t"
  end
end