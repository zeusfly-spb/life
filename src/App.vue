<template>
  <div id="app">
      <vue-headful
        :title="titleText"
        description="LIFE"
      />
    <BaseLayout
      @changeCount="updateTitle"
    />
  </div>
</template>

<script>
import BaseLayout from "@/components/BaseLayout.vue";
export default {
  name: 'App',
  components: {
    BaseLayout
  },
  data: () => ({
    titleText: '',
  }),
  methods: {
    updateTitle(text) {
      this.titleText = text;
    }
  }
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
