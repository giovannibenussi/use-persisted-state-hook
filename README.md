<p align="center" width="100%">
  <img src="https://raw.githubusercontent.com/giovannibenussi/use-persisted-state-hook/master/usePersistedState.svg">
</p>

**Lightweight, resilient persisted useState.**

Features:

- 📦 Persist state on localStorage between browser sessions.
- ⚛️ Automatically handle state's shape updates.
- 🔄 Handle stale states when initial state changes.
- ✅ Similar interface to React's official useState hook.
- ✨ Server Side Render Support.

# Examples

## Simple Example

```jsx
import React from 'react'
import usePersistedState from 'use-persisted-state-hook'

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

## Elaborated Example

Expected output

<p align="center" width="100%">
  <img src="https://raw.githubusercontent.com/giovannibenussi/use-persisted-state-hook/master/ui-example.png" width="50%">
</p>

Code (styles ommited):

```jsx
import React from 'react'
import usePersistedState from 'use-persisted-state-hook'

function Settings() {
  const [options, setOptions] = usePersistedState('options', [
    { title: 'Dark Mode', name: 'dark_mode', enabled: true },
    { title: 'Data Saving 2', name: 'data_saving', enabled: true },
  ])

  const onClick = (e) => {
    setOptions(
      options.map((option) =>
        option.name === e.target.name
          ? { ...option, enabled: !option.enabled }
          : option
      )
    )
  }

  return (
    <div>
      {options.map((option) => (
        <label>
          <input
            type="checkbox"
            name={option.name}
            checked={option.enabled}
            onClick={onClick}
          />{' '}
          {option.title}
        </label>
      ))}
    </div>
  )
}
```
