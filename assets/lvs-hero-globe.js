(function () {
    if (typeof Cesium === "undefined") {
        console.error("Cesium is not loaded.");
        return;
    }

    // Токен пусть остаётся — на него похуй сейчас
    Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGJlYzY3MS0wNzg0LTRhMTYtYTg4ZS0wZDk2Njk4MmJkODAiLCJpZCI6MzYzOTE1LCJpYXQiOjE3NjQxMTY4MTd9.mB7rmSUqh2vbP7RDT5B2nQMtOOoRNX0U1e3Z09v5ILM";

    function init() {
        var el = document.getElementById("miniGlobe");
        if (!el) return;
        if (el.dataset.ready) return;
        el.dataset.ready = "1";

        // === ВОТ ЭТО ГЛАВНОЕ: даём НОРМАЛЬНУЮ ЗЕМЛЮ ===
        var imagery = Cesium.createWorldImagery({
            style: Cesium.IonWorldImageryStyle.AERIAL
        });
        // ==================================================

        var viewer = new Cesium.Viewer(el, {
            imageryProvider: imagery,
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

        el._viewer = viewer;

        var scene = viewer.scene;
        var camera = viewer.camera;

        // Фон и атмосфера
        scene.skyBox = null;
        scene.skyAtmosphere.show = false;
        scene.fog.enabled = false;
        scene.globe.enableLighting = true;
        scene.backgroundColor = Cesium.Color.TRANSPARENT;

        // Размер шара — НЕ ТРОГАЕМ
        camera.frustum.fov = Cesium.Math.toRadians(24);
        camera.frustum.near = 1.0;
        camera.frustum.far = 1e8;

        var distance = 9000000.0;
        camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(10.0, 15.0, distance)
        });

        var controller = scene.screenSpaceCameraController;
        controller.enableZoom = false;
        controller.enableTilt = false;
        controller.enableRotate = true;
        controller.minimumZoomDistance = distance;
        controller.maximumZoomDistance = distance;

        // Автовращение
        var last = performance.now();
        scene.preRender.addEventListener(function () {
            var now = performance.now();
            var dt = (now - last) / 1000;
            last = now;
            camera.rotate(Cesium.Cartesian3.UNIT_Z, dt * 0.12);
        });

        // Клик → полная карта
        el.addEventListener("click", function () {
            window.location.href = "space.html";
        });

        // Прячем кредиты
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
