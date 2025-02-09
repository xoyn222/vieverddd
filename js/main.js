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

let originalBodyStyle = ""; // Храним оригинальные стили body

function openModelViewer(modelPath) {
    // Сохраняем текущие стили перед скрытием
    originalBodyStyle = document.body.style.cssText;

    document.body.style.overflow = "hidden"; // Отключаем скролл
    document.body.style.display = "none"; // Скрываем сайт

    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.background = "black";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "1000";
    document.body.parentElement.appendChild(modal);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    modal.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load(modelPath, gltf => {
        scene.add(gltf.scene);
    }, undefined, error => console.error("Ошибка загрузки GLTF:", error));

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();


    // UI-Элементы (не мешают взаимодействию с 3D Viewer)
    const atopViewerHeader = document.createElement("img");
    atopViewerHeader.src = "css/assets/AtopViewerHeader.png";
    atopViewerHeader.style.position = "absolute";
    atopViewerHeader.style.top = "0%";
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
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.width = "50px";
    closeButton.style.height = "50px";
    closeButton.style.background = "transparent";
    closeButton.style.border = "none";
    closeButton.style.opacity = "0";
    closeButton.style.cursor = "pointer";
    closeButton.style.zIndex = "1300";

    closeButton.addEventListener("click", () => {
        document.body.style.cssText = originalBodyStyle; // Восстанавливаем стили
        modal.remove();
    });

    modal.appendChild(closeButton);
}