<template>
  <div id="app">
    <div class="controls">
      <label for="color-input">
        <input id="color-input" v-model="multicolored" type="checkbox" />
        Разноцветные блоки
      </label>
    </div>
    <BaseLayout @changeCount="updateTitle" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseLayout from './components/BaseLayout.vue';

const multicolored = ref(false);

function updateTitle(text) {
  const titleEl = document.querySelector('head title');
  titleEl.textContent = text;
}
</script>

<style>
.controls {
  width: 100vw;
  height: 5vh;
  display: flex !important;
  justify-content: center;
}
</style>
