<template>
  <div id="app">
    <BaseLayout
      @changeCount="updateTitle"
    />
  </div>
</template>

<script setup>
import BaseLayout from './components/BaseLayout.vue';

function updateTitle(text) {
  const titleEl = document.querySelector('head title');
  titleEl.textContent = text;
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
