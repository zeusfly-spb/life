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
            fill: field ? 'grey' : '#fff9c4',
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
        width: 600,
        height: 600,
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
    return this.createGrid();
  },
  mounted() {
    this.seed();
      // eslint-disable-next-line vue/no-async-in-computed-properties
    // return setInterval(() => this.makeLife(), 170);

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
      // return this.$refs[`x${x}y${y}`];
      // return this.prepareField(({x, y}));
      return this.prepareField({x: x, y: y});
    },
    switchField({x, y}) {
      this.grid[y][x] = !this.grid[y][x];
      this.commonKey++;
    },
    prepareField({x, y}) {
      console.log('Начинаем процедуры')
      const neighbourFields = [];
      if (x > 0) {//ADF
        if (y > 0) {
          neighbourFields.push(this.grid[y - 1][x - 1]);
        }
        neighbourFields.push(this.grid[y][x - 1]);
        if (y < this.lenY) {
          neighbourFields.push(this.grid[y + 1][x - 1]);
        }
      }
      if(x < this.lenX) {//CEH
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
      // console.log('Живых соседей: ' + aliveNeighbours.length);
      if (!this.grid[y][x] && aliveNeighbours === 3) {
        this.grid[y][x] = true;
        console.log(`Возрождаем клетку (${x},${y})`)
      }
      if (this.grid[y][x]) {
        if (aliveNeighbours < 2 || aliveNeighbours > 3) {
          this.grid[y][x] = false;
          console.log(`Убиваем клетку (${x},${y}), по причине ${aliveNeighbours < 2 ? 'Одиночества' : 'Перенаселения'} `)
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
