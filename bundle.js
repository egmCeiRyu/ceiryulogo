(()=>{var e={574(e,a,t){const r=()=>{XR8.XrController.configure({imageTargetData:[t(43)]})};window.XR8?r():window.addEventListener("xrloaded",r)},43(e){"use strict";e.exports=JSON.parse('{"type":"PLANAR","properties":{"top":0,"left":144,"width":941,"height":1254,"isRotated":false,"originalWidth":1254,"originalHeight":1254},"imagePath":"image-targets/marker_luminance.png","metadata":{"type":"PLANAR","properties":{"top":0,"left":144,"width":941,"height":1254,"isRotated":false,"originalWidth":1254,"originalHeight":1254},"imagePath":"image-targets/marker_luminance.png","metadata":null,"name":"marker","resources":{"originalImage":"marker_original.png","croppedImage":"marker_cropped.png","thumbnailImage":"marker_thumbnail.png","luminanceImage":"marker_luminance.png"},"created":1777364648883,"updated":1777366647349},"name":"marker","resources":{"originalImage":"marker_original.png","croppedImage":"marker_cropped.png","thumbnailImage":"marker_thumbnail.png","luminanceImage":"marker_luminance.png"},"created":1777364648883,"updated":1777367342718}')}},a={};function t(r){var n=a[r];if(void 0!==n)return n.exports;var d=a[r]={exports:{}};return e[r](d,d.exports,t),d.exports}(()=>{"use strict";t(574),window.ecs.registerComponent({name:"example-component",add:()=>{console.log("Component attached.")}});

  // Pipeline module: esconde o GLB no inicio, mostra e ancora ao encontrar o marker
  const slamImageTargetModule = {
    name: "slam-image-target",
    listeners: [
      {
        event: "reality.imagefound",
        process: ({ detail }) => {
          if (detail.name !== "marker") return;

          const { position, rotation } = detail;
          const { scene } = XR8.Threejs.xrScene();

          // Encontra o objeto GLB na cena
          let model = null;
          scene.traverse((obj) => {
            if (obj.name === "Untitled.glb") model = obj;
          });

          if (!model) return;

          // Posiciona no lugar do marker
          model.position.set(position.x, position.y, position.z);
          model.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);

          // Garante que está solto na cena raiz (não filho do image target)
          if (model.parent !== scene) {
            scene.attach(model);
          }

          // Torna visível
          model.visible = true;

          console.log("✅ Marker encontrado! Personagem apareceu e ficou ancorado.");
        }
      }
    ]
  };

  const addPipeline = () => {
    XR8.addCameraPipelineModule(slamImageTargetModule);

    // Esconde o modelo assim que a cena carregar
    XR8.addCameraPipelineModule({
      name: "hide-on-start",
      onStart: () => {
        const { scene } = XR8.Threejs.xrScene();
        scene.traverse((obj) => {
          if (obj.name === "Untitled.glb") {
            obj.visible = false;
            console.log("🙈 Personagem escondido — aguardando marker...");
          }
        });
      }
    });
  };

  if (window.XR8) {
    addPipeline();
  } else {
    window.addEventListener("xrloaded", addPipeline);
  }

const e=JSON.parse('{"objects":{"47699d9e-18a5-4f88-a4f9-b8be92e8f74a":{"components":{},"geometry":null,"id":"47699d9e-18a5-4f88-a4f9-b8be92e8f74a","light":{"type":"ambient"},"material":null,"name":"Ambient Light","position":[10,5,5],"rotation":[0,0,0,1],"scale":[1,1,1],"parentId":"88453035-dc0f-486d-868a-8ff7c2fda864","order":0.4038940050501252},"a608ddd9-9379-464d-966f-5d8d8674c83c":{"camera":{"type":"perspective","xr":{"desktop":"disabled","xrCameraType":"world","headset":"disabled","phone":"AR"}},"components":{},"geometry":null,"id":"a608ddd9-9379-464d-966f-5d8d8674c83c","material":null,"name":"Camera","position":[0,2,3],"rotation":[0.0004436887233141012,0.9659425615285845,-0.25875089860082223,0.0016563336561801576],"scale":[1,1,1],"parentId":"88453035-dc0f-486d-868a-8ff7c2fda864","order":1.0308214152219775},"ac1989e3-3b71-49e2-a05f-e682aeb18c36":{"components":{},"geometry":null,"id":"ac1989e3-3b71-49e2-a05f-e682aeb18c36","light":{"intensity":1,"type":"directional"},"material":null,"name":"Directional Light","position":[20,50,10],"rotation":[0,0,0,1],"scale":[1,1,1],"parentId":"88453035-dc0f-486d-868a-8ff7c2fda864","order":0.6644431107322474},"643be4c9-fa9d-4816-b0ec-114d3956b633":{"id":"643be4c9-fa9d-4816-b0ec-114d3956b633","position":[0,0.5272021614215185,0],"rotation":[0,0,0,1],"scale":[1,1,1],"geometry":null,"material":null,"parentId":"88453035-dc0f-486d-868a-8ff7c2fda864","components":{},"name":"Image Target","imageTarget":{"name":"marker"},"order":3.04270821723535},"e35dbf9c-8de2-468e-9449-f9563e988696":{"id":"e35dbf9c-8de2-468e-9449-f9563e988696","position":[0,-0.5272021614215185,0.1265981015238123],"rotation":[0,0,0,1],"scale":[1,1,1],"parentId":"643be4c9-fa9d-4816-b0ec-114d3956b633","components":{},"gltfModel":{"src":{"type":"asset","asset":"assets/Untitled.glb"},"animationClip":"","loop":true},"name":"Untitled.glb","order":6.430355530712444}},"spaces":{"88453035-dc0f-486d-868a-8ff7c2fda864":{"id":"88453035-dc0f-486d-868a-8ff7c2fda864","name":"Default Space","activeCamera":"a608ddd9-9379-464d-966f-5d8d8674c83c"}},"entrySpaceId":"88453035-dc0f-486d-868a-8ff7c2fda864"}');delete e.history,delete e.historyVersion,window.ecs.application.init(e)})()})();