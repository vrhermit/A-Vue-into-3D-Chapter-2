<template>
  <div>
    <button @click="sendAction">text control panel</button>
    <canvas ref="bjsCanvas" style="height: calc(50vw); width: calc(90vw)" />
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/runtime-core";
import { myScene, tester } from "@/scenes/MainScene.js";

export default {
  name: "BabylonScene",
  setup() {
    const bjsCanvas = ref(null);

    onMounted(async () => {
      if (bjsCanvas.value) {
        await myScene.createScene(bjsCanvas.value);
      }
    });

    return {
      bjsCanvas,
    };
  },
  methods: {
    sendAction() {
      tester.value = "changing the value from the component";
      // console.log(tester.value);
      // myScene.controlPanelAction("test");
    },
  },
};
</script>