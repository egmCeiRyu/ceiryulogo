(() => {
  "use strict";

  // 🔥 1. CORREÇÃO: Criamos as variáveis de controle globais que faltavam no seu código
  let anchored = false;
  let modelObject = null;

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
  // CENA 3D
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

      "a608ddd9-9379-464d-966f-5d8d8674c83c": {
        id: "a608ddd9-9379-464d-966f-5d8d8674c83c",
        name: "Camera",
        parentId: "88453035-dc0f-486d-868a-8ff7c2fda864",
        position: [0, 2, 3],
        rotation: [0.0004436887233141012, 0.9659425615285845, -0.25875089860082223, 0.0016563336561801576],
        scale: [1, 1, 1],
        camera: {
          type: "perspective",
          xr: { desktop: "disabled", xrCameraType: "world", headset: "disabled", phone: "AR" }
        },
        geometry: null, material: null, components: {},
        order: 1.0308214152219775
      },

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

      "643be4c9-fa9d-4816-b0ec-114d3956b633": {
        id: "643be4c9-fa9d-4816-b0ec-114d3956b633",
        name: "Image Target",
        parentId: "88453035-dc0f-486d-868a-8ff7c2fda864",
        position: [0, 0.5272021614215185, 0],
        rotation: [0, 0, 0, 1],
        scale: [1, 1, 1],
        imageTarget: { name: "marker" },
        geometry: null, material: null, components: { "example-component": {} }, // Ativa o componente aqui
        order: 3.04270821723535
      },

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
  // EVENTOS DO IMAGE TARGET (FIXADO DEFINITIVO)
  // ============================================================
  const setupAR = () => {
    window.addEventListener("xrimagefound", (e) => {
      if (anchored || e.detail.name !== "marker") return;

      // 🔥 2. CAPTURA DINÂMICA: Como rodamos dentro do ECS, pegamos o objeto do Three.js direto da memória da cena ativa
      if (window.ecs && window.ecs.application && window.ecs.application.scene) {
        const activeScene = window.ecs.application.scene;
        const targetEntity = activeScene.entities["e35dbf9c-8de2-468e-9449-f9563e988696"]; // ID do seu GLB
        if (targetEntity && targetEntity.object3D) {
          modelObject = targetEntity.object3D;
        }
      }

      if (!modelObject) return;
      anchored = true;

      const xrScene = XR8.Threejs.xrScene();

      // 1. Captura a posição real do mundo onde o papel está na mesa
      const worldPosition = new THREE.Vector3();
      const worldQuaternion = new THREE.Quaternion();
      const worldScale = new THREE.Vector3();
      modelObject.matrixWorld.decompose(worldPosition, worldQuaternion, worldScale);

      // 2. Tira o modelo do controle do Image Target e joga no mundo real (SLAM)
      xrScene.scene.attach(modelObject);

      // 3. Cola as coordenadas fixas nele
      modelObject.position.copy(worldPosition);
      modelObject.quaternion.copy(worldQuaternion);
      modelObject.scale.copy(worldScale);

      // 4. Desliga o recalculamento de movimento automática deste objeto
      modelObject.matrixAutoUpdate = false;
      modelObject.updateMatrixWorld(true);

      // 5. IMPEDIR O SUMIÇO: Força a visibilidade a ser eterna, ignorando o motor
      modelObject.visible = true;
      Object.defineProperty(modelObject, 'visible', {
        get: () => true,
        set: () => {}, 
        configurable: false
      });

      // 6. DESLIGA O SCANNER: Fala para a câmera parar de procurar o papel
      XR8.XrController.configure({ imageTargetData: [] });

      console.log("🔒 SUCESSO! Personagem imobilizado e fixado no mundo real.");
    });
  };

  // 🔥 3. CORREÇÃO: Registra o ouvinte dos eventos assim que a XR carregar
  if (window.XR8) {
    setupAR();
  } else {
    window.addEventListener("xrloaded", setupAR);
  }

  // ============================================================
  // INICIALIZAÇÃO DO MOTOR ECS
  // ============================================================
  window.ecs.registerComponent({
    name: "example-component",
    add: () => { console.log("Component attached."); }
  });

  delete scene.history;
  delete scene.historyVersion;
  window.ecs.application.init(scene);

})();