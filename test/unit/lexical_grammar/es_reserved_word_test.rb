require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSReservedWordTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSReservedWordParser.new
  end
  
  def test_keywords
    assert_parsed('break')
    assert_parsed('case')
    assert_parsed('catch')
    assert_parsed('continue')
    assert_parsed('default')
    assert_parsed('delete')
    assert_parsed('do')
    assert_parsed('else')
    assert_parsed('finally')
    assert_parsed('for')
    assert_parsed('function')
    assert_parsed('if')
    assert_parsed('in')
    assert_parsed('instanceof')
    assert_parsed('new')
    assert_parsed('return')
    assert_parsed('switch')
    assert_parsed('this')
    assert_parsed('throw')
    assert_parsed('try')
    assert_parsed('typeof')
    assert_parsed('var')
    assert_parsed('void')
    assert_parsed('while')
    assert_parsed('with')
  end
  
  def test_future_reserved_keywords
    assert_parsed('break')
    assert_parsed('case')
    assert_parsed('catch')
    assert_parsed('continue')
    assert_parsed('default')
    assert_parsed('delete')
    assert_parsed('do')
    assert_parsed('else')
    assert_parsed('finally')
    assert_parsed('for')
    assert_parsed('function')
    assert_parsed('if')
    assert_parsed('in')
    assert_parsed('instanceof')
    assert_parsed('new')
    assert_parsed('return')
    assert_parsed('switch')
    assert_parsed('this')
    assert_parsed('throw')
    assert_parsed('try')
    assert_parsed('typeof')
    assert_parsed('var')
    assert_parsed('void')
    assert_parsed('while')
    assert_parsed('with')
  end
end
