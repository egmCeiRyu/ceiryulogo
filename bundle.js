(() => {
  "use strict";

  // ============================================================
  // DADOS DO IMAGE TARGET (marker.json embutido)
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
  // CONFIGURAÇÃO DO XR8 — Image Target + SLAM juntos
  // ============================================================
  const initXR = () => {
    XR8.XrController.configure({
      imageTargetData: [markerData],
      enableWorldTracking: true  // SLAM ativado
    });
  };

  if (window.XR8) {
    initXR();
  } else {
    window.addEventListener("xrloaded", initXR);
  }

  // ============================================================
  // COMPONENTE: aparece ao escanear e fica ancorado no mundo
  // ============================================================
  window.ecs.registerComponent({
    name: "spawn-on-marker",
    schema: {
      targetName: { type: "string", default: "marker" },
      modelId: { type: "string", default: "" }
    },
    add: (world, component) => {
      const { eid, schemaAttribute } = component;
      const { targetName, modelId } = schemaAttribute.get(eid);

      let spawned = false;

      // Escuta quando o marker é encontrado
      const onImageFound = ({ detail }) => {
        if (detail.name !== targetName || spawned) return;
        spawned = true;

        // Pega o objeto do modelo e torna visível
        const modelEid = world.findEntityByName(modelId);
        if (modelEid !== undefined) {
          // Move o modelo para a posição do marker no mundo
          const { position, rotation } = detail;
          world.setPosition(modelEid, position.x, position.y, position.z);
          world.setRotation(modelEid, rotation.x, rotation.y, rotation.z, rotation.w);

          // Torna visível
          world.setVisible(modelEid, true);

          // Desacopla do Image Target — agora está ancorado no mundo SLAM
          world.setParent(modelEid, world.scene);
        }

        console.log("✅ Marker encontrado! Personagem ancorado no mundo.");
      };

      window.addEventListener("reality.imagefound", onImageFound);
    }
  });

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

      // --- Câmera AR ---
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
            xrCameraType: "world",  // SLAM
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

      // --- Image Target (marker) — só para detecção ---
      "643be4c9-fa9d-4816-b0ec-114d3956b633": {
        id: "643be4c9-fa9d-4816-b0ec-114d3956b633",
        name: "Image Target",
        parentId: "88453035-dc0f-486d-868a-8ff7c2fda864",
        position: [0, 0, 0],
        rotation: [0, 0, 0, 1],
        scale: [1, 1, 1],
        imageTarget: { name: "marker" },
        geometry: null, material: null,
        // Componente que dispara o spawn ao detectar o marker
        components: {
          "spawn-on-marker": {
            targetName: "marker",
            modelId: "Untitled.glb"
          }
        },
        order: 3.04270821723535
      },

      // --- Modelo 3D GLB — começa invisível, aparece ao escanear ---
      "e35dbf9c-8de2-468e-9449-f9563e988696": {
        id: "e35dbf9c-8de2-468e-9449-f9563e988696",
        name: "Untitled.glb",
        parentId: "88453035-dc0f-486d-868a-8ff7c2fda864",
        position: [0, 0, 0],
        rotation: [0, 0, 0, 1],
        scale: [1, 1, 1],
        visible: false,  // invisível até o marker ser escaneado
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