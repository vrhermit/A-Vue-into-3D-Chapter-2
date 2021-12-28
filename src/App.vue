<template>
  <div id="app">
    <h1>A Vue into 3D</h1>
    <h2>Starting point</h2>
    <p>
      <b>About:</b> This template is part of a series of articles that I'm
      working on as I learn various ways to connect 3D JS frameworks to Vue JS.
      Please check my website for the latest posts in this series.
      <a href="https://radicalappdev.com">radicalappdev.com</a>
    </p>

    <p>
      This is not intended to be a "good" Vue app. The features below will be
      replaced in a 3D scene.
    </p>
    <h3>Features</h3>
    <ul>
      <li>Load some data from an API</li>
      <li>Page through sets of records</li>
      <li>Store a list of favorites in localStorage</li>
    </ul>
    <hr />
    <br />

    <section v-if="errored">
      <p>Nope. Not gonna happen.</p>
    </section>

    <section v-else>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <!-- Print the JSON to reference the response structure -->
        <!-- <pre
          >{{ itemResponse.headers }}
        </pre> -->
        <!-- <pre
          >{{ itemResponse.data }}
        </pre> -->
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
    </section>
  </div>
</template>

<script>
import ItemCard2D from "./components/ItemCard2D";
import LibraryService from "@/services/LibraryService.js";

export default {
  name: "App",
  components: {
    ItemCard2D,
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
