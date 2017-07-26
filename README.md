# Overview

**Blockdown** is a writing format that makes it easy to create beautiful, interactive [curriculum](curriculum) and [documentation](documentation). It is an extension of **markdown**, a writing format that uses plain text to add formatting to documents.

## Install

Install via npm.

```
npm install --save blockdown-render
```

Render with JS.

```javascript
render = require('blockdown-render')

document = render('blockdown document', {
	dir: 'template/directory',
	template: 'template to insert document into'
})
```

## Documents

A Blockdown document uses three dashes `---` placed on its own line to separate content into logical "blocks".

```
first block
---
second block
---

third block
... and so on ...
```

## Blocks

A block can begin with any number of `@key value` pairs. The key can be any valid JavaScript key, and the value must be a JSON formatted value like `42` or `"literal string"`. Since the value is consumed with `JSON.parse`, you can provide any valid JSON as the value for the key.

```markdown
@title "Getting Started"
@template "get-started"
@length 10

This is how you get started, it should take around ten minutes.
- do this
- then this
- and finally this

---
@title "Write Something!"
@length 15
@standard ["CCSS.MATH.CONTENT.8.NS.A.1", "K12CS.K–2.Impacts of Computing.Social Interactions"]

This content aligns with standards, and a template can now link to them.

---

This is just *markdown with no key-value pairs*.

[link to something](https://anything.com)

> This is a block quote

```

## Templates

Templates are rendered with [Nunjucks](https://mozilla.github.io/nunjucks)
