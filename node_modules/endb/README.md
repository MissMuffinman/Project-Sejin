# `endb`

> Key-value storage for multiple databases

## Usage

```javascript
const Endb = require('endb');

const endb = new Endb();
const endb = new Endb({
  store: new Map(),
  namespace: 'cache',
});
```
