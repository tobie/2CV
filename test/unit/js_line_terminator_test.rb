require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSLineTerminatorTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSLineTerminatorParser.new
  end
  
  def test_LineTerminator
    assert_parsed "\n"
    assert_parsed <<-EOF

EOF
  end
end
