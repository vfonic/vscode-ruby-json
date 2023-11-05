# unfortunately, this is how we disable the warning:
# warning: parser/current is loading parser/ruby31, which recognizes 3.1.4-compliant syntax,
# but you are running 3.1.2. Please see https://github.com/whitequark/parser#compatibility-with-ruby-mri.
$VERBOSE = nil
require 'parser/current'

require 'json'

str = ARGF.read

# Use Parser to generate an Abstract Syntax Tree (AST)
buffer = Parser::Source::Buffer.new('(string)')
buffer.source = str
parser = Parser::CurrentRuby.new
tree = parser.parse(buffer)

raise 'Text is not a valid Ruby hash' if tree&.type != :hash

hash = eval(str)

print JSON.pretty_generate(hash)
