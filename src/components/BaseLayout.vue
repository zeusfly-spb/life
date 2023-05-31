<template>
  <v-stage :config="configKonva">
    <v-layer>
      <div v-for="(row, rowIndex) in grid" :key="'row' + rowIndex">
        <v-rect
          v-for="(field, fieldIndex) in row"
          :key="'field' + fieldIndex + commonKey"
          :config="{
            strokeWidth: 4,
            stroke: 'white',
            y: rowIndex * cellSize,
            x: fieldIndex * cellSize,
            width: cellSize,
            height: cellSize,
            fill: field ? 'green' : 'white',
          }"
        />
      </div>
    </v-layer>
  </v-stage>
</template>

<script setup>
/* eslint-disable no-shadow,no-use-before-define,no-plusplus */
import {
  ref, computed, defineEmits, watch, onMounted,
} from 'vue';

const areaSize = ref(600);
const commonKey = ref(0);
const cellSize = ref(20);
const grid = ref([]);

const configKonva = computed(() => ({
  width: areaSize.value,
  height: areaSize.value,
}));

const lenX = computed(() => Math.round(areaSize.value / cellSize.value));
const lenY = computed(() => Math.round(areaSize.value / cellSize.value));

function seed() {
  const aliveCount = 300;
  for (let i = 0; i <= aliveCount; i++) {
    // eslint-disable-next-line no-use-before-define
    const x = random(lenX.value);
    const y = random(lenY.value);
    grid.value[y][x] = true;
    commonKey.value++;
  }
}

function makeLife() {
  for (let y = 0; y <= lenY.value; y++) {
    for (let x = 0; x <= lenX.value; x++) {
      prepareField({ x, y });
    }
  }
}

function neighbourCount({ x, y }) {
  const all = [];
  all.push(x && y ? grid.value[y - 1][x - 1] : false); // A
  all.push(y ? grid.value[y - 1][x] : false); // B
  all.push(y && x < lenX.value ? grid.value[y - 1][x + 1] : false); // C
  all.push(x ? grid.value[y][x - 1] : false); // D
  all.push(x < lenX.value ? grid.value[y][x + 1] : false); // E
  all.push(x && y < lenY.value ? grid.value[y + 1][x - 1] : false); // F
  all.push(y < lenY.value ? grid.value[y + 1][x] : false); // G
  all.push(y < lenY.value && x < lenX.value ? grid.value[y + 1][x + 1] : false); // H
  return all.filter((item) => !!item).length;
}

function aliveCount() {
  let count = 0;
  for (let y = 0; y <= lenY.value; y++) {
    const rowCount = grid.value[y].filter((item) => !!item).length;
    count += rowCount;
  }
  return count;
}

function prepareField({ x, y }) {
  const aliveNeighbours = neighbourCount({ x, y });
  if (!grid.value[y][x] && aliveNeighbours === 3) {
    grid.value[y][x] = true;
  }
  if (grid.value[y][x]) {
    if (aliveNeighbours < 2 || aliveNeighbours > 3) {
      grid.value[y][x] = false;
    }
  }
  commonKey.value++;
}

function random(max) {
  return Math.round(Math.random() * (max - 1) + 1);
}

function createGrid() {
  for (let i = 0; i <= lenY.value; i++) {
    const row = [];
    for (let j = 0; j <= lenX.value; j++) {
      row.push(false);
    }
    grid.value.push(row);
  }
}

const emit = defineEmits(['changeCount']);
watch(commonKey, () => {
  emit('changeCount', `Живых клеток: ${aliveCount()}`);
});

createGrid();

onMounted(() => {
  seed();
  setInterval(() => makeLife(), 100);
});
</script>
