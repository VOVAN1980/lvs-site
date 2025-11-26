(function () {
    if (!window.Cesium) return;

    Cesium.Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGJlYzY3MS0wNzg0LTRhMTYtYTg4ZS0wZDk2Njk4MmJkODAiLCJpZCI6MzYzOTE1LCJpYXQiOjE3NjQxMTY4MTd9.mB7rmSUqh2vbP7RDT5B2nQMtOOoRNX0U1e3Z09v5ILM";

    const container = document.getElementById("miniGlobe");
    if (!container) return;

    const viewer = new Cesium.Viewer(container, {
        animation: false,
        timeline: false,
        baseLayerPicker: false,
        homeButton: false,
        vrButton: false,
        geocoder: false,
        fullscreenButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        infoBox: false,
        selectionIndicator: false,
        skyBox: false,
        scene3DOnly: true,
    });

    // без синего фона Cesium
    viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;
    viewer.scene.globe.baseColor  = Cesium.Color.TRANSPARENT;

    // обычная текстура Земли
    viewer.imageryLayers.removeAll();
    viewer.imageryLayers.addImageryProvider(
        new Cesium.IonImageryProvider({ assetId: 2 })
    );

    viewer.scene.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(20, 20, 6200000),
        duration: 0
    });
})();
