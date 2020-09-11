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
  const valueKey = `${PREFIX}__value__${keyName}`
  const [state, setState] = useState(() => getItem(valueKey, initialValue))

  useEffect(() => {
    setState(initialValue)
    setItem(
      `${PREFIX}__initial_value_hash__${keyName}`,
      initialValue === undefined ? undefined : hash(initialValue)
    )
  }, [initialValue])

  useEffect(() => {
    setItem(valueKey, state)
  }, [valueKey, state])

  return [state, setState]
}

export default useLocalStorageState
