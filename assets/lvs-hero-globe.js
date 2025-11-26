// assets/lvs-hero-globe.js
// MINI-GLOBE (работает на старой версии Cesium)

(function () {
    if (typeof Cesium === "undefined") return;

    const container = document.getElementById("miniGlobe");
    if (!container) return;

    Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGJlYzY3MS0wNzg0LTRhMTYtYTg4ZS0wZDk2Njk4MmJkODAiLCJpZCI6MzYzOTE1LCJpYXQiOjE3NjQxMTY4MTd9.mB7rmSUqh2vbP7RDT5B2nQMtOOoRNX0U1e3Z09v5ILM";


    // ВАЖНО: старый Cesium не поддерживает createWorldImagery()
    // поэтому используем Ion Imagery из официального ассета
    const viewer = new Cesium.Viewer(container, {
        imageryProvider: new Cesium.IonImageryProvider({
            assetId: 2   // Ion Satellite (Default)
        }),

        terrainProvider: Cesium.createWorldTerrain(),

        animation: false,
        timeline: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        infoBox: false,
        selectionIndicator: false,
        shouldAnimate: true,
    });

    const scene = viewer.scene;

    // скрыть кредиты Cesium
    viewer._cesiumWidget._creditContainer.style.display = "none";

    // красивое освещение
    scene.globe.enableLighting = true;

    // фиксируем камеру, чтобы шар всегда был в круге
    const ctrl = scene.screenSpaceCameraController;
    ctrl.enableZoom = false;
    ctrl.enableTilt = false;
    ctrl.enableTranslate = false;
    ctrl.enableLook = false;

    ctrl.minimumZoomDistance = 11000000.0;
    ctrl.maximumZoomDistance = 11000000.0;

    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(15.0, 20.0, 11000000.0)
    });

    // отключаем двойной клик
    viewer.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );

    // авто-вращение
    let last = viewer.clock.currentTime.clone();
    const rate = 0.03;

    viewer.clock.onTick.addEventListener((clock) => {
        let now = clock.currentTime;
        let delta = Cesium.JulianDate.secondsDifference(now, last);
        last = now;
        viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, -rate * delta);
    });

    // кликаем → space.html
    container.style.cursor = "pointer";
    container.addEventListener("click", () => {
        window.location.href = "space.html";
    });
})();
