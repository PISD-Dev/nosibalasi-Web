'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "792bcfe6be3532ac635f76d574dd6196",
"assets/AssetManifest.bin.json": "dbe1c572244ba83206b9e332013ce899",
"assets/AssetManifest.json": "497ebf64c9983a470486130f6219e108",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "b0dd479b41b770664a99e6477de77a60",
"assets/lib/assets/media/images/github_logo.png": "eb94bb97c3410733ce017b184d314723",
"assets/lib/assets/media/images/kodigo_me_logo.png": "4b810920a3bca744930cca1b267e322f",
"assets/lib/assets/media/images/nosi_logo.png": "4f860e2212011fb84376ea310e2f7541",
"assets/lib/assets/translations/bik.json": "c3cf87187e66e60a7e6057d532850307",
"assets/lib/assets/translations/bis.json": "c3cf87187e66e60a7e6057d532850307",
"assets/lib/assets/translations/ceb.json": "c3cf87187e66e60a7e6057d532850307",
"assets/lib/assets/translations/en.json": "cfc32851cff47c1b2ef1fca89a7027e6",
"assets/lib/assets/translations/fil.json": "c3cf87187e66e60a7e6057d532850307",
"assets/lib/assets/translations/hil.json": "c3cf87187e66e60a7e6057d532850307",
"assets/lib/assets/translations/ilo.json": "c3cf87187e66e60a7e6057d532850307",
"assets/lib/assets/translations/kam.json": "c3cf87187e66e60a7e6057d532850307",
"assets/lib/assets/translations/language_map.dart": "58024e01ff743352d395b6b212e9814c",
"assets/lib/assets/translations/mdh.json": "c3cf87187e66e60a7e6057d532850307",
"assets/lib/assets/translations/pag.json": "c3cf87187e66e60a7e6057d532850307",
"assets/lib/assets/translations/tl.json": "c3cf87187e66e60a7e6057d532850307",
"assets/lib/assets/translations/war.json": "c3cf87187e66e60a7e6057d532850307",
"assets/NOTICES": "590f25476d5b0cab6d08620f2470ea2d",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "86e461cf471c1640fd2b461ece4589df",
"canvaskit/canvaskit.js.symbols": "68eb703b9a609baef8ee0e413b442f33",
"canvaskit/canvaskit.wasm": "efeeba7dcc952dae57870d4df3111fad",
"canvaskit/chromium/canvaskit.js": "34beda9f39eb7d992d46125ca868dc61",
"canvaskit/chromium/canvaskit.js.symbols": "5a23598a2a8efd18ec3b60de5d28af8f",
"canvaskit/chromium/canvaskit.wasm": "64a386c87532ae52ae041d18a32a3635",
"canvaskit/skwasm.js": "f2ad9363618c5f62e813740099a80e63",
"canvaskit/skwasm.js.symbols": "80806576fa1056b43dd6d0b445b4b6f7",
"canvaskit/skwasm.wasm": "f0dfd99007f989368db17c9abeed5a49",
"canvaskit/skwasm_st.js": "d1326ceef381ad382ab492ba5d96f04d",
"canvaskit/skwasm_st.js.symbols": "c7e7aac7cd8b612defd62b43e3050bdd",
"canvaskit/skwasm_st.wasm": "56c3973560dfcbf28ce47cebe40f3206",
"favicon.ico": "554bc41291a30eee9b876575faa9933b",
"favicon.png": "1b9ac70e9bdb948e1de09b36ffed68bb",
"favicon.svg": "60cbdea7c2a04cea18cab992863e6275",
"flutter.js": "76f08d47ff9f5715220992f993002504",
"flutter_bootstrap.js": "60f28722434f80dfc95649d20cc5a17a",
"icons/apple-touch-icon.png": "73c0ba06f9d6cdb623a785fdd214b9c5",
"icons/Icon-192.png": "ab21be32b06731532e201dc718d73fba",
"icons/Icon-512.png": "4342d37e56f8b4209c94223b9a62c657",
"icons/Icon-maskable-192.png": "74cba687e698528d9fe70f711a9e02de",
"icons/Icon-maskable-512.png": "16a6a4e9629bc3ec07568191f8102b59",
"index.html": "00716507b37b2428f93df2c0d4ae55a4",
"/": "00716507b37b2428f93df2c0d4ae55a4",
"main.dart.js": "7e2fec76c7f46a35917262dd7b00356a",
"manifest.json": "d23a4dcec5bb4f6369a3e50583dd4563",
"version.json": "9856ffac2adad0d6fc0db02dff02b284"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
