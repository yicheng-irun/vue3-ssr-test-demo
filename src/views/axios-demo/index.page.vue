<template>
  <h1>axios demo 页</h1>
  <div>接口请求值: {{ result }}</div>
</template>

<script lang="ts">
import { AxiosInstance } from "axios";
import { ref, getCurrentInstance, defineComponent } from "vue";

export default defineComponent({
  async setup() {
    const result = ref("");

    const ctx = getCurrentInstance();

    if (ctx) {
      const axiosInstance = ctx.appContext.config.globalProperties
        .$axios as AxiosInstance;
      const rsp = await axiosInstance.get<{
        success: boolean;
        data: string;
      }>("/api/hello");
      console.log(rsp.data);
      result.value = rsp.data.data;
    }

    return {
      result,
    };
  },
});

// export default defineComponent({

//   mounted() {
//     this.request();
//   },
//   methods: {
//     async request() {
//       const rsp = await this.$axios.get("/api/hello");
//       console.log(rsp.data);
//     },
//   },
// });
</script>
