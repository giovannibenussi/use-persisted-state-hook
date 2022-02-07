import { renderHook, act } from '@testing-library/react-hooks'
import useLocalStorageState, { hash } from '.'

beforeEach(() => {
  localStorage.clear()
})

const setItemImperatively = (key, value) => {
  if (value !== undefined) {
    localStorage.setItem(
      `__use_local_storage_state_hook__${key}__initial_value_hash`,
      hash(value)
    )
  }
  localStorage.setItem(
    `__use_local_storage_state_hook__${key}__value`,
    JSON.stringify(value)
  )
}

test('stores a key for the initial value hash and one for the current value', () => {
  renderHook(() => useLocalStorageState('element_key', 'value'))

  expect(Object.keys(localStorage.__STORE__)).toEqual(
    expect.arrayContaining([
      '__use_local_storage_state_hook__initial_value_hash__element_key',
      '__use_local_storage_state_hook__value__element_key',
    ])
  )
})

test('returns the initial value the first time is called', () => {
  const { result } = renderHook(() => useLocalStorageState('key', 'value'))

  const [value] = result.current

  expect(value).toBe('value')
})

test('persist the initial value to localStorage', () => {
  renderHook(() => useLocalStorageState('key', 'value'))

  expect(localStorage.setItem).toHaveBeenLastCalledWith(
    expect.anything(),
    JSON.stringify('value')
  )
})

test('allows to update the current state', () => {
  const { result } = renderHook(() => useLocalStorageState('key', 'value'))

  act(() => {
    const [, setValue] = result.current
    setValue('newValue')
  })

  expect(result.current[0]).toBe('newValue')
})

test('persists the updated value to localStorage', () => {
  const { result } = renderHook(() => useLocalStorageState('key', 'value'))

  act(() => {
    const [, setValue] = result.current
    setValue('newValue')
  })

  expect(localStorage.setItem).toHaveBeenLastCalledWith(
    expect.anything(),
    JSON.stringify('newValue')
  )
})

test('updates the value if the initial state changes', () => {
  let initialValue = 'value'
  const { rerender, result } = renderHook(() =>
    useLocalStorageState('key', initialValue)
  )

  initialValue = 'newValue'
  rerender()

  expect(result.current[0]).toBe('newValue')
})

test("doesn't create a new record in localStorage when the initial state changes", () => {
  let initialValue = 'value'
  const { rerender } = renderHook(() =>
    useLocalStorageState('key', initialValue)
  )

  expect(Object.keys(localStorage.__STORE__).length).toBe(2)

  initialValue = 'newValue'
  rerender()

  expect(Object.keys(localStorage.__STORE__).length).toBe(2)
})

test('updates the value in localStorage if the initial state changes', () => {
  let initialValue = 'value'
  const { rerender } = renderHook(() =>
    useLocalStorageState('key', initialValue)
  )

  initialValue = 'newValue'
  rerender()

  expect(localStorage.setItem).toHaveBeenLastCalledWith(
    expect.anything(),
    JSON.stringify('newValue')
  )
})

test('updates the value in localStorage if the initial state type changes', () => {
  let initialValue = 'value'
  const { rerender } = renderHook(() =>
    useLocalStorageState('key', initialValue)
  )

  initialValue = 1
  rerender()

  expect(localStorage.setItem).toHaveBeenLastCalledWith(
    expect.anything(),
    JSON.stringify(1)
  )
})

test('updates the value in localStorage if the initial state shape changes', () => {
  let initialValue = { name: 'giovanni' }
  const { rerender } = renderHook(() =>
    useLocalStorageState('key', initialValue)
  )

  initialValue = { name: 'john' }
  rerender()

  expect(localStorage.setItem).toHaveBeenLastCalledWith(
    expect.anything(),
    JSON.stringify({ name: 'john' })
  )
})

//test('updates the value in localStorage if the initial state changes from a function to another function', () => {
//let initialValue = { name: 'giovanni' }
//const { rerender } = renderHook(() =>
//useLocalStorageState('key', () => 'value')
//)

//initialValue = () => ('newValue')
//rerender()

//expect(localStorage.setItem).toHaveBeenLastCalledWith(
//expect.anything(),
//JSON.stringify('newValue')
//)
//})

test('when the initial value is a function it returns its value the first time is called', () => {
  const { result } = renderHook(() =>
    useLocalStorageState('key', () => 'value')
  )

  const [value] = result.current

  expect(value).toBe('value')
})

test('when the initial value is a function it persist its value to localStorage', () => {
  renderHook(() => useLocalStorageState('key', () => 'value'))

  expect(localStorage.setItem).toHaveBeenLastCalledWith(
    expect.anything(),
    JSON.stringify('value')
  )
})

