<template>
  <div id="app">
    <h1>A Vue into 3D</h1>
    <h2>Chapter 2.2: Babylon JS - Compact Cards and Data Flow</h2>
    <p>
      <b>About:</b> This template is part of a series of articles that I'm
      working on as I learn various ways to connect 3D JS frameworks to Vue JS.
      Please check my website for the latest posts in this series.
      <a href="https://radicalappdev.com">radicalappdev.com</a>
    </p>

    <hr />
    <br />

    <SceneController />
  </div>
</template>

<script>
import SceneController from "./components/SceneController.vue";

export default {
  name: "App",
  components: {
    SceneController,
  },
};
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
