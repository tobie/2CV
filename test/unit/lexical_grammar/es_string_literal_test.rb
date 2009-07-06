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

  def test_quote_escape
    assert_parsed %|"\\""|
    assert_parsed %|"\'"|
    assert_parsed %|'\\''|
    assert_parsed %|'\"'|
  end
  
  def test_backslash_escape
    assert_parsed %|'\\\\'|
  end
  
  def test_other_char_escape
    assert_parsed %|'\\b\\f\\n\\r\\t\\v'|
  end
end
