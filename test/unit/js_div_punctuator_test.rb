require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSDivPunctuatorTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSDivPunctuatorParser.new
  end
  
  def test_DivPunctuator
    assert_parsed('/')
    assert_parsed('/=')
  end
end
