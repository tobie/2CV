require File.expand_path(File.join(File.dirname(__FILE__), 'test_helper'))

class JSProgramTest < Test::Unit::TestCase
  include TestHelper
  
  def setup
    @parser = JSProgramParser.new
  end
  
  def test_external_file_with_no_regexp_lieterals
   path = File.expand_path(File.join(File.dirname(__FILE__), '..', 'fixtures', 'no_lit_regexp.js'))
   assert_parsed(File.open(path){ |f| f.read })

  end
  
  def test_external_file_with_regexp_literals
    path = File.expand_path(File.join(File.dirname(__FILE__), '..', 'fixtures', 'lit_regexp.js'))
    assert_parsed(File.open(path){ |f| f.read })
  end
  
  def test_external_file_with_regexp_literals_and_division
    path = File.expand_path(File.join(File.dirname(__FILE__), '..', 'fixtures', 'lit_regexp_and_div.js'))
  #  assert_parsed(File.open(path){ |f| f.read })
  end
  
  def test_parse_regexp_lieterals
    assert_parsed('/foo/g')
  end
  
  def test_parse_division
    assert_parsed('2 / 3')
  end
end

