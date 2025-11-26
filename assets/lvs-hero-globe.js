(function () {
    if (typeof Cesium === "undefined") {
        console.error("Cesium is not loaded.");
        return;
    }

    // Твой токен Ion
    Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGJlYzY3MS0wNzg0LTRhMTYtYTg4ZS0wZDk2Njk4MmJkODAiLCJpZCI6MzYzOTE1LCJpYXQiOjE3NjQxMTY4MTd9.mB7rmSUqh2vbP7RDT5B2nQMtOOoRNX0U1e3Z09v5ILM";

    function init() {
        var el = document.getElementById("miniGlobe");
        if (!el) return;
        if (el.dataset.ready) return;
        el.dataset.ready = "1";

        // Картинка Земли из Ion
        var imagery = new Cesium.IonImageryProvider({
            assetId: 2
        });

        var viewer = new Cesium.Viewer(el, {
            imageryProvider: imagery,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            animation: false,
            timeline: false,
            fullscreenButton: false,
            infoBox: false,
            selectionIndicator: false
        });

        el._viewer = viewer;

        var scene  = viewer.scene;
        var camera = viewer.camera;

        // ─────────────────────────────────────
        // ГЛАВНАЯ ПРАВКА: включаем текстуру Земли,
        // убираем синий шар
        // ─────────────────────────────────────
        // на всякий случай чистим слои и вешаем наш imagery
        viewer.imageryLayers.removeAll();
        viewer.imageryLayers.addImageryProvider(imagery);

        // не даём baseColor красить шар в синий
        scene.globe.baseColor    = Cesium.Color.TRANSPARENT;
        scene.backgroundColor    = Cesium.Color.TRANSPARENT;
        // ─────────────────────────────────────

        // Фон и атмосфера
        scene.skyBox = null;
        if (scene.skyAtmosphere) {
            scene.skyAtmosphere.show = false;
        }
        scene.fog.enabled = false;
        scene.globe.enableLighting = true;

        // Делаем шар большим и фиксированным в рамке
        camera.frustum.fov  = Cesium.Math.toRadians(24);
        camera.frustum.near = 1.0;
        camera.frustum.far  = 1e8;

        // Позиция камеры: чуть сбоку, чтобы был серп
        var distance = 9000000.0;
        camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(10.0, 15.0, distance)
        });

        var controller = scene.screenSpaceCameraController;
        controller.enableZoom  = false;
        controller.enableTilt  = false;
        controller.enableRotate = true;
        controller.minimumZoomDistance = distance;
        controller.maximumZoomDistance = distance;

        // Авто-вращение
        var last = performance.now();
        scene.preRender.addEventListener(function () {
            var now = performance.now();
            var dt  = (now - last) / 1000;
            last    = now;
            camera.rotate(Cesium.Cartesian3.UNIT_Z, dt * 0.12);
        });

        // Клик по мини-глобусу → полная карта
        el.addEventListener("click", function () {
            window.location.href = "space.html";
        });

        // Прячем кредиты Cesium
        try {
            viewer._cesiumWidget._creditContainer.style.display = "none";
        } catch (e) {}
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
