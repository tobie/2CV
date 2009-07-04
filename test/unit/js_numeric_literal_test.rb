require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSNumericLiteralTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSNumericLiteralParser.new
  end
  
  def test_integers
    assert_parsed '0'
    assert_parsed '1'
    assert_parsed '10'
  end
  
  def test_decimals
    assert_parsed '0.0'
    assert_parsed '0.1'
    assert_parsed '1.1'
    assert_parsed '.1'
    assert_parsed '.0'
    assert_parsed '1.'
    assert_parsed '0.'
    assert_parsed '11111.00000'
  end
  
  def test_hexadecimals
    assert_parsed '0X3'
    assert_parsed '0X2ef'
  end
  
  def test_exponents
    assert_parsed '2e10'
    assert_parsed '2e-10'
  end
end
