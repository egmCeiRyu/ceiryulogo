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
  },
  a = {};
  
  function t(r) {
    var n = a[r];
    if (void 0 !== n) return n.exports;
    var d = a[r] = { exports: {} };
    return e[r](d, d.exports, t), d.exports;
  }
  
  (() => {
    "use strict";
    t(574);

    let jaEscaneou = false;

    // Injeta o controle de ancoragem permanente no ciclo de vida nativo da engine
    window.ecs.registerComponent({
      name: "example-component",
      add: () => {
        console.log("Component attached.");
        
        window.addEventListener('xrimagefound', (event) => {
          if (event.detail.name === 'marker' && !jaEscaneou) {
            jaEscaneou = true;
            console.log("🎯 Alvo detectado! Fixando modelo no mundo real...");

            const scene = window.ecs.application.scene;
            const idDoModelo = "e35dbf9c-8de2-468e-9449-f9563e988696";
            const modelo = scene.entities[idDoModelo];

            if (modelo && modelo.transform) {
              // Pega as coordenadas exatas de onde o papel estava
              const pos = event.detail.position;
              const rot = event.detail.rotation;

              // Força o modelo a assumir essa posição no espaço global (SLAM)
              modelo.transform.position = [pos.x, pos.y, pos.z];
              modelo.transform.rotation = [rot.x, rot.y, rot.z, rot.w || 1];
              
              // Torna o modelo visível permanentemente
              if (modelo.visibleComponent) {
                modelo.visibleComponent.visible = true;
              }

              // 🔥 O TRUQUE: Mandamos o motor parar de escutar a imagem. 
              // Isso congela o tracking de imagem e deixa o objeto fixo no SLAM!
              XR8.XrController.configure({ imageTargetData: [] });
              console.log("🔒 Posição travada. Scanner de imagem desligado!");
            }
          }
        });
      }
    });
    
    // Configuração da árvore: Repare que o pai do Untitled.glb agora é o Default Space (Raiz do mundo), e não mais o Image Target!
    const e = JSON.parse('{"objects":{"47699d9e-18a5-4f88-a4f9-b8be92e8f74a":{"components":{},"geometry":null,"id":"47699d9e-18a5-4f88-a4f9-b8be92e8f74a","light":{"type":"ambient"},"material":null,"name":"Ambient Light","position":[10,5,5],"rotation":[0,0,0,1],"scale":[1,1,1],"parentId":"88453035-dc0f-486d-868a-8ff7c2fda864","order":0.4038940050501252},"a608ddd9-9379-464d-966f-5d8d8674c83c":{"camera":{"type":"perspective","xr":{"desktop":"disabled","xrCameraType":"world","headset":"disabled","phone":"AR"}},"components":{},"geometry":null,"id":"a608ddd9-9379-464d-966f-5d8d8674c83c","material":null,"name":"Camera","position":[0,2,3],"rotation":[0.0004436887233141012,0.9659425615285845,-0.25875089860082223,0.0016563336561801576],"scale":[1,1,1],"parentId":"88453035-dc0f-486d-868a-8ff7c2fda864","order":1.0308214152219775},"ac1989e3-3b71-49e2-a05f-e682aeb18c36":{"components":{},"geometry":null,"id":"ac1989e3-3b71-49e2-a05f-e682aeb18c36","light":{"intensity":1,"type":"directional"},"material":null,"name":"Directional Light","position":[20,50,10],"rotation":[0,0,0,1],"scale":[1,1,1],"parentId":"88453035-dc0f-486d-868a-8ff7c2fda864","order":0.6644431107322474},"643be4c9-fa9d-4816-b0ec-114d3956b633":{"id":"643be4c9-fa9d-4816-b0ec-114d3956b633","position":[0,0,0],"rotation":[0,0,0,1],"scale":[1,1,1],"geometry":null,"material":null,"parentId":"88453035-dc0f-486d-868a-8ff7c2fda864","components":{"example-component":{}},"name":"Image Target","imageTarget":{"name":"marker","loadAutomatically":true},"order":3.04270821723535},"e35dbf9c-8de2-468e-9449-f9563e988696":{"id":"e35dbf9c-8de2-468e-9449-f9563e988696","position":[0,0,-10000],"rotation":[0,0,0,1],"scale":[1,1,1],"geometry":null,"material":null,"parentId":"88453035-dc0f-486d-868a-8ff7c2fda864","components":{},"gltfModel":{"src":{"type":"asset","asset":"assets/Untitled.glb"},"animationClip":"","loop":true},"name":"Untitled.glb","order":6.430355530712444}},"spaces":{"88453035-dc0f-486d-868a-8ff7c2fda864":{"id":"88453035-dc0f-486d-868a-8ff7c2fda864","name":"Default Space","activeCamera":"a608ddd9-9379-464d-966f-5d8d8674c83c"}},"entrySpaceId":"88453035-dc0f-486d-868a-8ff7c2fda864"}');
    
    delete e.history,
    delete e.historyVersion,
    window.ecs.application.init(e);
  })();
})();