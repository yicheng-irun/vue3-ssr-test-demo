<template>
  <div id="nav">
    <template v-for="(item, index) in routers" :key="index">
      <span>
        <router-link :to="item">[{{ item }}]</router-link>
        <span> | </span>
      </span>
    </template>
  </div>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  mounted() {
    console.log(this.$router.getRoutes());
  },
  computed: {
    routers(): string[] {
      return this.$router.getRoutes().map((item) => {
        return item.path;
      });
    },
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
