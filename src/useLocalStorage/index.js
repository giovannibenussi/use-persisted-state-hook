import { useEffect, useState } from 'react'
import hash from 'object-hash'

const PREFIX = '__use_local_storage_state_hook'

const getValue = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
  } catch (error) {
    console.error('useLocalStorageState: ', error)
  }

  return fallback
}

const setValue = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const useLocalStorageState = (keyName, initialValue) => {
  const prefix = `${PREFIX}__${keyName}_`
  const key = `${prefix}_value`
  const storedInitialValueKey = `${prefix}_initial_value_hash`
  const [state, setState] = useState(getValue(key, initialValue))

  useEffect(() => {
    setState(initialValue)
    if (initialValue !== undefined) {
      setValue(storedInitialValueKey, hash(initialValue))
    }
  }, [storedInitialValueKey, initialValue])

  useEffect(() => {
    setValue(key, state)
  }, [key, state])

  return [state, setState]
}

export default useLocalStorageState