test('allows to call setState using a function', () => {
  const { result } = renderHook(() => useLocalStorageState('key', 'value'))

  act(() => {
    const [, setValue] = result.current
    setValue(() => 'newValue')
  })

  expect(result.current[0]).toBe('newValue')
})

test('accepts integers', () => {
  const { result } = renderHook(() => useLocalStorageState('key', 123))

  const [value] = result.current

  expect(value).toBe(123)
  expect(localStorage.setItem).toHaveBeenLastCalledWith(
    expect.anything(),
    JSON.stringify(123)
  )
})

test('accepts floats', () => {
  const { result } = renderHook(() => useLocalStorageState('key', 1.23))

  const [value] = result.current

  expect(value).toBe(1.23)
  expect(localStorage.setItem).toHaveBeenLastCalledWith(
    expect.anything(),
    JSON.stringify(1.23)
  )
})

test('accepts undefined', () => {
  const { result } = renderHook(() => useLocalStorageState('key', undefined))

  const [value] = result.current

  expect(value).toBe(undefined)
  expect(localStorage.setItem).toHaveBeenLastCalledWith(
    expect.anything(),
    JSON.stringify(undefined)
  )
})

test('accepts arrays with different types of data', () => {
  const { result } = renderHook(() =>
    useLocalStorageState('key', [123, 'string', { name: 'giovanni' }])
  )

  const [value] = result.current

  expect(value).toMatchObject([123, 'string', { name: 'giovanni' }])
  expect(localStorage.setItem).toHaveBeenLastCalledWith(
    expect.anything(),
    JSON.stringify([123, 'string', { name: 'giovanni' }])
  )
})

test('it loads integers from previously saved data', () => {
  setItemImperatively('key', '123')
  const { result } = renderHook(() => useLocalStorageState('key', 123))

  const [value] = result.current

  expect(value).toBe(123)
})

test('it loads arrays from previously saved data', () => {
  setItemImperatively('key', [456, 'string', { name: 'giovanni' }])
  const { result } = renderHook(() =>
    useLocalStorageState('key', [456, 'string', { name: 'giovanni' }])
  )

  const [value] = result.current

  expect(value).toMatchObject([456, 'string', { name: 'giovanni' }])
})

test('it does not load null from previously saved data', () => {
  setItemImperatively('key', null)
  const { result } = renderHook(() => useLocalStorageState('key', 123))

  const [value] = result.current

  expect(value).toBe(123)
})

test('works without an initial value', () => {
  const { result } = renderHook(() => useLocalStorageState('key'))

  const [value] = result.current

  expect(value).toBe(undefined)
})

const setItemCalls = () => localStorage.setItem.mock.calls.length
const getItemCalls = () => localStorage.getItem.mock.calls.length

test('it calls to localStorage.setItem two times if it runs once', () => {
  const initialCalls = setItemCalls()
  renderHook(() => useLocalStorageState('key', 'value'))

  const difference = setItemCalls() - initialCalls

  expect(difference).toBe(2)
})

test('it calls to localStorage.setItem one time after call update state', () => {
  const { result } = renderHook(() => useLocalStorageState('key', 'value'))
  const initialCalls = setItemCalls()

  act(() => {
    const [, setValue] = result.current
    setValue('newValue')
  })

  const difference = setItemCalls() - initialCalls

  expect(difference).toBe(1)
})

test('it does not call setItem if call update state with the same value', () => {
  const { result } = renderHook(() => useLocalStorageState('key', 'value'))
  const initialCalls = setItemCalls()

  act(() => {
    const [, setValue] = result.current
    setValue('value')
  })

  const difference = setItemCalls() - initialCalls

  expect(difference).toBe(0)
})

test('calls to localStorage.setItem three times after update the initial value', () => {
  let initialValue = 'value'
  const { rerender } = renderHook(() =>
    useLocalStorageState('key', initialValue)
  )

  const initialCalls = setItemCalls()
  initialValue = 'newValue'
  rerender()
  const difference = setItemCalls() - initialCalls

  expect(difference).toBe(3)
})

test('allows to update state with a function', () => {
  const { result } = renderHook(() => useLocalStorageState('count', 0))

  act(() => {
    const [, setValue] = result.current
    setValue((c) => c + 1)
  })

  expect(result.current[0]).toBe(1)
})

test.skip('calls localStorage.getItem once to retrieve the initial value even if it rerenders', () => {
  const initialCalls = getItemCalls()
  const { rerender } = renderHook(() => useLocalStorageState('key', 'value'))

  rerender()
  rerender()
  rerender()

  const difference = getItemCalls() - initialCalls

  expect(difference).toBe(1)
})

test('works if window is not defined', () => {
  const { result } = renderHook(() => useLocalStorageState('key', 'value'))

  const [value] = result.current

  expect(value).toBe('value')
})
