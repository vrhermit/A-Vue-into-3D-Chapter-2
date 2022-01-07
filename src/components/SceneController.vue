<template>
  <div>
    <button @click="sendAction">text control panel</button>
    <canvas ref="bjsCanvas" style="height: calc(50vw); width: calc(90vw)" />
  </div>
</template>

<script>
import LibraryService from "@/services/LibraryService.js";
import { ref, onMounted } from "@vue/runtime-core";
import { myScene } from "@/scenes/MainScene.js";

export default {
  name: "BabylonScene",
  setup() {
    const bjsCanvas = ref(null);

    onMounted(async () => {
      if (bjsCanvas.value) {
        await myScene.createScene(bjsCanvas.value);
      }
        this.loadData();
    });

    return {
      bjsCanvas,
    };
  },
  methods: {
    sendAction() {
      // console.log(tester.value);
      // myScene.controlPanelAction("test");
    },
    loadData() {
      myScene.loading = true;
      myScene.itemResponse = null;
      return LibraryService.getItems(12, myScene.page)
        .then((response) => {
          myScene.itemResponse = response;
          myScene.totalItems = response.headers["x-wp-total"];
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => (myScene.loading = false));
    },
    loadPrevious() {
      if (myScene.page > 1) {
        myScene.page = myScene.page - 1;
        this.loadData();
      }
    },
    loadNext() {
      if (myScene.page < myScene.itemResponse.headers["x-wp-totalpages"]) {
        myScene.page = myScene.page + 1;
        this.loadData();
      }
    },
  },
};
</script>