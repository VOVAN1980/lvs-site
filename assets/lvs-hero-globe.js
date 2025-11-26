(function () {
    if (typeof Cesium === "undefined") {
        console.error("Cesium is not loaded.");
        return;
    }

    // твой токен Ion
    Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGJlYzY3MS0wNzg0LTRhMTYtYTg4ZS0wZDk2Njk4MmJkODAiLCJpZCI6MzYzOTE1LCJpYXQiOjE3NjQxMTY4MTd9.mB7rmSUqh2vbP7RDT5B2nQMtOOoRNX0U1e3Z09v5ILM";

    function init() {
        var el = document.getElementById("miniGlobe");
        if (!el) return;
        if (el.dataset.ready) return;
        el.dataset.ready = "1";

        // создаём viewer БЕЗ дефолтного слоя
        var viewer = new Cesium.Viewer(el, {
            imageryProvider: undefined,
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

        var scene  = viewer.scene;
        var camera = viewer.camera;

        // фон
        scene.skyBox = null;
        scene.skyAtmosphere.show = false;
        scene.fog.enabled = false;
        scene.globe.enableLighting = true;
        scene.backgroundColor = Cesium.Color.TRANSPARENT;

        // === ПОДКЛЮЧАЕМ ТВОЙ ASSET ИЗ ION ===
        Cesium.IonImageryProvider.fromAssetId(3830186)
            .then(function (provider) {
                var layers = viewer.imageryLayers;
                layers.removeAll();
                layers.addImageryProvider(provider);
            })
            .catch(function (err) {
                console.error("Ion imagery error:", err);
            });
        // =====================================

        // ДЕЛАЕМ ГЛОБУС ПОМЕНЬШЕ ВНУТРИ ТОГО ЖЕ КРУГА
        camera.frustum.fov  = Cesium.Math.toRadians(18);  // уже, шар меньше
        camera.frustum.near = 1.0;
        camera.frustum.far  = 2e8;

        // расстояние до центра Земли – больше = шар меньше
        var distance = 20000000.0;

        camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(0.0, 20.0, distance)
        });

        var controller = scene.screenSpaceCameraController;
        controller.enableZoom = false;
        controller.enableTilt = false;
        controller.enableRotate = true;
        controller.minimumZoomDistance = distance;
        controller.maximumZoomDistance = distance;

        // авто-вращение
        var last = performance.now();
        scene.preRender.addEventListener(function () {
            var now = performance.now();
            var dt = (now - last) / 1000;
            last = now;
            camera.rotate(Cesium.Cartesian3.UNIT_Z, dt * 0.10);
        });

        // клик по мини-глобусу → полная карта
        el.addEventListener("click", function () {
            window.location.href = "space.html";
        });

        // спрятать кредиты Cesium
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
