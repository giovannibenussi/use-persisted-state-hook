import { useEffect, useState } from 'react'
import hash from 'object-hash'

const PREFIX = '__use_local_storage_state_hook'

const getItem = (key, fallback) => {
  try {
    const value = window.localStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
  } catch (error) {
    console.error('error in useLocalStorageState: ', error)
  }

  return fallback
}

const setItem = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

const useLocalStorage = (key, value) => {
  useEffect(() => {
    setItem(key, value)
  }, [key, value])
}

const useLocalStorageState = (keyName, initialValue) => {
  const valueKey = `${PREFIX}__value__${keyName}`
  const hashKey = `${PREFIX}__initial_value_hash__${keyName}`
  const [state, setState] = useState()

  useEffect(
    () =>
      setState(() =>
        getItem(
          valueKey,
          initialValue instanceof Function ? initialValue() : initialValue
        )
      ),
    []
  )

  const initialValueHash =
    initialValue === undefined ? undefined : hash(initialValue)
  useEffect(() => setState(initialValue), [initialValueHash])
  useLocalStorage(hashKey, initialValueHash)
  useLocalStorage(valueKey, state)

  return [state, setState]
}

export default useLocalStorageState
