// assets/lvs-hero-globe.js
(function () {
    if (typeof Cesium === "undefined") {
        console.warn("Cesium not loaded");
        return;
    }

    Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGJlYzY3MS0wNzg0LTRhMTYtYTg4ZS0wZDk2Njk4MmJkODAiLCJpZCI6MzYzOTE1LCJpYXQiOjE3NjQxMTY4MTd9.mB7rmSUqh2vbP7RDT5B2nQMtOOoRNX0U1e3Z09v5ILM";

    function init() {
        const el = document.getElementById("miniGlobe");
        if (!el) return;
        if (el.dataset.init) return;
        el.dataset.init = "1";

        // 1 — создаём минимальный viewer БЕЗ лишних параметров
        const viewer = new Cesium.Viewer(el, {
            imageryProvider: Cesium.createWorldImagery({
                style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS
            }),
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

        // 2 — отключаем атмосферу, туман, всё что даёт ошибки
        viewer.scene.globe.enableLighting = true;
        viewer.scene.skyAtmosphere.show = false;
        viewer.scene.fog.enabled = false;
        viewer.scene.light = new Cesium.SunLight();

        // 3 — центрируем земной шар
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(10, 20, 60000000)
        });

        // 4 — авто-вращение (стабильно работает)
        let last = performance.now();
        viewer.scene.preRender.addEventListener(() => {
            const now = performance.now();
            const dt = (now - last) / 1000;
            last = now;
            viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, dt * 0.1);
        });

        // 5 — клик → space.html
        el.addEventListener("click", () => {
            location.href = "space.html";
        });

        // 6 — прячем кредиты
        try {
            viewer._cesiumWidget._creditContainer.style.display = "none";
        } catch (e) {}
    }

    if (document.readyState === "loading")
        document.addEventListener("DOMContentLoaded", init);
    else
        init();
})();
