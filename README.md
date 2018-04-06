# Store Repository

it's a simple and powerful singleton management. The primary use is for Mobx Store, but it can be use as singleton system as well.

## Requirement

* you must have react install (it has a built-in inject HOC)
* you must use flow-type or have flow-type-strip in your babel config

## Benefits

* Simple APIs

  * repository: has two method for `set` and `get`
  * inject: HOC uses class definition for finding instance

* SSR safe, as it required to initialize it prior to use it

```js
import repo from 'store-repository'

const { repository, inject } = repo()
```
