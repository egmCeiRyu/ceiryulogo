(() => {
  "use strict";

  // ============================================================
  // DADOS DO IMAGE TARGET
  // ============================================================
  const markerData = {
    type: "PLANAR",
    properties: {
      top: 0, left: 144, width: 941, height: 1254,
      isRotated: false, originalWidth: 1254, originalHeight: 1254
    },
    imagePath: "image-targets/marker_luminance.png",
    name: "marker",
    resources: {
      originalImage: "marker_original.png",
      croppedImage: "marker_cropped.png",
      thumbnailImage: "marker_thumbnail.png",
      luminanceImage: "marker_luminance.png"
    },
    metadata: {
      type: "PLANAR",
      properties: {
        top: 0, left: 144, width: 941, height: 1254,
        isRotated: false, originalWidth: 1254, originalHeight: 1254
      },
      imagePath: "image-targets/marker_luminance.png",
      metadata: null,
      name: "marker",
      resources: {
        originalImage: "marker_original.png",
        croppedImage: "marker_cropped.png",
        thumbnailImage: "marker_thumbnail.png",
        luminanceImage: "marker_luminance.png"
      },
      created: 1777364648883,
      updated: 1777366647349
    },
    created: 1777364648883,
    updated: 1777367342718
  };

  // ============================================================
  // CONFIGURAÇÃO DO XR8
  // ============================================================
  const initXR = () => {
    XR8.XrController.configure({ imageTargetData: [markerData] });
  };

  if (window.XR8) {
    initXR();
  } else {
    window.addEventListener("xrloaded", initXR);
  }

  // ============================================================
  // CENA 3D — igual ao que funcionava
  // ============================================================
  const scene = {
    entrySpaceId: "88453035-dc0f-486d-868a-8ff7c2fda864",

    spaces: {
      "88453035-dc0f-486d-868a-8ff7c2fda864": {
        id: "88453035-dc0f-486d-868a-8ff7c2fda864",
        name: "Default Space",
        activeCamera: "a608ddd9-9379-464d-966f-5d8d8674c83c"
      }
    },

    objects: {

      // --- Luz ambiente ---
      "47699d9e-18a5-4f88-a4f9-b8be92e8f74a": {
        id: "47699d9e-18a5-4f88-a4f9-b8be92e8f74a",
        name: "Ambient Light",
        parentId: "88453035-dc0f-486d-868a-8ff7c2fda864",
        position: [10, 5, 5],
        rotation: [0, 0, 0, 1],
        scale: [1, 1, 1],
        light: { type: "ambient" },
        geometry: null, material: null, components: {},
        order: 0.4038940050501252
      },

      // --- Câmera AR (World Tracking / SLAM) ---
      "a608ddd9-9379-464d-966f-5d8d8674c83c": {
        id: "a608ddd9-9379-464d-966f-5d8d8674c83c",
        name: "Camera",
        parentId: "88453035-dc0f-486d-868a-8ff7c2fda864",
        position: [0, 2, 3],
        rotation: [0.0004436887233141012, 0.9659425615285845, -0.25875089860082223, 0.0016563336561801576],
        scale: [1, 1, 1],
        camera: {
          type: "perspective",
          xr: {
            desktop: "disabled",
            xrCameraType: "world",
            headset: "disabled",
            phone: "AR"
          }
        },
        geometry: null, material: null, components: {},
        order: 1.0308214152219775
      },

      // --- Luz direcional ---
      "ac1989e3-3b71-49e2-a05f-e682aeb18c36": {
        id: "ac1989e3-3b71-49e2-a05f-e682aeb18c36",
        name: "Directional Light",
        parentId: "88453035-dc0f-486d-868a-8ff7c2fda864",
        position: [20, 50, 10],
        rotation: [0, 0, 0, 1],
        scale: [1, 1, 1],
        light: { intensity: 1, type: "directional" },
        geometry: null, material: null, components: {},
        order: 0.6644431107322474
      },

      // --- Image Target — detecta o marker ---
      "643be4c9-fa9d-4816-b0ec-114d3956b633": {
        id: "643be4c9-fa9d-4816-b0ec-114d3956b633",
        name: "Image Target",
        parentId: "88453035-dc0f-486d-868a-8ff7c2fda864",
        position: [0, 0.5272021614215185, 0],
        rotation: [0, 0, 0, 1],
        scale: [1, 1, 1],
        imageTarget: { name: "marker", sticky: true },
        geometry: null, material: null, components: {},
        order: 3.04270821723535
      },

      // --- Modelo GLB — filho do Image Target, sticky mantém no lugar ---
      "e35dbf9c-8de2-468e-9449-f9563e988696": {
        id: "e35dbf9c-8de2-468e-9449-f9563e988696",
        name: "Untitled.glb",
        parentId: "643be4c9-fa9d-4816-b0ec-114d3956b633",
        position: [0, -0.5272021614215185, 0.1265981015238123],
        rotation: [0, 0, 0, 1],
        scale: [1, 1, 1],
        gltfModel: {
          src: { type: "asset", asset: "assets/Untitled.glb" },
          animationClip: "*",
          loop: true
        },
        geometry: null, material: null, components: {},
        order: 6.430355530712444
      }

    }
  };

  // ============================================================
  // LÓGICA: esconde o modelo até o marker ser escaneado
  // Usa three.js diretamente — compatível com qualquer versão 8th Wall
  // ============================================================
  const hideUntilFound = () => {
    let found = false;
    let modelObject = null;

    // Esconde o modelo assim que a cena carregar
    const tryHide = setInterval(() => {
      const scene3d = window.XR8 && XR8.Threejs && XR8.Threejs.xrScene && XR8.Threejs.xrScene();
      if (!scene3d) return;

      scene3d.scene.traverse((obj) => {
        if (obj.name === "Untitled.glb" && !modelObject) {
          modelObject = obj;
          modelObject.visible = false;
          console.log("🙈 Personagem escondido — aguardando marker...");
          clearInterval(tryHide);
        }
      });
    }, 200);

    // Mostra o modelo quando o marker for encontrado pela primeira vez
    window.addEventListener("reality.imagefound", (e) => {
      if (found || e.detail.name !== "marker") return;
      found = true;

      if (modelObject) {
        modelObject.visible = true;
        console.log("✅ Marker encontrado! Personagem apareceu.");
      }
    });
  };

  if (window.XR8) {
    hideUntilFound();
  } else {
    window.addEventListener("xrloaded", hideUntilFound);
  }

  // ============================================================
  // INICIALIZAÇÃO
  // ============================================================
  window.ecs.registerComponent({
    name: "example-component",
    add: () => { console.log("Component attached."); }
  });

  delete scene.history;
  delete scene.historyVersion;
  window.ecs.application.init(scene);

})();