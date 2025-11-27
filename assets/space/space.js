(function () {
    if (typeof Cesium === "undefined") return;

    // --- ТВОЙ токен Ion ---
    Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGJlYzY3MS0wNzg0LTRhMTYtYTg4ZS0wZDk2Njk4MmJkODAiLCJpZCI6MzYzOTE1LCJpYXQiOjE3NjQxMTY4MTd9.mB7rmSUqh2vbP7RDT5B2nQMtOOoRNX0U1e3Z09v5ILM";

    // ==== КНОПКА НАЗАД ====
    var backBtn = document.getElementById("space-back-btn");
    function goBack() {
        window.location.href = "index.html#work";
    }
    if (backBtn) backBtn.addEventListener("click", goBack);

    // ==== VIEWER БЕЗ ДЕФОЛТНОЙ КАРТЫ ====
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

    // прячем кредиты
    try {
        viewer._cesiumWidget._creditContainer.style.display = "none";
    } catch (e) {}

    var scene   = viewer.scene;
    var camera  = viewer.camera;
    var layers  = viewer.imageryLayers;

    // ==== ФОТОКАРТА ЗЕМЛИ ЧЕРЕЗ ION (assetId: 2) ====
    layers.removeAll();
    layers.addImageryProvider(
        new Cesium.IonImageryProvider({ assetId: 2 })
    );

    // ==== ВИЗУАЛЬНАЯ НАСТРОЙКА БЕЗ ОБЛАКОВ ====
    scene.globe.enableLighting = true;                // день/ночь
    scene.globe.depthTestAgainstTerrain = true;
    scene.backgroundColor = Cesium.Color.BLACK;

    var atm = scene.skyAtmosphere;
    if (atm) {
        atm.hueShift = 0.0;
        atm.saturationShift = 0.35;   // чуть более насыщенная атмосфера
        atm.brightnessShift = -0.18;  // делает ободок поярче
    }
    scene.skyBox.show = true;
    // облака НЕ добавляем вообще

    // ==== ОГРАНИЧЕНИЯ ПО ЗУМУ ====
    var controller = scene.screenSpaceCameraController;
    controller.minimumZoomDistance = 250000;      // около 250 км
    controller.maximumZoomDistance = 30000000;    // 30 000 км

    // ==== СТАРТОВЫЙ РАКУРС (Европа, наклон) ====
    camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(10, 48, 16000000),
        orientation: {
            heading: Cesium.Math.toRadians(0.0),
            pitch:   Cesium.Math.toRadians(-35.0),
            roll:    0.0
        }
    });

    // убираем стандартный double–click-zoom
    viewer.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );

    // ==== ГОРОДА С УРОВНЕМ ДЕТАЛИЗАЦИИ ====
    // level:
    // 1 — мегаполисы (видны всегда)
    // 2 — крупные города
    // 3 — региональные
    // 4 — локальные (видны только когда очень близко)
    var CITY_DATA = [
        // Германия и рядом
        { name: "Bad Kreuznach", lat: 49.8454, lon: 7.8670,  level: 3 },
        { name: "Mainz",        lat: 49.9929, lon: 8.2473,  level: 3 },
        { name: "Frankfurt",    lat: 50.1109, lon: 8.6821,  level: 2 },
        { name: "Berlin",       lat: 52.5200, lon: 13.4050, level: 2 },
        { name: "Hamburg",      lat: 53.5511, lon: 9.9937,  level: 2 },
        { name: "Munich",       lat: 48.1351, lon: 11.5820, level: 2 },
        { name: "Stuttgart",    lat: 48.7758, lon: 9.1829,  level: 3 },
        { name: "Cologne",      lat: 50.9375, lon: 6.9603,  level: 3 },

        // Европа
        { name: "London",       lat: 51.5074, lon: -0.1278, level: 1 },
        { name: "Paris",        lat: 48.8566, lon: 2.3522,  level: 1 },
        { name: "Warsaw",       lat: 52.2297, lon: 21.0122, level: 2 },
        { name: "Prague",       lat: 50.0755, lon: 14.4378, level: 2 },
        { name: "Vienna",       lat: 48.2082, lon: 16.3738, level: 2 },
        { name: "Rome",         lat: 41.9028, lon: 12.4964, level: 2 },
        { name: "Madrid",       lat: 40.4168, lon: -3.7038, level: 2 },
        { name: "Barcelona",    lat: 41.3851, lon: 2.1734,  level: 3 },
        { name: "Amsterdam",    lat: 52.3676, lon: 4.9041,  level: 3 },

        // Америка
        { name: "New York",     lat: 40.7128, lon: -74.0060, level: 1 },
        { name: "Los Angeles",  lat: 34.0522, lon: -118.2437, level: 1 },
        { name: "Chicago",      lat: 41.8781, lon: -87.6298, level: 2 },
        { name: "Toronto",      lat: 43.6510, lon: -79.3470, level: 2 },
        { name: "São Paulo",    lat: -23.5505, lon: -46.6333, level: 1 },

        // Азия
        { name: "Tokyo",        lat: 35.6762, lon: 139.6503, level: 1 },
        { name: "Seoul",        lat: 37.5665, lon: 126.9780, level: 1 },
        { name: "Singapore",    lat: 1.3521,  lon: 103.8198, level: 1 },
        { name: "Shanghai",     lat: 31.2304, lon: 121.4737, level: 1 },
        { name: "Hong Kong",    lat: 22.3193, lon: 114.1694, level: 2 },

        // Австралия
        { name: "Sydney",       lat: -33.8688, lon: 151.2093, level: 2 },
        { name: "Melbourne",    lat: -37.8136, lon: 144.9631, level: 2 },

        // Африка
        { name: "Cairo",        lat: 30.0444, lon: 31.2357, level: 1 },
        { name: "Johannesburg", lat: -26.2041, lon: 28.0473, level: 2 }
    ];

    var cityEntities = CITY_DATA.map(function (city) {
        return viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(city.lon, city.lat),
            point: {
                pixelSize: 8,
                color: Cesium.Color.fromCssColorString("#FFD93B").withAlpha(0.95),
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
            },
            properties: {
                level: city.level
            }
        });
    });

    // ==== ДИНАМИЧЕСКАЯ ВИДИМОСТЬ ГОРОДОВ ПО ВЫСОТЕ ====
    function updateCityVisibility() {
        var height = camera.positionCartographic.height;
        var maxLevel;

        if (height > 12000000)      maxLevel = 1; // очень далеко — только мегаполисы
        else if (height > 5000000)  maxLevel = 2; // ближе — + крупные
        else if (height > 1500000)  maxLevel = 3; // ещё ближе — региональные
        else                        maxLevel = 4; // совсем близко — всё

        for (var i = 0; i < cityEntities.length; i++) {
            var ent = cityEntities[i];
            var lvl = ent.properties.level.getValue();
            var show = lvl <= maxLevel;
            ent.point.show = show;
            ent.label.show = show;
        }
    }

    var lastUpdate = 0;
    scene.postRender.addEventListener(function () {
        var now = performance.now();
        if (now - lastUpdate > 250) { // раз в четверть секунды
            lastUpdate = now;
            updateCityVisibility();
        }
    });
    updateCityVisibility();

    // ==== ДВОЙНОЙ КЛИК: ФОКУС НА ГОРОД / ТОЧКУ НА ЗЕМЛЕ ====
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    handler.setInputAction(function (click) {
        var picked = scene.pick(click.position);

        // если клик по городу — летим к нему ближе
        if (picked && picked.id && picked.id.position) {
            var pos          = picked.id.position.getValue(Cesium.JulianDate.now());
            var cartographic = Cesium.Cartographic.fromCartesian(pos);
            var lat          = Cesium.Math.toDegrees(cartographic.latitude);
            var lon          = Cesium.Math.toDegrees(cartographic.longitude);

            camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(lon, lat, 450000),
                duration: 0.9
            });
            return;
        }

        // иначе — клик по Земле: летим в эту точку
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
