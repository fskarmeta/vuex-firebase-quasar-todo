import Vue from "vue";
import { uid } from "quasar";

const state = {
  tasks: {
    // ID1: {
    //   name: "Go to shop",
    //   completed: false,
    //   dueDate: "2019/01/11",
    //   dueTime: "20.37"
    // },
    // ID2: {
    //   name: "Get bananas",
    //   completed: false,
    //   dueDate: "2019/05/12",
    //   dueTime: "18.30"
    // },
    // ID3: {
    //   name: "Get apples",
    //   completed: false,
    //   dueDate: "2019/08/11",
    //   dueTime: "13.22"
    // }
  }
};

const mutations = {
  updateTask(state, payload) {
    state.tasks[payload.id] = {
      ...state.tasks[payload.id],
      ...payload.updates
    };
  },
  deleteTask(state, id) {
    console.log(id);
    Vue.delete(state.tasks, id);
  },
  addTask(state, payload) {
    Vue.set(state.tasks, payload.id, payload.task);
  }
};

const actions = {
  updateTask({ commit }, payload) {
    commit("updateTask", payload);
  },
  deleteTask({ commit }, id) {
    commit("deleteTask", id);
  },
  addTask({ commit }, task) {
    let taskId = uid();
    let payload = {
      id: taskId,
      task: task
    };

    commit("addTask", payload);
  }
};

const getters = {
  tasks: state => {
    return state.tasks;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
