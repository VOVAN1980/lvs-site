// assets/lvs-hero-globe.js
(function () {
    // Если Cesium не загрузился — выходим, чтобы не ронять страницу
    if (!window.Cesium) {
        console.warn('[LVS] Cesium is not available');
        return;
    }

    const container = document.getElementById('miniGlobe');
    if (!container) {
        console.warn('[LVS] miniGlobe container not found');
        return;
    }

    // Токен, который ты дал выше
    Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGJlYzY3MS0wNzg0LTRhMTYtYTg4ZS0wZDk2Njk4MmJkODAiLCJpZCI6MzYzOTE1LCJpYXQiOjE3NjQxMTY4MTd9.mB7rmSUqh2vbP7RDT5B2nQMtOOoRNX0U1e3Z09v5ILM';

    // Создаём viewer прямо в div, без лишнего UI
    const viewer = new Cesium.Viewer(container, {
        animation: false,
        timeline: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        vrButton: false,
        selectionIndicator: false,
        infoBox: false,
        shouldAnimate: true,

        // Стабильные провайдеры, без createWorld* хелперов
        imageryProvider: new Cesium.IonImageryProvider({ assetId: 3 }), // глобальная карта
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
    });

    // Убираем кредиты Cesium
    viewer.cesiumWidget.creditContainer.style.display = 'none';

    const scene = viewer.scene;
    const camera = viewer.camera;

    // Чуть подсвечиваем Землю
    scene.globe.enableLighting = true;
    scene.skyBox.show = false;          // без коробки небо, фон остаётся твоим
    scene.skyAtmosphere.show = true;

    const controller = scene.screenSpaceCameraController;
    controller.enableTilt = false;      // не даём заваливать шар
    controller.minimumZoomDistance = 5_000_000.0;
    controller.maximumZoomDistance = 9_000_000.0;

    // Стартовый ракурс — чуть сбоку от экватора
    const center = Cesium.Cartesian3.fromDegrees(10.0, 20.0, 0.0);
    const distance = 7_000_000.0;

    camera.lookAt(
        center,
        new Cesium.Cartesian3(distance, 0.0, 0.0)
    );
    camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

    // Авто-вращение вокруг оси Z
    const angularVelocity = Cesium.Math.toRadians(3.0); // градусов в секунду

    viewer.clock.onTick.addEventListener(function (clock) {
        const dt = clock.deltaSeconds;
        camera.rotate(Cesium.Cartesian3.UNIT_Z, -angularVelocity * dt);
    });

    // Клик по мини-глобусу — переход на полноразмерную карту
    container.addEventListener('click', function () {
        window.location.href = 'space.html';
    });
})();
