import { createStore, Store } from "vuex";

export interface StateType {
  fetchDemoValue: {
    value: string;
  };
}

export function createPageStore(): Store<StateType> {
  return createStore<StateType>({
    state: {
      fetchDemoValue: {
        value: "",
      },
    },
    mutations: {},
    actions: {
      async fetchDemoTest({ state }) {
        const rsp = await this.$axios.get<{
          success: boolean;
          data: string;
        }>("/api/hello");
        state.fetchDemoValue.value = rsp.data.data;
      },
    },
    modules: {},
  });
}
