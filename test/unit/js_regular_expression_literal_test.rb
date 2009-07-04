require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSRegularExpressionLiteralTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSRegularExpressionLiteralParser.new
  end
  
  def test_integers
    assert_parsed '/foo/g'
  end
end
