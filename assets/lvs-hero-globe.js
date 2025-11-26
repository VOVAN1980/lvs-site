(function () {
    if (typeof Cesium === "undefined") {
        console.error("Cesium is not loaded.");
        return;
    }

    Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGJlYzY3MS0wNzg0LTRhMTYtYTg4ZS0wZDk2Njk4MmJkODAiLCJpZCI6MzYzOTE1LCJpYXQiOjE3NjQxMTY4MTd9.mB7rmSUqh2vbP7RDT5B2nQMtOOoRNX0U1e3Z09v5ILM";

    function init() {
        const el = document.getElementById("miniGlobe");
        if (!el) return;
        if (el.dataset.ready) return;
        el.dataset.ready = "1";

        // === ПРАВИЛЬНЫЙ СПОСОБ ДЛЯ CDN CESIUM ===
        const imagery = new Cesium.IonImageryProvider({
            assetId: 2 // Aerial with labels
        });

        const viewer = new Cesium.Viewer(el, {
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

        // Отключаем атмосферу, оставляем чистую Землю
        viewer.scene.skyAtmosphere.show = false;
        viewer.scene.fog.enabled = false;
        viewer.scene.globe.enableLighting = true;

        // Центровка камеры
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(10, 20, 60000000)
        });

        // Авто-вращение
        let last = performance.now();
        viewer.scene.preRender.addEventListener(() => {
            const now = performance.now();
            const dt = (now - last) / 1000;
            last = now;
            viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, dt * 0.1);
        });

        // Клик → space.html
        el.addEventListener("click", () => {
            location.href = "space.html";
        });

        // Прячем кредиты
        try {
            viewer._cesiumWidget._creditContainer.style.display = "none";
        } catch (e) {}
    }

    if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", init);
    else
        init();
})();
