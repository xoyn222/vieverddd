import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".content-image").forEach(img => {
        img.addEventListener("click", () => {
            const modelPath = img.dataset.model;
            if (!modelPath) {
                console.error("Ошибка: путь к модели не задан!");
                return;
            }
            openModelViewer(modelPath);
        });
    });
});

let originalBodyStyle = "";

async function getCachedResource(url) {
    if ('caches' in window) {
        const cache = await caches.open("site-cache-v2");
        const cachedResponse = await cache.match(url);
        if (cachedResponse) {
            return cachedResponse.url; // Возвращаем URL из кэша
        }
    }
    return url; // Если в кэше нет, загружаем с сервера
}

async function openModelViewer(modelPath) {
    originalBodyStyle = document.body.style.cssText;
    document.body.style.overflow = "hidden";
    document.body.style.display = "none";

    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "white";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "1000";
    document.body.parentElement.appendChild(modal);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff);
    modal.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.minDistance = 0.15;
    controls.maxDistance = 1;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(0, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Загружаем модель из кэша, если она там есть
    const cachedModelPath = await getCachedResource(modelPath);
    const loader = new GLTFLoader();
    loader.load(cachedModelPath, gltf => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        scene.add(model);
    }, undefined, error => console.error("Ошибка загрузки GLTF:", error));

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // UI-Элементы (не мешают взаимодействию с 3D Viewer)
    // UI-Элементы (не мешают взаимодействию с 3D Viewer)
    const atopViewerHeader = document.createElement("img");
    atopViewerHeader.src = "css/assets/AtopViewerHeader.png";
    atopViewerHeader.style.position = "absolute";
    atopViewerHeader.style.top = "0";
    atopViewerHeader.style.left = "50%";
    atopViewerHeader.style.transform = "translate( -50%)";
    atopViewerHeader.style.width = "100%";
    atopViewerHeader.style.maxWidth = "100%";
    atopViewerHeader.style.zIndex = "1200";
    atopViewerHeader.style.pointerEvents = "none"; // НЕ блокирует клики
    modal.appendChild(atopViewerHeader);

    const atopViewerBody = document.createElement("img");
    atopViewerBody.src = "css/assets/AtopViewerBody.png";
    atopViewerBody.style.position = "absolute";
    atopViewerBody.style.top = "50%";
    atopViewerBody.style.left = "50%";
    atopViewerBody.style.transform = "translate(-50%, -50%)";
    atopViewerBody.style.height = "100%";
    atopViewerBody.style.width = "100%";
    atopViewerBody.style.maxWidth = "100%";
    atopViewerBody.style.zIndex = "1100";
    atopViewerBody.style.pointerEvents = "none"; // НЕ блокирует клики
    modal.appendChild(atopViewerBody);

    const atopViewerFooter = document.createElement("img");
    atopViewerFooter.src = "css/assets/AtopViewerFooter.png";
    atopViewerFooter.style.position = "absolute";
    atopViewerFooter.style.bottom = "0%";
    atopViewerFooter.style.width = "100%";
    atopViewerFooter.style.maxWidth = "100%";
    atopViewerFooter.style.zIndex = "1200";
    atopViewerFooter.style.pointerEvents = "none"; // НЕ блокирует клики
    modal.appendChild(atopViewerFooter);

    // **Невидимая кнопка закрытия**
    const closeButton = document.createElement("button");
    closeButton.style.position = "absolute";
    closeButton.style.top = "80px";
    closeButton.style.right = "83vw";
    closeButton.style.width = "50px";
    closeButton.style.height = "50px";
    closeButton.style.background = "transparent";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "50%";
    closeButton.style.cursor = "pointer";
    closeButton.style.zIndex = "1300";


    closeButton.addEventListener("click", () => {
        document.body.style.cssText = originalBodyStyle; // Восстанавливаем стили
        modal.remove();
    });

    modal.appendChild(closeButton);
}
    const CACHE_NAME = "site-cache-v2"; // Обнови версию кэша при изменениях
    const assetsToCache = [
        "css/assets/mouse-clicks.mp3",
        "css/assets/click-sound.mp3", // Добавь сюда другие звуковые файлы
        "css/assets/background-music.mp3", // Пример фоновой музыки
        "css/assets/MainWindow.png",
        "css/assets/Braclete01.png",
        "css/assets/Braclete02.png",
        "css/assets/Ring.png",
        "models/Bracelete01/Bracelete01.gltf",
        "models/Bracelete02/Bracelete02.gltf",
        "models/Ring/Ring.gltf",
        "js/main.js",
        "index.html",
    ];

// Установка Service Worker и кэширование ресурсов
    self.addEventListener("install", (event) => {
        event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.addAll(assetsToCache);
            })
        );
    });

// Перехват запросов и загрузка из кэша
    self.addEventListener("fetch", (event) => {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((fetchResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
        );
    });

// Очистка старого кэша при обновлении Service Worker
    self.addEventListener("activate", (event) => {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cache) => {
                        if (cache !== CACHE_NAME) {
                            return caches.delete(cache);
                        }
                    })
                );
            })
        );
    });