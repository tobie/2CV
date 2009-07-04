require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSCommentTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSCommentParser.new
  end
  
  def test_empty_MultiLineComment
    assert_parsed '/**/'
  end
  
  def test_regular_MultiLineComment
    assert_parsed '/* hello world */'
    assert_parsed  "/* 
    
    hello world */"
  end
  
  def test_regular_MultiLineComment
    assert_parsed '/* hello world */'
    assert_parsed  "/* 
    
    hello world */"
  end
  
  def test_MultiLineComment_with_asterix
    assert_parsed '/**a*/'
    assert_parsed '/***************a*/'
  end
  
  def test_SingleLineComment
    assert_parsed '//'
    assert_not_parsed "// hello world!
"
  end
end
