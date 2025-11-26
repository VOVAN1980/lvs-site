// assets/lvs-hero-globe.js
// Мини-глобус на главной странице (index.html → #miniGlobe)

(function () {
    // Если Cesium не подгрузился — выходим тихо
    if (typeof Cesium === "undefined") return;

    var container = document.getElementById("miniGlobe");
    if (!container) return;

    // Твой реальный токен
    Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGJlYzY3MS0wNzg0LTRhMTYtYTg4ZS0wZDk2Njk4MmJkODAiLCJpZCI6MzYzOTE1LCJpYXQiOjE3NjQxMTY4MTd9.mB7rmSUqh2vbP7RDT5B2nQMtOOoRNX0U1e3Z09v5ILM";

    // Создаём viewer прямо в div#miniGlobe
    var viewer = new Cesium.Viewer(container, {
        // Нормальная Земля (спутниковая карта)
        imageryProvider: Cesium.createWorldImagery({
            style: Cesium.IonWorldImageryStyle.AERIAL
        }),

        terrain: Cesium.Terrain.fromWorldTerrain(),

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
        shouldAnimate: true
    });

    var scene = viewer.scene;

    // Убираем кредиты Cesium
    if (viewer._cesiumWidget && viewer._cesiumWidget._creditContainer) {
        viewer._cesiumWidget._creditContainer.style.display = "none";
    }

    // Красивый космос + прозрачный фон, чтобы шар сидел в чёрном круге
    scene.globe.enableLighting = true;
    scene.skyAtmosphere.show = true;
    scene.skyBox.show = false;
    scene.backgroundColor = Cesium.Color.TRANSPARENT;

    // Фиксируем камеру, чтобы шар всегда красиво сидел в рамке
    var controller = scene.screenSpaceCameraController;
    controller.enableTranslate = false;
    controller.enableTilt = false;
    controller.enableZoom = false;
    controller.enableCollisionDetection = false;

    // Жёсткая дистанция до планеты — без зума
    controller.minimumZoomDistance = 11000000.0;
    controller.maximumZoomDistance = 11000000.0;

    // Стартовый вид — немного смещённая Земля, чтобы был красивый свет
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(10.0, 20.0, 11000000.0)
    });

    // Убираем даблклик-зум, чтобы ничего не дёргалось
    viewer.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );

    // Плавное авто-вращение вокруг оси (мини-глобус всегда в рамке)
    var lastTime = viewer.clock.currentTime.clone();
    var spinRate = 0.03; // скорость вращения (рад/сек)

    viewer.clock.onTick.addEventListener(function (clock) {
        var currentTime = clock.currentTime;
        var deltaSeconds = Cesium.JulianDate.secondsDifference(
            currentTime,
            lastTime
        );
        lastTime = currentTime;

        viewer.camera.rotate(
            Cesium.Cartesian3.UNIT_Z,
            -spinRate * deltaSeconds
        );
    });

    // Клик по мини-глобусу → переход на полную карту
    container.style.cursor = "pointer";
    container.addEventListener("click", function () {
        window.location.href = "space.html";
    });
})();
