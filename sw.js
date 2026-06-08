const CACHE_NAME = 'truth-dare-cache-v4';

// Укажите здесь имя вашего HTML-файла, если оно отличается, например 'index.html'
const urlsToCache = [
  './',
  './index.html' 
];

// Установка сервис-воркера и кэширование файлов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Открыт кэш');
        return cache.addAll(urlsToCache);
      })
  );
});

// Активация и удаление старых кэшей при обновлении (если поменяете CACHE_NAME)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Перехват запросов: отдаем из кэша, если есть, иначе идем в сеть
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Файл найден в кэше
        }
        return fetch(event.request); // Запрос к сети
      })
  );
});
