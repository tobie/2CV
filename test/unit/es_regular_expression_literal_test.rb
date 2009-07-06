require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSRegularExpressionLiteralTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSRegularExpressionLiteralParser.new
  end
  
  def test_basic_regexp
    assert_parsed '/foo/'
  end
  
  def test_basic_regexp_with_flag
    assert_parsed '/foo/u'
  end
  
  def test_basic_regexp_with_flags
    assert_parsed '/foo/ug'
  end
  
  def test_regexp_with_asterisk
    assert_parsed '/.*/'
  end
  
  def test_regexp_with_backslash_sequences
    assert_parsed '/\//'
    assert_parsed '/\\\/'
    assert_parsed '/\\\\/'
  end
end
