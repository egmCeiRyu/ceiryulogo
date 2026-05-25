(() => {
  var e = {
    574(e, a, t) {
      const r = () => {
        XR8.XrController.configure({ imageTargetData: [t(43)] });
      };
      window.XR8 ? r() : window.addEventListener("xrloaded", r);
    },
    43(e) {
      "use strict";
      e.exports = JSON.parse('{"type":"PLANAR","properties":{"top":0,"left":144,"width":941,"height":1254,"isRotated":false,"originalWidth":1254,"originalHeight":1254},"imagePath":"image-targets/marker_luminance.png","metadata":{"type":"PLANAR","properties":{"top":0,"left":144,"width":941,"height":1254,"isRotated":false,"originalWidth":1254,"originalHeight":1254},"imagePath":"image-targets/marker_luminance.png","metadata":null,"name":"marker","resources":{"originalImage":"marker_original.png","croppedImage":"marker_cropped.png","thumbnailImage":"marker_thumbnail.png","luminanceImage":"marker_luminance.png"},"created":1777364648883,"updated":1777366647349},"name":"marker","resources":{"originalImage":"marker_original.png","croppedImage":"marker_cropped.png","thumbnailImage":"marker_thumbnail.png","luminanceImage":"marker_luminance.png"},"created":1777364648883,"updated":1777367342718}');
    }
  };

  var a = {};
  function t(r) {
    var n = a[r];
    if (void 0 !== n) return n.exports;
    var d = a[r] = { exports: {} };
    return e[r](d, d.exports, t), d.exports;
  }

  // ====================== ANCORAGEM DEFINITIVA ======================
  (() => {
    "use strict";

    let modelAnchored = false;

    const hideModule = {
      name: "hide-on-start",
      onStart: () => {
        console.log("🚀 8th Wall iniciado");
        const { scene } = XR8.Threejs.xrScene();
        scene.traverse((obj) => {
          if (obj.name === "Untitled.glb") {
            obj.visible = false;
          }
        });
      }
    };

    const anchorModule = {
      name: "marker-anchoring",
      listeners: [{
        event: "reality.imagefound",
        process: ({ detail }) => {
          if (detail.name !== "marker" || modelAnchored) return;

          const { scene } = XR8.Threejs.xrScene();
          let model = null;

          scene.traverse((obj) => {
            if (obj.name === "Untitled.glb") model = obj;
          });

          if (!model) return;

          const { position } = detail;

          // Posiciona apenas uma vez
          model.position.set(position.x, position.y, position.z);
          
          // Congela a rotação (usa a rotação original do modelo)
          model.matrixAutoUpdate = false;           // ← Muito importante
          
          if (model.parent !== scene) {
            scene.attach(model);
          }

          model.visible = true;
          modelAnchored = true;

          console.log("✅ Personagem ancorado definitivamente (sem tremor)");
        }
      }]
    };

    const startModules = () => {
      XR8.addCameraPipelineModule(hideModule);
      XR8.addCameraPipelineModule(anchorModule);
    };

    if (window.XR8) startModules();
    else window.addEventListener("xrloaded", startModules);
  })();

  // Inicialização original
  t(574);
  const sceneData = JSON.parse('{"objects":{"47699d9e-18a5-4f88-a4f9-b8be92e8f74a":{"components":{},"geometry":null,"id":"47699d9e-18a5-4f88-a4f9-b8be92e8f74a","light":{"type":"ambient"},"material":null,"name":"Ambient Light","position":[10,5,5],"rotation":[0,0,0,1],"scale":[1,1,1],"parentId":"88453035-dc0f-486d-868a-8ff7c2fda864","order":0.4038940050501252},"a608ddd9-9379-464d-966f-5d8d8674c83c":{"camera":{"type":"perspective","xr":{"desktop":"disabled","xrCameraType":"world","headset":"disabled","phone":"AR"}},"components":{},"geometry":null,"id":"a608ddd9-9379-464d-966f-5d8d8674c83c","material":null,"name":"Camera","position":[0,2,3],"rotation":[0.0004436887233141012,0.9659425615285845,-0.25875089860082223,0.0016563336561801576],"scale":[1,1,1],"parentId":"88453035-dc0f-486d-868a-8ff7c2fda864","order":1.0308214152219775},"ac1989e3-3b71-49e2-a05f-e682aeb18c36":{"components":{},"geometry":null,"id":"ac1989e3-3b71-49e2-a05f-e682aeb18c36","light":{"intensity":1,"type":"directional"},"material":null,"name":"Directional Light","position":[20,50,10],"rotation":[0,0,0,1],"scale":[1,1,1],"parentId":"88453035-dc0f-486d-868a-8ff7c2fda864","order":0.6644431107322474},"643be4c9-fa9d-4816-b0ec-114d3956b633":{"id":"643be4c9-fa9d-4816-b0ec-114d3956b633","position":[0,0.5272021614215185,0],"rotation":[0,0,0,1],"scale":[1,1,1],"geometry":null,"material":null