<template>
  <div>no-ssr测试页</div>
  <no-ssr>
    <childCompVue></childCompVue>
  </no-ssr>
</template>

<script setup lang="ts">
import noSsr from "../../components/no-ssr.vue";
import childCompVue from "./child-comp.vue";
</script>
