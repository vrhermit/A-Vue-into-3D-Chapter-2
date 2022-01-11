<template>
  <canvas
    id="bjsCanvas"
    ref="bjsCanvas"
    style="height: calc(50vw); width: calc(100vw)"
  />
</template>

<script>
import LibraryService from "@/services/LibraryService.js";
import SceneWrapper from "@/scenes/SceneWrapper.js";

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
  methods: {
    loadData() {
      this.loading = true;
      this.itemResponse = null;
      return LibraryService.getItems(this.perPage, this.page)
        .then((response) => {
          this.itemResponse = response;
          this.totalItems = response.headers["x-wp-total"];
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
          this.populate();
        });
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
      const items = this.itemResponse.data?.map((item) => {
        return {
          id: item.id,
          title: item.title.rendered,
          description: item.acf.acf_library_description,
          image: item.featured_image_src_large[0],
        };
      });
      SceneWrapper.populateCompactCards(items);
    },
    loadAPI() {
      console.log("loadAPI");
    },
    loadFavorite() {
      console.log("loadFavorite");
    },
  },
  created() {
    this.loadData();
  },
  async mounted() {
    await SceneWrapper.createScene(document.getElementById("bjsCanvas"));
    SceneWrapper.sendControlPanelButton("<", this.loadPrevious);
    SceneWrapper.sendControlPanelButton(">", this.loadNext);
    SceneWrapper.sendControlPanelButton("", () => {});
    SceneWrapper.sendControlPanelButton("API", this.loadAPI);
    SceneWrapper.sendControlPanelButton("FAV", this.loadFavorite);
  },
};
</script>