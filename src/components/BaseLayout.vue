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
    lastAliveCount: 0,
  }),
  computed: {
    configKonva() {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    },
    lenX() {
      return Math.round(window.innerWidth / this.cellSize);
    },
    lenY() {
      return Math.round(window.innerHeight / this.cellSize);
    },
  },
  created() {
    this.createGrid();
  },
  mounted() {
    this.seed();
    setInterval(() => this.makeLife(), 200);
  },
  methods: {
    makeLife() {
      for (let y = 0; y <= this.lenY; y++) {
        for (let x = 0; x <= this.lenX; x++) {
          this.prepareField({x, y});
        }
      }
      if (this.lastAliveCount === this.aliveCount()) {
        this.seed();
      } else {
        this.lastAliveCount = this.aliveCount();
      }
    },
    prepareField({x, y}) {
      const neighbourFields = [];
      if (x > 0) {//ADF
        if (y > 0) {
          neighbourFields.push(this.grid[y - 1][x -1]);
        }
        neighbourFields.push(this.grid[y][x - 1]);
        if (y < this.lenY) {
          neighbourFields.push(this.grid[y + 1][x -1]);
        }
      }
      if (x < this.lenX) {//CEH
        if (y > 0) {
          neighbourFields.push(this.grid[y - 1][x + 1]);
        }
        neighbourFields.push(this.grid[y][x + 1]);
        if (y < this.lenY) {
          neighbourFields.push(this.grid[y + 1][x + 1]);
        }
      }
      if (y > 0) {//B
        neighbourFields.push(this.grid[y - 1][x]);
      }
      if (y < this.lenY) {//G
          neighbourFields.push(this.grid[y + 1][x]);
      }
      const aliveNeighbours = neighbourFields.filter(item => !!item);
      console.log('Живых соседей: ' + aliveNeighbours.length);

      if (!this.grid[y][x] && aliveNeighbours === 3) {
          this.grid[y][x] = true;
          console.log(`Возрождаем клетку (${x},${y})`)
      }
      if (this.grid[y][x]) {
        if (aliveNeighbours < 2 || aliveNeighbours > 3) {
          this.grid[y][x] = false;
        }
          console.log(`Убиваем клетку (${x},${y})`)
      }
      this.commonKey++;
    },
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
    seed() {
      const aliveCount = 300;
      for(let i = 0; i <= aliveCount; i++) {
        const x = this.random(this.lenX);
        const y = this.random(this.lenY);
        this.grid[y][x] = true;
        this.commonKey++;
      }
    },
    createGrid() {
      for (let i = 0; i <= this.lenY; i++) {
        const row = [];
        for (let j = 0; j <= this.lenX; j++) {
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
