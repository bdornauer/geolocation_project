self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('geoloc-game-v1')
            .then(cache => cache.addAll([
                'index.html',
                'leaflet.css',
                'style.css',
                'leaflet.js',
                'main.js',
                'icon512.png',
                'icon192.png',
                'icon16.png',
                'maskable-icon512.png',
                'manifest.webmanifest'
            ]))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open('ebmigis-v1').then((cache) => {
            return fetch(event.request)
                .then((response) => {
                    cache.put(event.request, response.clone());
                    return response;
                })
                .catch(() => cache.match(event.request));
        })
    );
});
