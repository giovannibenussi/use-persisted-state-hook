import { renderHook, act } from '@testing-library/react-hooks'
import useLocalStorageState from '.'
import hash from 'object-hash'

beforeEach(() => {
  localStorage.clear()
})

const setItemImperatively = (key, value) => {
  localStorage.setItem(
    `__use_local_storage_state_hook__${key}__initial_value_hash`,
    hash(value)
  )
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
      '__use_local_storage_state_hook__value__element_key'
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

//test("accepts undefined", () => {
//const { result } = renderHook(() => useLocalStorageState("key", undefined));

//const [value] = result.current;

//expect(value).toBe(undefined);
//expect(localStorage.setItem).toHaveBeenLastCalledWith(
//expect.anything(),
//JSON.stringify(undefined)
//);
//});

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
  setItemImperatively('key', [123, 'string', { name: 'giovanni' }])
  const { result } = renderHook(() =>
    useLocalStorageState('key', [123, 'string', { name: 'giovanni' }])
  )

  const [value] = result.current

  expect(value).toMatchObject([123, 'string', { name: 'giovanni' }])
})
