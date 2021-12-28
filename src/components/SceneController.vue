<template>
  <canvas ref="bjsCanvas" style="height: calc(50vw); width: calc(90vw)" />
</template>

<script>
import { ref, onMounted } from "@vue/runtime-core";
import createScene  from "@/scenes/MainScene.js";

export default {
  name: "BabylonScene",
  setup() {
    const bjsCanvas = ref(null);

    onMounted(async() => {
      if (bjsCanvas.value) {
       await createScene(bjsCanvas.value);
      }
    });

    return {
      bjsCanvas,
    };
  },
};
</script>