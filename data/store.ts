import { createStore } from 'redux'

import rootReducer from './reducer'

const STORAGE_KEY = 'application-state'

function saveToLocalStorage(state: any) {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(STORAGE_KEY, serializedState)
  } catch (e) {}
}

function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY)
    if (serializedState === null) return undefined
    return JSON.parse(serializedState)
  } catch (e) {
    return undefined
  }
}

const store = createStore(rootReducer, loadFromLocalStorage())

store.subscribe(() => saveToLocalStorage(store.getState()))

export default store
