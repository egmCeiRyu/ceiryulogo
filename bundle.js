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
  // COMPONENTE DE LOGICA NATIVA (FIXAÇÃO PERMANENTE NO PRIMEIRO SCAN)
  // ============================================================
  let jaEscaneou = false;

  window.ecs.registerComponent({
    name: "example-component",
    add: () => { 
      console.log("🚀 Componente de Ancoragem Ativado."); 

      window.addEventListener("xrimagefound", (event) => {
        if (event.detail.name === "marker" && !jaEscaneou) {
          jaEscaneou = true;
          console.log("🎯 Alvo detectado! Fixando personagem no espaço real...");

          const sceneApp = window.ecs.application.scene;
          const idDoModelo = "e35dbf9c-8de2-468e-9449-f9563e988696";
          const entidadeModelo = sceneApp.entities[idDoModelo];

          if (entidadeModelo && entidadeModelo.transform) {
            // Coleta a posição e rotação exatas geradas no frame do scan
            const pos = event.detail.position;
            const rot = event.detail.rotation;

            // Teleporta o modelo do limbo [-10000] para o local real do papel
            entidadeModelo.transform.position = [pos.x, pos.y, pos.z];
            entidadeModelo.transform.rotation = [rot.x, rot.y, rot.z, rot.w || 1];

            if (entidadeModelo.visibleComponent) {
              entidadeModelo.visibleComponent.visible = true;
            }

            // 🔥 O PULO DO GATO: Desliga o scanner de imagem completamente!
            // Sem alvos ativos, o 8th Wall para de mandar ordens e foca só no giroscópio (SLAM)
            XR8.XrController.configure({ imageTargetData: [] });
            console.log("🔒 Posição cravada com sucesso!");
          }
        }
      });
    }
  });

  // ============================================================
  // ÁRVORE DA CENA ECS CORRIGIDA
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
      // Luz ambiente
      "47699d9e-18a5-4f88-a4f9-b8be92e8f74a": {
        id: "47699d9e-18a5-4f88-a4f9-b8be92e8f74a",
        name: "Ambient Light",
        parentId: "88453035-dc0f-486d-868a-8ff7c2fda864",
        position: [10, 5, 5], rotation: [0, 0, 0, 1], scale: [1, 1, 1],
        light: { type: "ambient" }, geometry: null, material: null, components: {},
        order: 0.4038940050501252
      },

      // Câmera AR
      "a608ddd9-9379-464d-966f-5d8d8674c83c": {
        id: "a608ddd9-9379-464d-966f-5d8d8674c83c",
        name: "Camera",
        parentId: "88453035-dc0f-486d-868a-8ff7c2fda864",
        position: [0, 2, 3],
        rotation: [0.0004436887233141012, 0.9659425615285845, -0.25875089860082223, 0.0016563336561801576],
        scale: [1, 1, 1],
        camera: { type: "perspective", xr: { desktop: "disabled", xrCameraType: "world", headset: "disabled", phone: "AR" } },
        geometry: null, material: null, components: {},
        order: 1.0308214152219775
      },

      // Luz direcional
      "ac1989e3-3b71-49e2-a05f-e682aeb18c36": {
        id: "ac1989e3-3b71-49e2-a05f-e682aeb18c36",
        name: "Directional Light",
        parentId: "88453035-dc0f-486d-868a-8ff7c2fda864",
        position: [20, 50, 10], rotation: [0, 0, 0, 1], scale: [1, 1, 1],
        light: { intensity: 1, type: "directional" }, geometry: null, material: null, components: {},
        order: 0.6644431107322474
      },

      // Image Target (Ativa o nosso componente de escuta aqui)
      "643be4c9-fa9d-4816-b0ec-114d3956b633": {
        id: "643be4c9-fa9d-4816-b0ec-114d3956b633",
        name: "Image Target",
        parentId: "88453035-dc0f-486d-868a-8ff7c2fda864",
        position: [0, 0, 0], rotation: [0, 0, 0, 1], scale: [1, 1, 1],
        imageTarget: { name: "marker" }, geometry: null, material: null, 
        components: { "example-component": {} },
        order: 3.04270821723535
      },

      // 🔥 MODELO GLB SOLTO NA RAIZ DO MUNDO E OCULTO NO SPAWN [-10000]
      "e35dbf9c-8de2-468e-9449-f9563e988696": {
        id: "e35dbf9c-8de2-468e-9449-f9563e988696",
        name: "Untitled.glb",
        parentId: "88453035-dc0f-486d-868a-8ff7c2fda864", // Linkado ao Default Space, não ao target!
        position: [0, 0, -10000], 
        rotation: [0, 0, 0, 1], scale: [1, 1, 1],
        gltfModel: { src: { type: "asset", asset: "assets/Untitled.glb" }, animationClip: "*", loop: true },
        geometry: null, material: null, components: {},
        order: 6.430355530712444
      }
    }
  };

  delete scene.history;
  delete scene.historyVersion;
  window.ecs.application.init(scene);

})();