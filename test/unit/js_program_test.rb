require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSProgramTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSProgramParser.new
  end
  
  def test_WhiteSpace
    path = File.expand_path(File.join(File.dirname(__FILE__), '..', 'fixtures', 'no_lit_regexp.js'))
    file = File.open(path){ |f| f.read }
    result = @parser.parse(file)
    assert !result.nil?
  end
end
