(function () {
    if (typeof Cesium === "undefined") {
        console.error("Cesium is not loaded.");
        return;
    }

    // твой токен Ion
    Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGJlYzY3MS0wNzg0LTRhMTYtYTg4ZS0wZDk2Njk4MmJkODAiLCJpZCI6MzYzOTE1LCJpYXQiOjE3NjQxMTY4MTd9.mB7rmSUqh2vbP7RDT5B2nQMtOOoRNX0U1e3Z09v5ILM";

    async function init() {
        const el = document.getElementById("miniGlobe");
        if (!el) return;
        if (el.dataset.ready) return;
        el.dataset.ready = "1";

        // --- ВАЖНО: новый API загрузки карты ---
        const imagery = await Cesium.IonResource.fromAssetId(2)
            .then(resource => new Cesium.IonImageryProvider({ assetId: 2 }))
            .catch(err => console.error("Ion imagery error:", err));

        const viewer = new Cesium.Viewer(el, {
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

        const scene  = viewer.scene;
        const camera = viewer.camera;

        // оформление
        scene.skyBox = null;
        scene.skyAtmosphere.show = false;
        scene.fog.enabled = false;
        scene.backgroundColor = Cesium.Color.TRANSPARENT;

        camera.frustum.fov  = Cesium.Math.toRadians(24);
        camera.frustum.near = 1.0;
        camera.frustum.far  = 1e8;

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

        el.addEventListener("click", function () {
            window.location.href = "space.html";
        });

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
