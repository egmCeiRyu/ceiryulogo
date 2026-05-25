// === SEU CÓDIGO ATUALIZADO (substitua o conteúdo do bundle.js) ===

(() => {
  // Configuração do Image Target
  const configureXr = () => {
    XR8.XrController.configure({
      imageTargetData: [require('./marker.json')]  // ou o caminho correto
    });
  };

  window.XR8 ? configureXr() : window.addEventListener("xrloaded", configureXr);

  // ==================== PIPELINE MODULE ====================
  const slamImageTargetModule = {
    name: "slam-image-target",
    listeners: [
      {
        event: "reality.imagefound",
        process: ({ detail }) => {
          if (detail.name !== "marker") return;

          const { position, rotation } = detail;
          const { scene } = XR8.Threejs.xrScene();

          let model = null;
          scene.traverse((obj) => {
            if (obj.name === "Untitled.glb" || obj.userData?.name === "Untitled.glb") {
              model = obj;
            }
          });

          if (!model) {
            console.warn("❌ Modelo GLB não encontrado");
            return;
          }

          // Posiciona e orienta o modelo no marker
          model.position.set(position.x, position.y, position.z);
          model.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);

          // **Importante**: Solta o modelo da hierarquia do Image Target
          if (model.parent !== scene) {
            scene.attach(model);
          }

          model.visible = true;

          console.log("✅ Marker detectado! Personagem ancorado no mundo.");
        }
      },

      // Opcional: esconde novamente se perder o marker por muito tempo
      {
        event: "reality.imagelost",
        process: ({ detail }) => {
          if (detail.name !== "marker") return;
          console.log("⚠️ Marker perdido. Personagem continua ancorado.");
          // Não escondemos aqui, pois queremos que ele fique
        }
      }
    ]
  };

  // Esconde o modelo no início
  const hideOnStartModule = {
    name: "hide-on-start",
    onStart: () => {
      const { scene } = XR8.Threejs.xrScene();
      let found = false;

      scene.traverse((obj) => {
        if (obj.name === "Untitled.glb") {
          obj.visible = false;
          found = true;
          console.log("🙈 Personagem escondido — aguardando marker...");
        }
      });

      if (!found) {
        console.warn("⚠️ Modelo 'Untitled.glb' não encontrado na cena.");
      }
    }
  };

  const addPipeline = () => {
    XR8.addCameraPipelineModule(slamImageTargetModule);
    XR8.addCameraPipelineModule(hideOnStartModule);
  };

  if (window.XR8) {
    addPipeline();
  } else {
    window.addEventListener("xrloaded", addPipeline);
  }

  // Inicializa a cena ECS (seu JSON)
  const sceneData = JSON.parse('{"objects":{...}}'); // seu JSON completo aqui
  delete sceneData.history;
  delete sceneData.historyVersion;
  window.ecs.application.init(sceneData);
})();