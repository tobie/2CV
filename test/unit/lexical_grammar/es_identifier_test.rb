require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSIdentifierTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSIdentifierParser.new
  end
  
  def test_identifier_start
    assert_parsed '$'
    assert_parsed '_'
    assert_parsed 'a'
    assert_parsed '\uaaaa'
    assert_not_parsed '1'
  end
  
  def test_identifier_part
    assert_parsed '_$'
    assert_parsed '__'
    assert_parsed '_a'
    assert_parsed '_1'
    assert_parsed '_\uaaaa'
  end
  
  def test_reserved_words
    assert_not_parsed 'if'
  end
end
