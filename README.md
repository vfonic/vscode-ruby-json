# ruby-json

Convert Ruby rocket hash to JSON.

```ruby
{
  :topic => "heated_debate",
  :participants => 7,
  :owner => nil
}
```

Converts to:

```js
{
  "topic" => "heated_debate",
  "participants" => 7,
  "owner" => null
}
```

## Usage

Select text and run `ruby-json.convertToJson` VS Code command.
If the selection is empty, it will try to convert the entire document.
