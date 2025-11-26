// assets/lvs-hero-globe.js

(function () {
  // 1) Проверяем, что Cesium есть
  if (typeof Cesium === "undefined") {
    console.warn("Cesium is not available for mini globe");
    return;
  }

  // 2) Твой ion-токен (который ты дал выше)
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGJlYzY3MS0wNzg0LTRhMTYtYTg4ZS0wZDk2Njk4MmJkODAiLCJpZCI6MzYzOTE1LCJpYXQiOjE3NjQxMTY4MTd9.mB7rmSUqh2vbP7RDT5B2nQMtOOoRNX0U1e3Z09v5ILM";

  function initMiniGlobe() {
    var container = document.getElementById("miniGlobe");
    if (!container) return;

    // Чтобы не создавать viewer по 10 раз
    if (container.dataset.lvsGlobeInit === "1") return;
    container.dataset.lvsGlobeInit = "1";

    // На всякий случай задаём размеры, если браузер решит, что это 0x0
    var rect = container.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) {
      container.style.minWidth = "260px";
      container.style.minHeight = "260px";
    }

    // 3) Создаём мини-viewer только с текстурой Земли
    var viewer = new Cesium.Viewer(container, {
      imageryProvider: new Cesium.IonImageryProvider({ assetId: 2 }), // World imagery
      terrain: false,                 // Никакого террейна — меньше шансов на баг
      animation: false,
      timeline: false,
      geocoder: false,
      baseLayerPicker: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      infoBox: false,
      selectionIndicator: false,
      shouldAnimate: true
    });

    container._lvsViewer = viewer;

    var scene = viewer.scene;
    scene.backgroundColor = Cesium.Color.TRANSPARENT;
    scene.globe.enableLighting = true;
    scene.highDynamicRange = false;

    // Убираем кредиты Cesium
    try {
      viewer._cesiumWidget._creditContainer.style.display = "none";
    } catch (e) {
      /* не страшно */
    }

    // Камера — так, чтобы шар ровно сидел в круге
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(15.0, 20.0, 6.2e7)
    });

    // Лёгкое автоворощение вокруг оси Z
    var lastTime;
    var spinRate = Cesium.Math.toRadians(5.0) / 60.0; // ~5° в сек

    scene.preRender.addEventListener(function (_scene, time) {
      if (!Cesium.defined(lastTime)) {
        lastTime = time.secondsOfDay;
        return;
      }

      var delta = time.secondsOfDay - lastTime;
      lastTime = time.secondsOfDay;

      if (delta <= 0 || delta > 10) return; // защита от скачков времени

      viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, spinRate * delta);
    });

    // Клик по мини-глобусу -> полная карта
    container.addEventListener("click", function () {
      window.location.href = "space.html";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMiniGlobe);
  } else {
    initMiniGlobe();
  }
})();
