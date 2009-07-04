require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSInputElementDivTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSInputElementDivParser.new
  end
end
