import { decrypt, encrypt } from '../utils'

const local = {
  add: ({ key, value }: { key: string; value: object }) => {
    localStorage.setItem(key, JSON.stringify(encrypt(JSON.stringify(value))))
  },
  remove: (key: string) => localStorage.removeItem(key),
  get: (key: string) => {
    const data = localStorage.getItem(key)

    return !data ? null : JSON.parse(decrypt(JSON.parse(data)))
  },
  clear: () => localStorage.clear()
}

const session = {
  add: ({ key, value }: { key: string; value: object }) => {
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  remove: (key: string) => sessionStorage.removeItem(key),
  get: (key: string) => {
    const data = sessionStorage.getItem(key)

    return data === null ? null : JSON.parse(data)
  },
  clear: () => sessionStorage.clear()
}

const storage = { local, session }

export default storage
