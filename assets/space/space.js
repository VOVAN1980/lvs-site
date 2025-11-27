// assets/space/space.js

(async function () {
    if (typeof Cesium === "undefined") return;

    // токен Ion
    Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGJlYzY3MS0wNzg0LTRhMTYtYTg4ZS0wZDk2Njk4MmJkODAiLCJpZCI6MzYzOTE1LCJpYXQiOjE3NjQxMTY4MTd9.mB7rmSUqh2vbP7RDT5B2nQMtOOoRNX0U1e3Z09v5ILM";

    // ==== КНОПКА НАЗАД ====
    var backBtn = document.getElementById("space-back-btn");
    function goBack() {
        window.location.href = "index.html#work";
    }
    if (backBtn) backBtn.addEventListener("click", goBack);

    // ==== VIEWER БЕЗ ДЕФОЛТНОГО СЛОЯ ====
    var viewer = new Cesium.Viewer("cesiumContainer", {
        imageryProvider: false,
        terrain: undefined,

        animation: false,
        timeline: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        infoBox: false,
        selectionIndicator: false
    });

    // спрятать кредиты
    try {
        viewer._cesiumWidget._creditContainer.style.display = "none";
    } catch (e) {}

    // ==== ПОДКЛЮЧАЕМ НАСТОЯЩУЮ КАРТУ С ПОДПИСЯМИ ====
    try {
        const worldImagery = await Cesium.createWorldImageryAsync({
            style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS
            // варианты:
            // Cesium.IonWorldImageryStyle.AERIAL
            // Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS
            // Cesium.IonWorldImageryStyle.ROAD
        });

        const layers = viewer.imageryLayers;
        layers.removeAll();
        layers.addImageryProvider(worldImagery);
    } catch (e) {
        console.error("Ion imagery load error", e);
    }

    var scene  = viewer.scene;
    var camera = viewer.camera;

    // атмосфера / свет, чтобы выглядело “дорого”
    scene.globe.enableLighting = true;
    scene.skyAtmosphere.show   = true;
    scene.skyBox.show          = true;
    scene.backgroundColor      = Cesium.Color.BLACK;

    // лёгкая пост-обработка: чуть ярче и контрастнее
    try {
        const stages = scene.postProcessStages;
        const brightness = stages.add(
            Cesium.PostProcessStageLibrary.createBrightnessStage()
        );
        brightness.enabled = true;
        brightness.uniforms.brightness = 1.12;

        const contrast = stages.add(
            Cesium.PostProcessStageLibrary.createContrastStage()
        );
        contrast.enabled = true;
        contrast.uniforms.contrast = 1.08;
    } catch (e) {
        // если вдруг нет пост-обработки — просто пропускаем
    }

    // Ограничения по зуму (чтобы не улетать в сингулярность)
    var controller = scene.screenSpaceCameraController;
    controller.minimumZoomDistance = 150000;     // 150 км
    controller.maximumZoomDistance = 45000000;   // 45 000 км

    // Стартовый ракурс — "инновационный" угол на полушарие
    camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(10, 35, 26000000),
        orientation: {
            heading: Cesium.Math.toRadians(25),
            pitch:   Cesium.Math.toRadians(-35),
            roll:    0.0
        }
    });

    // вырубаем стандартный double-click зум
    viewer.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );

    // ==== НАШИ ГОРОДА (ЖЁЛТЫЕ ТОЧКИ) ====
    var CITY_DATA = [
        { name: "Bad Kreuznach", lat: 49.8454, lon: 7.8670 },
        { name: "Mainz",        lat: 49.9929, lon: 8.2473 },
        { name: "Frankfurt",    lat: 50.1109, lon: 8.6821 },
        { name: "Berlin",       lat: 52.5200, lon: 13.4050 },
        { name: "Hamburg",      lat: 53.5511, lon: 9.9937 },
        { name: "Munich",       lat: 48.1351, lon: 11.5820 },

        { name: "Paris",        lat: 48.8566, lon: 2.3522 },
        { name: "London",       lat: 51.5074, lon: -0.1278 },
        { name: "Warsaw",       lat: 52.2297, lon: 21.0122 },
        { name: "Prague",       lat: 50.0755, lon: 14.4378 },
        { name: "Vienna",       lat: 48.2082, lon: 16.3738 },
        { name: "Rome",         lat: 41.9028, lon: 12.4964 },
        { name: "Madrid",       lat: 40.4168, lon: -3.7038 },

        { name: "New York",     lat: 40.7128, lon: -74.0060 },
        { name: "Los Angeles",  lat: 34.0522, lon: -118.2437 },
        { name: "Tokyo",        lat: 35.6762, lon: 139.6503 },
        { name: "Seoul",        lat: 37.5665, lon: 126.9780 },
        { name: "Singapore",    lat: 1.3521,  lon: 103.8198 },
        { name: "Sydney",       lat: -33.8688, lon: 151.2093 },
        { name: "São Paulo",    lat: -23.5505, lon: -46.6333 }
    ];

    CITY_DATA.forEach(function (city) {
        viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(city.lon, city.lat),
            point: {
                pixelSize: 8,
                color: Cesium.Color.YELLOW.withAlpha(0.95),
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1
            },
            label: {
                text: city.name,
                font: "12px 'Segoe UI', sans-serif",
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -18),
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });
    });

    // ==== ДВОЙНОЙ КЛИК: ФОКУС НА ГОРОД / ТЧК ====
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    handler.setInputAction(function (click) {
        var picked = scene.pick(click.position);

        // клик по нашему городу
        if (picked && picked.id && picked.id.position) {
            var pos = picked.id.position.getValue(Cesium.JulianDate.now());
            var cartographic = Cesium.Cartographic.fromCartesian(pos);
            var lat = Cesium.Math.toDegrees(cartographic.latitude);
            var lon = Cesium.Math.toDegrees(cartographic.longitude);

            camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(lon, lat, 450000),
                duration: 0.9
            });
            return;
        }

        // клик по любой точке Земли
        var ellipsoid = scene.globe.ellipsoid;
        var cartesian = camera.pickEllipsoid(click.position, ellipsoid);
        if (!cartesian) return;

        var cartographic2 = ellipsoid.cartesianToCartographic(cartesian);
        var lat2 = Cesium.Math.toDegrees(cartographic2.latitude);
        var lon2 = Cesium.Math.toDegrees(cartographic2.longitude);

        camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(lon2, lat2, 1200000),
            duration: 0.9
        });
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    // ESC → назад
    window.addEventListener("keydown", function (e) {
        if (e.key === "Escape") goBack();
    });
})();
