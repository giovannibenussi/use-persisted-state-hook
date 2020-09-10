import { useEffect, useState } from 'react'
import hash from 'object-hash'

const PREFIX = '__use_local_storage_state_hook'

const getItem = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
  } catch (error) {
    console.error('error in useLocalStorageState: ', error)
  }

  return fallback
}

const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const useLocalStorageState = (keyName, initialValue) => {
  const prefix = `${PREFIX}`
  const key = `${prefix}__value__${keyName}`
  const storedInitialValueKey = `${prefix}__initial_value_hash__${keyName}`
  const [state, setState] = useState(() => getItem(key, initialValue))

  useEffect(() => {
    setState(initialValue)
    if (initialValue !== undefined) {
      setItem(storedInitialValueKey, hash(initialValue))
    }
  }, [storedInitialValueKey, initialValue])

  useEffect(() => {
    setItem(key, state)
  }, [key, state])

  return [state, setState]
}

export default useLocalStorageState
