<template>
    <v-stage
      :config="configKonva"
    >
       <v-layer>
        <div
          v-for="(row, rowIndex) in grid"
          :key="'row' + rowIndex"
        >
          <v-rect
            v-for="(field, fieldIndex) in row"
            :key="'field' + fieldIndex + commonKey"
            :config="{
              ...rectConfig,
              y: rowIndex * cellSize,
              x: fieldIndex * cellSize,
              width: cellSize,
              height: cellSize,
              fill: field ? 'grey' : 'white',
            }"
          />
          </div>
      </v-layer>
    </v-stage>
</template>

<script>
export default {
  name: 'BaseLayout',
  data: () => ({
    commonKey: 0,
    grid: [],
    cellSize: 20,
    rectConfig: {
      stroke: 'white',
      strokeWidth: 4,
    },
    textConfig: {
        x: 15,
        y: 15,
        fontSize: 14,
        fontFamily: 'Arial',
        fill: 'green',
    },
    titleText: '',
  }),
  computed: {
    configKonva() {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    },
    lenX() {
      return window.innerWidth / this.cellSize;
    },
    lenY() {
      return window.innerHeight / this.cellSize;
    },
  },
  created() {
    this.createGrid();
  },
  mounted() {
    setInterval(() => this.action(), 1000);
  },
  methods: {
    aliveCount() {
      let count = 0;
      for (let i = 0; i < this.lenY; i++) {
        const rowCount = this.grid[i].filter(item => !!item).length;
        count = count + rowCount;
      }
      return count;
    },
    random(max) {
      return Math.round(Math.random() * (max - 1) + 1);
    },
    action() {
      const aliveCount = 30;
      for(let i = 0; i < aliveCount; i++) {
        const x = this.random(this.lenX);
        const y = this.random(this.lenY);
        this.grid[y][x] = true;
        this.commonKey++;
      }
    },
    createGrid() {
      for (let i = 0; i < this.lenY; i++) {
        const row = [];
        for (let j = 0; j < this.lenX; j++) {
          row.push(false);
        }
        this.grid.push(row);
      }
    },
  },
  watch: {
    commonKey() {
      this.$emit('changeCount', 'Живых клеток: ' + this.aliveCount())
    },
  },
}
</script>
