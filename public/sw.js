//  ---->>>>>>>>>>>>> static keys
const version = '0.6.16'
const CACHE_NAME = `application-assets:[${version}]`

const URL_LIST = [
  'api.denaurlen.dev',
  'api.denaurlen.com',
  'maps.googleapis.com',
  'googletagmanager.com',
  'amazonaws.com',
  'denaurlen-dev.s3.ap-south-1.amazonaws.com',
  'denaurlen-main.s3.ap-south-1.amazonaws.com'
]

const assets = ['/']

const isImage = fetchRequest => fetchRequest.method === 'GET' && fetchRequest.destination === 'image'

// ----> install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(assets))
      .catch(() => {})
  )
})

// ----> Activating sw
self.addEventListener('activate', evt => {
  let cacheWhiteList = [CACHE_NAME]
  evt.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhiteList.indexOf(cacheName) === -1) {
            return caches.delete(cacheName).catch(() => {})
          }
        })
      )
    )
  )
})

// =====> fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        return (
          response ||
          fetch(event.request)
            .then(response => {
              const res = response.clone()
              if (
                response.status !== 206 &&
                !isImage(event.request) &&
                !URL_LIST.some(url => res.url.includes(url))
              )
                cache.put(event.request, res).catch(() => {})
              return response
            })
            .catch(() => {})
        )
      })
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()

  event.waitUntil(
    clients
      .matchAll({
        type: 'window'
      })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) return client.focus()
        }
        if (clients.openWindow) return clients.openWindow('/')
      })
  )
})

const messageHandler = () => {
  const time = new Date()

  const now = {
    hours: time.getHours(),
    minutes: time.getMinutes()
  }

  if (now.hours === 8 && now.minutes === 0)
    self.registration.showNotification('Denaurlen', {
      body: "It's a beautiful day outside",
      icon: './icons/icon-512x512.png',
      tag: 'morning-push-notification'
    })

  if (now.hours === 20 && now.minutes === 30)
    self.registration.showNotification('Denaurlen', {
      body: 'Checkout who is top on the leaderboard',
      icon: './icons/icon-512x512.png',
      tag: 'evening-push-notification'
    })
}

const initMessage = () => {
  let intervalRef
  try {
    const interval = 1000 * 30 // 👉 THIRTY SECONDS
    intervalRef = setInterval(messageHandler, interval)
  } catch (e) {
    if (intervalRef) clearInterval(intervalRef)
    initMessage()
  }
}

initMessage()
