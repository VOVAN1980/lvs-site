// assets/lvs-hero-globe.js
(function () {
  // Cesium ещё не загрузился – тихо выходим
  if (!window.Cesium) return;

  // Твой токен Cesium Ion
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGJlYzY3MS0wNzg0LTRhMTYtYTg4ZS0wZDk2Njk4MmJkODAiLCJpZCI6MzYzOTE1LCJpYXQiOjE3NjQxMTY4MTd9.mB7rmSUqh2vbP7RDT5B2nQMtOOoRNX0U1e3Z09v5ILM";

  const container = document.getElementById("hero-globe");
  if (!container) return;

  const viewer = new Cesium.Viewer(container, {
    animation: false,
    timeline: false,
    homeButton: false,
    geocoder: false,
    baseLayerPicker: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    selectionIndicator: false,
    infoBox: false,
    // меньше жрём ресурсов
    requestRenderMode: true,
    maximumRenderTimeChange: Number.POSITIVE_INFINITY,
  });

  // Прозрачный фон – чтобы был только шар
  viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;

  const globe = viewer.scene.globe;
  globe.enableLighting = true;
  globe.showGroundAtmosphere = true;

  // ✅ Главное: включаем настоящую Землю, а не синий шар
  const layers = viewer.imageryLayers;
  layers.removeAll();
  layers.addImageryProvider(
    new Cesium.IonImageryProvider({
      assetId: 3, // стандартный глобус Bing от Cesium
    })
  );

  // Камера – чтобы шар ровно сидел в круге
  const R = globe.ellipsoid.maximumRadius;
  const distance = 2.1 * R;

  viewer.camera.setView({
    destination: new Cesium.Cartesian3(0.0, 0.0, distance),
    orientation: {
      heading: Cesium.Math.toRadians(-35.0),
      pitch: Cesium.Math.toRadians(-20.0),
      roll: 0.0,
    },
  });

  // Отключаем зум/пан – только красивое авто-вращение
  const ssc = viewer.scene.screenSpaceCameraController;
  ssc.enableZoom = false;
  ssc.enableTranslate = false;
  ssc.enableTilt = false;
  ssc.enableLook = false;
  ssc.rotateEventTypes = [];
  ssc.tiltEventTypes = [];

  // Плавное вращение Земли
  const spinPerSecond = Cesium.Math.toRadians(5.0);

  viewer.clock.shouldAnimate = true;
  viewer.clock.multiplier = 1.0;

  viewer.scene.postRender.addEventListener(function () {
    const dt = viewer.clock.deltaTime; // секунды
    viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinPerSecond * dt);
    viewer.scene.requestRender();
  });

  // Первый рендер
  viewer.scene.requestRender();
})();
