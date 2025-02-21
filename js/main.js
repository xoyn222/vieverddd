import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import {OrbitControls} from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".window-container").forEach(button => {
        button.addEventListener("click", function () {
            const modelPath = this.getAttribute("data-model");
            openModelViewer(modelPath);
        });
    });
});


let originalBodyStyle = "";

function openModelViewer(modelPath) {
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

    const loadingIndicator = document.createElement("img");
    loadingIndicator.src = "https://i.ibb.co/R404xf2R/loading-windows98.gif";
    loadingIndicator.style.position = "absolute";
    loadingIndicator.style.maxWidth = "100px";
    loadingIndicator.style.top = "50%";
    loadingIndicator.style.left = "50%";
    loadingIndicator.style.transform = "translate(-50%, -50%)";
    loadingIndicator.style.zIndex = "1200";
    modal.appendChild(loadingIndicator);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.8);

    const renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff);
    modal.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.minDistance = 0.5;
    controls.maxDistance = 1;

    // Студийное освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-1, -1, 1);
    scene.add(directionalLight2);

    const loader = new GLTFLoader(); // Создаем экземпляр перед использованием

    loader.load(modelPath, gltf => {
        if (modal.contains(loadingIndicator)) {
            modal.removeChild(loadingIndicator);
        }

        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);

        model.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xA5A5A5,
                    metalness: 0.98,
                    roughness: 0.6
                });
            }
        });

        scene.add(model);

        const mixer = new THREE.AnimationMixer(model);
        let clock = new THREE.Clock();
        if (gltf.animations.length > 0) {
            const action = mixer.clipAction(gltf.animations[0]);
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.play();
        }

        function animate() {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            mixer.update(delta);
            controls.update();
            renderer.render(scene, camera);
        }

        animate();
    }, undefined, error => {
        console.error("Ошибка загрузки GLTF:", error);
        if (modal.contains(loadingIndicator)) {
            modal.removeChild(loadingIndicator);
        }
    });


    // UI-Элементы (не мешают взаимодействию с 3D Viewer)
    // Создаем контейнер для заголовка
    const atopViewerHeaderContainer = document.createElement("div");
    atopViewerHeaderContainer.style.position = "absolute"; // Позволяет позиционировать элементы внутри
    atopViewerHeaderContainer.style.top = "0";
    atopViewerHeaderContainer.style.left = "50%";
    atopViewerHeaderContainer.style.transform = "translateX(-50%)"; // Центрируем по горизонтали
    atopViewerHeaderContainer.style.width = "100%";
    atopViewerHeaderContainer.style.maxWidth = "100%";
    atopViewerHeaderContainer.style.zIndex = "1300";

// Создаем изображение заголовка
    const atopViewerHeader = document.createElement("img");
    atopViewerHeader.src = "https://i.ibb.co/7N6HF5f3/Atop-Viewer-Header2.png";
    atopViewerHeader.style.width = "100%";
    atopViewerHeader.style.pointerEvents = "none"; // НЕ блокирует клики

// **Кнопка закрытия**
    const closeButton = document.createElement("button");
    closeButton.style.position = "absolute";
    closeButton.style.top = "22%"; // Регулируйте положение относительно заголовка
    closeButton.style.right = "84%";
    closeButton.style.width = "10%";
    closeButton.style.height = "17%";
    closeButton.style.background = "transparent";
    closeButton.style.opacity = "50%";
    closeButton.style.border = "none";
    closeButton.style.zIndex = "1300";

    const secondCloseButton = document.createElement("button");
    secondCloseButton.style.position = "absolute";
    secondCloseButton.style.top = "1%"; // Регулируйте положение относительно заголовка
    secondCloseButton.style.right = "0%";
    secondCloseButton.style.width = "15%";
    secondCloseButton.style.height = "15%";
    secondCloseButton.style.background = "transparent";
    secondCloseButton.style.opacity = "50%";
    secondCloseButton.style.border = "none";
    secondCloseButton.style.zIndex = "1300";


// Событие нажатия
    closeButton.addEventListener("click", () => {
        document.body.style.cssText = originalBodyStyle;
        modal.remove();
    });

    secondCloseButton.addEventListener("click", () => {
        document.body.style.cssText = originalBodyStyle;
        modal.remove();
    });

// Добавляем элементы в контейнер
    atopViewerHeaderContainer.appendChild(atopViewerHeader);
    atopViewerHeaderContainer.appendChild(closeButton);
    atopViewerHeaderContainer.appendChild(secondCloseButton);

// Добавляем контейнер в `modal`
    modal.appendChild(atopViewerHeaderContainer);

    const atopViewerBody = document.createElement("img");
    atopViewerBody.src = "https://i.ibb.co/ccDzBDDG/Atop-Viewer-Body.png";
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
    atopViewerFooter.src = "https://i.ibb.co/VYQtwmbn/Atop-Viewer-Footer2.png";
    atopViewerFooter.style.position = "absolute";
    atopViewerFooter.style.bottom = "0%";
    atopViewerFooter.style.width = "100%";
    atopViewerFooter.style.maxWidth = "100%";
    atopViewerFooter.style.zIndex = "1200";
    atopViewerFooter.style.pointerEvents = "none"; // НЕ блокирует клики
    modal.appendChild(atopViewerFooter);

    const hiddenButton = document.createElement("button");
    hiddenButton.style.position = "absolute";
    hiddenButton.style.bottom = "2%";
    hiddenButton.style.left = "50%";
    hiddenButton.style.transform = "translateX(-50%)";
    hiddenButton.style.width = "35%";
    hiddenButton.style.height = "5%";
    hiddenButton.style.border = "none";
    hiddenButton.style.background = "transparent";
    hiddenButton.style.zIndex = "1400";
    hiddenButton.addEventListener("click", () => {
        window.open("https://artasimn.com", "_blank");
    });
    modal.appendChild(hiddenButton);

}