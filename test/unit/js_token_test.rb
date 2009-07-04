require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSTokenTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSTokenParser.new
  end
  
  def test_ReservedWord
    assert_parsed('null')
    assert_parsed('false')
    assert_parsed('if')
  end
  
  def test_Identifier
    assert_parsed('foobar')
  end
  
  def test_Punctuator
    assert_parsed('!=')
  end

  def test_NumericLiteral
    assert_parsed('17.04e-10')
  end

  def test_StringLiteral
    assert_parsed('"hello world!"')
  end
end
