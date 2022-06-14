<p align="center" width="100%">
  <img src="https://raw.githubusercontent.com/giovannibenussi/use-persisted-state-hook/master/usePersistedState.svg">
</p>

[![npm version](https://badge.fury.io/js/use-persisted-state-hook.svg)](https://badge.fury.io/js/use-persisted-state-hook)

**Lightweight, resilient persisted useState.**

Features:

- 📦 Persist state on localStorage between browser sessions.
- ⚛️ Automatically handle state's shape updates.
- 🔄 Handle stale states when initial state changes.
- ✅ Similar interface to React's official useState hook.
- ✨ Server Side Render Support.

# Installation

npm:

```sh
npm install use-persisted-state-hook
```

yarn:

```sh
yarn add use-persisted-state-hook
```

# Detect Changes in Initial State

`use-persisted-state-hook` is the only library that handles changes in initial state gracefully. Leet's imagine that you have a hook called `useLocalStorage` like the one provided [here](https://usehooks.com/useLocalStorage/). It has the same API that [useState](https://reactjs.org/docs/hooks-reference.html#usestate) and looks like this:

```jsx
function Greet() {
  const [visits, setVisits] = useLocalStorage('visits', 0)

  // Logic to update visits...

  return (
    <div>Visits count is {visits}</div>
  )
}
```

Now, imagine that you want to update the initial state to it stores more information:

```jsx
function Greet() {
  const [visits, setVisits] = useLocalStorage('visits', { today: 0, total: 0 }))

  // Logic to update visits...

  return (
    <div>
      <div>Today's count is {visits.today}</div>
      <div>Total count is {visits.total}</div>
    </div>
  )
}
```

The code above works, however, there's a pitfall. A user that
loaded your app after you released the first version, so the value it has stored
for `visits` is `0` (or `1`, or `5`, or any integer). When they load your app again with the new logic, they'll
see "Today's count is " and "Total count is ".

`usePersistedState` is the only library that handles this case gracefully by
storing an identifier that identifies uniquely the
initial state so, whenever it changes, the state it's going to be reset and
you'd never have to think about this issue in the first place ✨

# Usage

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
