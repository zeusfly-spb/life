<template>
  <div id="app">
    <div class="controls">
      <label for="color-input">
        Разноцветные блоки
        <input id="color-input" v-model="multicolored" type="checkbox"/>
      </label>
      <label for="unlimited-field">
        Бесконечное поле
        <input id="color-input" v-model="unlimited" type="checkbox"/>
      </label>
      <label for="type-select">
        Тип фигуры
        <select
          id="type-select"
          v-model="type"
        >
          <option
            v-for="type in types"
            :key="type.name"
            :value="type.value"
          >
            {{ type.name }}
          </option>
        </select>
      </label>
    </div>
    <BaseLayout
      :active="active"
      :multicolor="multicolored"
      :type="type"
      :unlimited="unlimited"
      @changeActive="active = !active"
      @changeCount="updateTitle"
    />
  </div>
</template>

<script setup>
import {ref} from "vue";
import BaseLayout from "./components/BaseLayout.vue";


const multicolored = ref(false);
const active = ref(false);
const type = ref('v-rect');
const unlimited = ref(false);

const types = [
  {name: 'Квадрат', value: 'v-rect'},
  {name: 'Круг', value: 'v-circle'},
  {name: 'Звезда', value: 'v-star'},
];

function updateTitle(text) {
  const titleEl = document.querySelector("head title");
  titleEl.textContent = text;
}
</script>

<style>
.controls {
  width: 100vw;
  height: 5vh;
  display: flex !important;
  justify-content: space-around;
  align-items: center;
}

#type-select {
  border: none;
  background: white;
}
</style>
