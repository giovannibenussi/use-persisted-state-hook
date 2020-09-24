import { useEffect, useState } from 'react'
import hash from 'object-hash'

const PREFIX = '__use_local_storage_state_hook'

const getItem = key => {
  try {
    const value = window.localStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
  } catch (error) {
    console.error('error in useLocalStorageState: ', error)
  }

  return undefined
}

const setItem = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

const useLocalStorageState = (keyName, initialValue) => {
  const hashKey = `${PREFIX}__initial_value_hash__${keyName}`
  const valueKey = `${PREFIX}__value__${keyName}`
  const [hasSetState, setHasSetState] = useState(false)
  const [state, setState] = useState(
    (typeof window !== 'undefined' && getItem(valueKey)) ||
      (initialValue instanceof Function ? initialValue() : initialValue)
  )

  const initialValueHash =
    initialValue === undefined ? undefined : hash(initialValue)
  useEffect(() => setState(initialValue), [initialValueHash])

  useEffect(() => {
    setItem(hashKey, initialValueHash)
  }, [hashKey, initialValueHash])

  useEffect(() => {
    if (hasSetState) {
      setItem(valueKey, state)
    } else {
      setState(() =>
        getItem(valueKey) || initialValue instanceof Function
          ? initialValue()
          : initialValue
      ),
        setHasSetState(true)
    }
  }, [keyName, hasSetState, initialValue, state])

  return [state, setState]
}

export default useLocalStorageState
