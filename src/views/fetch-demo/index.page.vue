<template>
  <h2>结果：{{ state.fetchDemoValue.value }}</h2>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { StateType } from "../../store";

export default defineComponent({
  async fetch({ store }) {
    await store.dispatch("fetchDemoTest");
  },
  setup() {
    const state = computed(() => {
      return useStore<StateType>().state;
    });

    return {
      state,
    };
  },
  mounted() {
    console.log(this.state);
  },
});
</script>
