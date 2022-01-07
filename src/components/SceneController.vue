<template>
  <div>
    <button @click="populate()">Populate</button>
    <canvas ref="bjsCanvas" style="height: calc(50vw); width: calc(90vw)" />
  </div>
</template>

<script>
import { ref, onMounted } from "@vue/runtime-core";
import myScene from "@/scenes/MainScene.js";

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
    populate() {
      const items = [];
      for (var index = 0; index < 12; index++) {
        const item = {
          id: index,
          title: `Item #${index}`,
        };
        items.push(item);
      }
      myScene.setCompactCards(items);
    },
  },
};
</script>