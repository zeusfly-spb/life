<template>
  <div id="container">
    <div class="stage" @click="activeLife = !activeLife">
      <v-stage :config="configKonva">
        <v-layer>
          <div v-for="(row, rowIndex) in grid" :key="'row' + rowIndex">
            <component
              :is="props.type"
              v-for="(field, fieldIndex) in row"
              :key="'field' + fieldIndex + commonKey"
              :config="{
                strokeWidth: 2,
                stroke: 'white',
                id: 'id-' + rowIndex + fieldIndex,
                y: y(rowIndex),
                x: x(fieldIndex),
                rotation: props.type === 'v-star' ? angle * 5 : 0,
                numPoints: 5,
                radius: cellSize,
                outerRadius: cellSize,
                innerRadius: Math.round(cellSize * 0.3),
                width: cellSize,
                height: cellSize,
                fill: field ? color() : 'white',
              }"
            />
          </div>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-shadow,no-plusplus,arrow-parens, no-unused-vars */
import { ref, computed, defineEmits, watch, onMounted, defineProps } from "vue";

const props = defineProps({
  multicolor: Boolean,
  type: { type: String, default: "v-rect" },
  active: { type: Boolean, required: true },
  unlimited: { type: Boolean, required: true },
});

const emit = defineEmits(["changeCount", "changeActive"]);

const areaSize = ref(500);
const commonKey = ref(0);
const cellSize = ref(20);
const grid = ref([]);
let angle = 0;

const activeLife = computed({
  get() {
    return props.active;
  },
  set(val) {
    emit("changeActive", val);
  },
});

const lenX = computed(() => Math.round(areaSize.value / cellSize.value));
const lenY = computed(() => Math.round(areaSize.value / cellSize.value));

function x(param) {
  let result = param * cellSize.value;
  if (["v-circle", "v-star"].includes(props.type)) {
    result += Math.round(cellSize.value / 2);
  }
  return result;
}

function y(param) {
  let result = param * cellSize.value;
  if (["v-circle", "v-star"].includes(props.type)) {
    result += Math.round(cellSize.value / 2);
  }
  return result;
}

const configKonva = computed(() => ({
  width: areaSize.value,
  height: areaSize.value,
}));

function color() {
  return props.multicolor ? randomColor() : "green";
}

function seed() {
  const alive = 200;
  for (let i = 0; i <= alive; i++) {
    const x = random(lenX.value);
    const y = random(lenY.value);
    grid.value[y][x] = true;
    commonKey.value++;
  }
}

function makeLife() {
  angle = angle === 36 ? 0 : angle + 1;
  for (let y = 0; y < lenY.value; y++) {
    for (let x = 0; x < lenX.value; x++) {
      prepareField({ x, y });
    }
  }
}

function unlimitedValue(x, y, letter) {
  let value = false;
  switch (letter) {
    case "a": {
      y = y === 0 ? lenY.value : y;
      x = x === 0 ? lenX.value : x;
      value = grid.value[y - 1][x - 1];
      break;
    }
    case "b": {
      y = y === 0 ? lenY.value : y;
      value = grid.value[y - 1][x];
      break;
    }
    case "c": {
      y = y === 0 ? lenY.value : y;
      x = x === lenX.value - 1 ? -1 : x;
      value = grid.value[y - 1][x + 1];
      break;
    }
    case "d": {
      x = x === 0 ? lenX.value : x;
      value = grid.value[y][x - 1];
      break;
    }
    case "e": {
      x = x === lenX.value - 1 ? -1 : x;
      value = grid.value[y][x + 1];
      break;
    }
    case "f": {
      y = y === lenY.value - 1 ? -1 : y;
      x = x === 0 ? lenX.value : x;
      value = grid.value[y + 1][x - 1];
      break;
    }
    case "g": {
      y = y === lenY.value - 1 ? -1 : y;
      value = grid.value[y + 1][x];
      break;
    }
    case "h": {
      y = y === lenY.value - 1 ? -1 : y;
      x = x === lenX.value - 1 ? -1 : x;
      value = grid.value[y + 1][x + 1];
      break;
    }
  }
  return props.unlimited && value;
}

function neighbourCount({ x, y }) {
  const all = [];
  all.push((x && y && grid.value[y - 1][x - 1]) || unlimitedValue(x, y, "a")); //A
  all.push((y && grid.value[y - 1][x]) || unlimitedValue(x, y, "b")); //B
  all.push(
    (y && x < lenX.value - 1 && grid.value[y - 1][x + 1]) ||
      unlimitedValue(x, y, "c")
  ); //C
  all.push((x && grid.value[y][x - 1]) || unlimitedValue(x, y, "d")); //D
  all.push(
    (x < lenX.value - 1 && grid.value[y][x + 1]) || unlimitedValue(x, y, "e")
  ); //E
  all.push(
    (x && y < lenY.value - 1 && grid.value[y + 1][x - 1]) ||
      unlimitedValue(x, y, "f")
  ); //F
  all.push(
    (y < lenY.value - 1 && grid.value[y + 1][x]) || unlimitedValue(x, y, "g")
  ); //G
  all.push(
    (y < lenY.value - 1 && x < lenX.value - 1 && grid.value[y + 1][x + 1]) ||
      unlimitedValue(x, y, "h")
  ); //H
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
  return Math.round(Math.random() * (max - 1));
}

function randomColor() {
  return (
    "#" +
    random(255).toString(16) +
    random(255).toString(16) +
    random(255).toString(16)
  );
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

watch(commonKey, () => {
  emit("changeCount", `Живых клеток: ${aliveCount()}`);
});

createGrid();

onMounted(() => {
  seed();
  setInterval(() => (activeLife.value ? makeLife() : null), 100);
});
</script>

<style>
#container {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.stage {
  max-height: 100%;
}
</style>
