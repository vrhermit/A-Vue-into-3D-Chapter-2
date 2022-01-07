<template>
  <div>
    <button @click="populate()">Populate</button>
    <canvas ref="bjsCanvas" style="height: calc(50vw); width: calc(90vw)" />
  </div>
</template>

<script>
import LibraryService from "@/services/LibraryService.js";

import { ref, onMounted } from "@vue/runtime-core";
import myScene from "@/scenes/MainScene.js";

export default {
  name: "BabylonScene",
  data() {
    return {
      itemResponse: null,
      totalItems: 0,
      loading: true,
      errored: false,
      page: 1,
      perPage: 12,
    };
  },
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
    loadData() {
      this.loading = true;
      this.itemResponse = null;
      return LibraryService.getItems(12, this.page)
        .then((response) => {
          this.itemResponse = response;
          this.totalItems = response.headers["x-wp-total"];
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => (this.loading = false));
    },
    loadPrevious() {
      if (this.page > 1) {
        this.page = this.page - 1;
        this.loadData();
      }
    },
    loadNext() {
      if (this.page < this.itemResponse.headers["x-wp-totalpages"]) {
        this.page = this.page + 1;
        this.loadData();
      }
    },
    populate() {
      const items = this.itemResponse.data.map((item) => {
        return {
          id: item.id,
          title: item.title.rendered,
          content: item.acf.acf_library_description,
          image: item.featured_image_src_large[0],
        };
      });
      myScene.setCompactCards(items);
    },
  },
  created() {
    this.loadData();
  },
};
</script>