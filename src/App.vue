<template>
  <div id="app">
    <h1>A Vue into 3D</h1>
    <h2>Chapter 2.2 – Babylon JS</h2>
    <p>
      <b>About:</b> This template is part of a series of articles that I'm
      working on as I learn various ways to connect 3D JS frameworks to Vue JS.
      Please check my website for the latest posts in this series.
      <a href="https://radicalappdev.com">radicalappdev.com</a>
    </p>

    <p>Nothing to see here yet.</p>

    <hr />
    <br />
    <SceneController />

    <!-- <section v-if="errored">
      <p>Nope. Not gonna happen.</p>
    </section>

    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <div>
          <button @click="loadPrevious" :disabled="this.page <= 1">
            Previous
          </button>
          <button
            @click="loadNext"
            :disabled="
              this.page >= this.itemResponse.headers['x-wp-totalpages']
            "
          >
            Next
          </button>
          <span> Page {{ page }}</span>
        </div>

        <ItemCard2D
          v-for="item of itemResponse.data"
          v-bind:key="item.id"
          class="item"
          :item="item"
        />
      </div>
    </section> -->
  </div>
</template>

<script>
// import ItemCard2D from "./components/ItemCard2D";
import LibraryService from "@/services/LibraryService.js";
import SceneController from "./components/SceneController.vue";

export default {
  name: "App",
  components: {
    // ItemCard2D,
    SceneController,
  },
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
  },

  created() {
    this.loadData();
  },
};
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
