import Vue from "vue";
import Vuex from "vuex";
import tasks from "./store-tasks";
import settings from "./store-settings";
import auth from "./store-auth";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    tasks,
    settings,
    auth
  }
});
