import { renderHook, act } from '@testing-library/react-hooks'
import useLocalStorageState from '.'

beforeEach(() => {
  localStorage.clear()
})

test('stores a key for the initial value hash and one for the current value', () => {
  renderHook(() => useLocalStorageState('element_key', 'value'))

  expect(Object.keys(localStorage.__STORE__)).toEqual(
    expect.arrayContaining([
      '__use_local_storage_state_hook__element_key__initial_value_hash',
      '__use_local_storage_state_hook__element_key__value'
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
  console.log('localStorage.__STORE__', localStorage.__STORE__)

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
