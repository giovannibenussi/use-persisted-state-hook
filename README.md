<p align="center" width="100%">
  <img src="https://raw.githubusercontent.com/giovannibenussi/use-persisted-state/master/usePersistedState.svg">
</p>

**Lightweight, resilient persisted useState.**

Features:

- 📦 Persist state on localStorage between browser sessions.
- ⚛️ Automatically handle state's shape updates.
- 🔄 Handle stale states when initial state changes.
- ✅ Similar interface to React's official useState hook.
- ✨ Server Side Render Support.

# Examples

```jsx
import React from 'react'
import usePersistedState from 'use-persisted-state'

function Counter() {
  const [count, setCount] = usePersistedState('count', 0)

  return (
    <div>
      <div>Count is {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  )
}

export default Counter
```
