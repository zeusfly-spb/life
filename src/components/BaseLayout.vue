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
          @click="touchCell({x: fieldIndex, y: rowIndex})"
          :ref="`x${fieldIndex}y${rowIndex}`"
          v-for="(field, fieldIndex) in row"
          :key="'field' + fieldIndex + commonKey"
          :config="{
            ...rectConfig,
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

<script>
export default {
  name: 'BaseLayout',
  data: () => ({
    areaSize: 600,
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
        width: this.areaSize,
        height: this.areaSize,
      }
    },
    lenX() {
      return Math.round(this.areaSize / this.cellSize);
    },
    lenY() {
      return Math.round(this.areaSize / this.cellSize);
    },
  },
  created() {
    return this.createGrid();
  },
  mounted() {
    this.seed();
      // eslint-disable-next-line vue/no-async-in-computed-properties
    return setInterval(() => this.makeLife(), 170);

  },
  methods: {
    makeLife() {
      for (let y = 0; y <= this.lenY; y++) {
        for (let x = 0; x <= this.lenX; x++) {
          this.prepareField({x, y});
        }
      }
    },
    touchCell({x, y}) {

      return this.prepareField({x: x, y: y});
    },
    switchField({x, y}) {
      this.grid[y][x] = !this.grid[y][x];
      this.commonKey++;
    },
    neighbourCount({x, y}) {
      const all = [];
      all.push(x && y ? this.grid[y-1][x-1] : false); //A
      all.push(y ? this.grid[y-1][x] : false); //B
      all.push(y && x < this.lenX ? this.grid[y-1][x+1] : false); //C
      all.push(x ? this.grid[y][x-1] : false); //D
      all.push(x < this.lenX ? this.grid[y][x+1] : false); //E
      all.push(x && y < this.lenY ? this.grid[y+1][x-1] : false); //F
      all.push(y < this.lenY ? this.grid[y+1][x] : false); //G
      all.push(y < this.lenY && x < this.lenX ? this.grid[y+1][x+1] : false); //H
      return all.filter(item => !!item).length;
    },
    prepareField({x, y}) {
      const aliveNeighbours = this.neighbourCount({x,y});
      if (!this.grid[y][x] && aliveNeighbours === 3) {
        this.grid[y][x] = true;
      }
      if (this.grid[y][x]) {
        if (aliveNeighbours < 2 || aliveNeighbours > 3) {
          this.grid[y][x] = false;
        }
      }
      this.commonKey++;
    },
    aliveCount() {
      let count = 0;
      for (let y = 0; y <= this.lenY; y++) {
        const rowCount = this.grid[y].filter(item => !!item).length;
        count += rowCount;
      }
      return count;
    },
    random(max) {
        return Math.round(Math.random() * (max - 1) + 1);
    },
    seed() {
      const aliveCount = 300;
      for (let i = 0; i <= aliveCount; i++) {
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
        return this.grid;
      },
  },
  watch: {
    commonKey() {
      this.$emit('changeCount', 'Живых клеток: ' + this.aliveCount())
    },
  },
}
</script>
