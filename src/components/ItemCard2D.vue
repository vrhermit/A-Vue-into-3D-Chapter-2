<template>
  <article>
    <!-- Yes, I really am this lazy. I told you, this will all be replaced with 3D content. Move along please. -->
    <table width="100%">
      <col width="30%" />
      <col width="70%" />
      <tbody>
        <tr>
          <td align="right">
            <template v-if="errored || loading">
              <img class="card-image" src="@/assets/ec_logo_02.jpg" alt="" />
            </template>
            <template v-else>
              <img
                class="card-image"
                :src="imageResponse.data.media_details.sizes.full.source_url"
                alt=""
              />
            </template>
                 </td>
          <td>
            <h1 v-html="item.title.rendered"></h1>
            <p style="font-size: 80%">{{ item.date }}</p>
            <p>{{ item.acf.acf_library_description }}</p>
            <template v-if="this.isFavorite">
              <button @click="toggleFavorite()">Remove from Favorites</button>
            </template>
            <template v-else>
              <button @click="toggleFavorite()">Add to Favorites</button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </article>
</template>

<script>
import LibraryService from "@/services/LibraryService.js";
export default {
  name: "ItemCard2D",
  props: {
    item: Object,
  },
  data() {
    return {
      imageResponse: null,
      loading: true,
      errored: false,
      isFavorite: null,
    };
  },
  methods: {
    loadImage() {
      return LibraryService.getItemImage(this.item.featured_media)
        .then((response) => {
          this.imageResponse = response;
          this.totalItems = response.headers["x-wp-total"];
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => (this.loading = false));
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
    },
  },
  computed: {
    storageKey() {
      return "item_" + this.item.id;
    },
  },
  created() {
    this.loadImage();

    if (localStorage[this.storageKey]) {
      this.isFavorite = localStorage[this.storageKey];
    }
  },
  watch: {
    isFavorite(value) {
      localStorage[this.storageKey] = value;
    },
  },
};
</script>

<style scoped>
table {
  border-top: 1px solid LightGray;
  margin-top: 1rem;
}

td {
    vertical-align: top;
}

.card-image {
    width: 200px;
  height: 200px;
  object-fit: cover;
  margin-top: 1.25rem;
    margin-right: 1rem;
}
</style>