require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSInputElementDivTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSInputElementDivParser.new
  end
  def test_WhiteSpace
    assert_parsed(' ')
  end
  
  def test_LineTerminator
    assert_parsed("\n")
  end
  
  def test_Comment
    assert_parsed('// really?')
  end

  def test_Token
    assert_parsed('null')
  end

  def test_DivPunctuator
    assert_parsed('/')
  end
end
