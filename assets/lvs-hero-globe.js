(function () {
    if (typeof Cesium === "undefined") {
        console.error("Cesium is not loaded.");
        return;
    }

    // твой Ion токен
    Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGJlYzY3MS0wNzg0LTRhMTYtYTg4ZS0wZDk2Njk4MmJkODAiLCJpZCI6MzYzOTE1LCJpYXQiOjE3NjQxMTY4MTd9.mB7rmSUqh2vbP7RDT5B2nQMtOOoRNX0U1e3Z09v5ILM";

    function init() {
        const el = document.getElementById("miniGlobe");
        if (!el) return;
        if (el.dataset.ready) return;
        el.dataset.ready = "1";

        // === ВКЛЮЧАЕМ НОРМАЛЬНУЮ ЗЕМЛЮ ===
        const viewer = new Cesium.Viewer(el, {
            imageryProvider: Cesium.createWorldImagery(),
            terrainProvider: new Cesium.EllipsoidTerrainProvider(),
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
        // ================================

        el._viewer = viewer;

        const scene = viewer.scene;
        const camera = viewer.camera;

        // фон и атмосфера
        scene.skyBox = null;
        scene.skyAtmosphere.show = false;
        scene.fog.enabled = false;
        scene.backgroundColor = Cesium.Color.TRANSPARENT;

        // НЕ ТРОГАЮ твой размер шара
        camera.frustum.fov = Cesium.Math.toRadians(24);
        camera.frustum.near = 1.0;
        camera.frustum.far = 1e8;

        const distance = 9000000.0;
        camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(10.0, 15.0, distance)
        });

        const controller = scene.screenSpaceCameraController;
        controller.enableZoom = false;
        controller.enableTilt = false;
        controller.enableRotate = true;
        controller.minimumZoomDistance = distance;
        controller.maximumZoomDistance = distance;

        // авто-вращение
        let last = performance.now();
        scene.preRender.addEventListener(() => {
            const now = performance.now();
            const dt = (now - last) / 1000;
            last = now;
            camera.rotate(Cesium.Cartesian3.UNIT_Z, dt * 0.12);
        });

        // клик → space.html
        el.addEventListener("click", () => {
            window.location.href = "space.html";
        });

        // скрыть кредиты
        viewer._cesiumWidget._creditContainer.style.display = "none";
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
