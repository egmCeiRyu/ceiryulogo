(() => {
  "use strict";

  // Configurar Image Target
  const configureTarget = () => {
    XR8.XrController.configure({
      imageTargetData: [require('./marker.json')]
    });
  };

  if (window.XR8) configureTarget();
  else window.addEventListener("xrloaded", configureTarget);

  // Módulo principal
  const imageTargetModule = {
    name: "marker-anchoring",
    listeners: [
      {
        event: "reality.imagefound",
        process: ({ detail }) => {
          if (detail.name !== "marker") return;

          const { scene } = XR8.Threejs.xrScene();
          let model = null;

          scene.traverse((obj) => {
            if (obj.name === "Untitled.glb") model = obj;
          });

          if (!model) {
            console.error("❌ GLB não encontrado: Untitled.glb");
            return;
          }

          const { position } = detail;

          // Só aplica a POSIÇÃO (sem rotação)
          model.position.set(position.x, position.y, position.z);

          // Solta o modelo da hierarquia do Image Target
          if (model.parent !== scene) {
            scene.attach(model);
          }

          model.visible = true;
          
          console.log("✅ Marker detectado! Personagem ancorado (sem rotação do marker)");
        }
      }
    ]
  };

  // Esconder modelo no início
  const hideModule = {
    name: "hide-on-start",
    onStart: () => {
      const { scene } = XR8.Threejs.xrScene();
      scene.traverse((obj) => {
        if (obj.name === "Untitled.glb") {
          obj.visible = false;
          console.log("🙈 Modelo escondido - aponte para o marker");
        }
      });
    }
  };

  // Adicionar módulos
  const initModules = () => {
    XR8.addCameraPipelineModule(imageTargetModule);
    XR8.addCameraPipelineModule(hideModule);
  };

  if (window.XR8) initModules();
  else window.addEventListener("xrloaded", initModules);

  // Inicializar cena ECS
  const sceneData = JSON.parse('{"objects":{"47699d9e-18a5-4f88-a4f9-b8be92e8f74a":{"components":{},"geometry":null,"id":"47699d9e-18a5-4f88-a4f9-b8be92e8f74a","light":{"type":"ambient"},"material":null,"name":"Ambient Light","position":[10,5,5],"rotation":[0,0,0,1],"scale":[1,1,1],"parentId":"88453035-dc0f-486d-868a-8ff7c2fda864","order":0.4038940050501252},"a608ddd9-9379-464d-966f-5d8d8674c83c":{"camera":{"type":"perspective","xr":{"desktop":"disabled","xrCameraType":"world","headset":"disabled","phone":"AR"}},"components":{},"geometry":null,"id":"a608ddd9-9379-464d-966f-5d8d8674c83c","material":null,"name":"Camera","position":[0,2,3],"rotation":[0.0004436887233141012,0.9659425615285845,-0.25875089860082223,0.0016563336561801576],"scale":[1,1,1],"parentId":"88453035-dc0f-486d-868a-8ff7c2fda864","order":1.0308214152219775},"ac1989e3-3b71-49e2-a05f-e682aeb18c36":{"components":{},"geometry":null,"id":"ac1989e3-3b71-49e2-a05f-e682aeb18c36","light":{"intensity":1,"type":"directional"},"material":null,"name":"Directional Light","position":[20,50,10],"rotation":[0,0,0,1],"scale":[1,1,1],"parentId":"88453035-dc0f-486d-868a-8ff7c2fda864","order":0.6644431107322474},"643be4c9-fa9d-4816-b0ec-114d3956b633":{"id":"643be4c9-fa9d-4816-b0ec-114d3956b633","position":[0,0.5272021614215185,0],"rotation":[0,0,0,1],"scale":[1,1,1],"geometry":null,"material":null,"parentId":"88453035-dc0f-486d-868a-8ff7c2fda864","components":{},"name":"Image Target","imageTarget":{"name":"marker"},"order":3.04270821723535},"e35dbf9c-8de2-468e-9449-f9563e988696":{"id":"e35dbf9c-8de2-468e-9449-f9563e988696","position":[0,-0.5272021614215185,0.1265981015238123],"rotation":[0,0,0,1],"scale":[1,1,1],"parentId":"643be4c9-fa9d-4816-b0ec-114d3956b633","components":{},"gltfModel":{"src":{"type":"asset","asset":"assets/Untitled.glb"},"animationClip":"","loop":true},"name":"Untitled.glb","order":6.430355530712444}},"spaces":{"88453035-dc0f-486d-868a-8ff7c2fda864":{"id":"88453035-dc0f-486d-868a-8ff7c2fda864","name":"Default Space","activeCamera":"a608ddd9-9379-464d-966f-5d8d8674c83c"}},"entrySpaceId":"88453035-dc0f-486d-868a-8ff7c2fda864"}');

  delete sceneData.history;
  delete sceneData.historyVersion;
 