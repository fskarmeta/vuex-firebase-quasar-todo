import Vue from "vue";
import { uid } from "quasar";
import { firebaseDb, firebaseAuth } from "../boot/firebase";

const state = {
  tasks: {
    // ID1: {
    //   name: "Go to shop",
    //   completed: false,
    //   dueDate: "2019/01/11",
    //   dueTime: "20:37"
    // },
    // ID2: {
    //   name: "Get bananas",
    //   completed: false,
    //   dueDate: "2019/05/12",
    //   dueTime: "18:30"
    // },
    // ID3: {
    //   name: "Get apples",
    //   completed: false,
    //   dueDate: "2019/08/11",
    //   dueTime: "13:22"
    // }
  },
  search: "",
  sort: "dueDate"
};

const mutations = {
  updateTask(state, payload) {
    state.tasks[payload.id] = {
      ...state.tasks[payload.id],
      ...payload.updates
    };
  },
  deleteTask(state, id) {
    Vue.delete(state.tasks, id);
  },
  addTask(state, payload) {
    Vue.set(state.tasks, payload.id, payload.task);
  },
  setSearch(state, value) {
    state.search = value;
  },
  setSort(state, value) {
    state.sort = value;
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
  },
  setSearch({ commit }, value) {
    commit("setSearch", value);
  },
  setSort({ commit }, value) {
    commit("setSort", value);
  },
  fbReadData({ commit }) {
    console.log("start reading data from firebase");
    let userId = firebaseAuth.currentUser.uid;
    let userTasks = firebaseDb.ref("tasks/" + userId);

    // child added
    userTasks.on("child_added", snapshot => {
      let task = snapshot.val();

      let payload = {
        id: snapshot.key,
        task: task
      };

      commit("addTask", payload);
    });

    // chiild changed

    userTasks.on("child_changed", snapshot => {
      let task = snapshot.val();

      let payload = {
        id: snapshot.key,
        updates: task
      };

      commit("updateTask", payload);
    });

    //child removed
    userTasks.on("child_removed", snapshot => {
      let task = snapshot.val();
      commit("deleteTask", snapshot.key);
    });
  }
};

const getters = {
  tasksSorted: state => {
    let tasksSorted = {};
    let keysOrdered = Object.keys(state.tasks);

    keysOrdered
      .sort((a, b) => {
        let taskAProp = state.tasks[a][state.sort].toLowerCase();
        let taskBProp = state.tasks[b][state.sort].toLowerCase();
        if (taskAProp > taskBProp) {
          return 1;
        } else if (taskAProp < taskBProp) {
          return -1;
        } else {
          return 0;
        }
      })
      .forEach(key => (tasksSorted[key] = state.tasks[key]));
    return tasksSorted;
  },
  tasksFiltered: (state, getters) => {
    let tasksSorted = getters.tasksSorted;
    let tasksFiltered = {};
    if (state.search) {
      Object.keys(tasksSorted).forEach(function(key) {
        let task = tasksSorted[key];
        if (task.name.toLowerCase().includes(state.search.toLowerCase())) {
          tasksFiltered[key] = task;
        }
      });
      return tasksFiltered;
    }
    return tasksSorted;
  },
  tasksTodo: (state, getters) => {
    let tasksFiltered = getters.tasksFiltered;
    let tasks = {};
    Object.keys(tasksFiltered).forEach(function(key) {
      let task = tasksFiltered[key];
      if (!task.completed) {
        tasks[key] = task;
      }
    });
    return tasks;
  },
  tasksCompleted: (state, getters) => {
    let tasksFiltered = getters.tasksFiltered;
    let tasks = {};
    Object.keys(tasksFiltered).forEach(function(key) {
      let task = tasksFiltered[key];
      if (task.completed) {
        tasks[key] = task;
      }
    });
    return tasks;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
