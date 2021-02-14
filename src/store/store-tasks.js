import Vue from "vue";
import { uid, Notify } from "quasar";
import { firebaseDb, firebaseAuth } from "../boot/firebase";
import { showErrorMessage } from "src/functions/function-show-error-message";

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
  sort: "dueDate",
  tasksDownloaded: false
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
  },
  setTasksDownloaded(state, value) {
    state.tasksDownloaded = value;
  },
  clearTasks(state) {
    state.tasks = {};
  }
};

const actions = {
  updateTask({ dispatch }, payload) {
    dispatch("fbUpdateTask", payload);
  },
  deleteTask({ dispatch }, id) {
    dispatch("fbDeleteTask", id);
  },
  addTask({ dispatch }, task) {
    let taskId = uid();
    let payload = {
      id: taskId,
      task: task
    };
    dispatch("fbAddTask", payload);
  },
  setSearch({ commit }, value) {
    commit("setSearch", value);
  },
  setSort({ commit }, value) {
    commit("setSort", value);
  },
  fbReadData({ commit }) {
    let userId = firebaseAuth.currentUser.uid;
    let userTasks = firebaseDb.ref("tasks/" + userId);

    // initial check for data
    userTasks.once(
      "value",
      snapshot => {
        commit("setTasksDownloaded", true);
      },
      error => {
        if (error) {
          showErrorMessage(error.message);
          this.$router.replace("/auth");
        }
      }
    );

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
  },
  fbAddTask({}, payload) {
    let userId = firebaseAuth.currentUser.uid;
    let taskRef = firebaseDb.ref("tasks/" + userId + "/" + payload.id);
    taskRef.set(payload.task, error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Task has been added !");
      }
    });
  },
  fbUpdateTask({}, payload) {
    let userId = firebaseAuth.currentUser.uid;
    let taskRef = firebaseDb.ref("tasks/" + userId + "/" + payload.id);
    taskRef.update(payload.updates, error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        let keys = Object.keys(payload.updates);
        if (!(keys.includes("completed") && keys.length == 1)) {
          Notify.create("Task has been updated !");
        }
      }
    });
  },
  fbDeleteTask({}, taskId) {
    let userId = firebaseAuth.currentUser.uid;
    let taskRef = firebaseDb.ref("tasks/" + userId + "/" + taskId);
    taskRef.remove(error => {
      if (error) {
        showErrorMessage(error.message);
      } else {
        Notify.create("Task has been deleted !");
      }
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
