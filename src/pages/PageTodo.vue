<template>
  <q-page class="q-pa-md">
    <div class="row q-mb-lg">
      <search />
      <sort />
    </div>
    <p
      v-if="
        search &&
          !Object.keys(tasksTodo).length &&
          !Object.keys(tasksCompleted).length
      "
    >
      No search results.
    </p>
    <no-tasks v-if="!Object.keys(tasksTodo).length && !search"></no-tasks>
    <tasks-todo v-if="Object.keys(tasksTodo).length" :tasksTodo="tasksTodo" />

    <tasks-completed
      v-if="Object.keys(tasksCompleted).length"
      :tasksCompleted="tasksCompleted"
    />
    <div class="absolute-bottom text-center q-mb-lg">
      <q-btn
        round
        dense
        color="primary"
        size="24px"
        icon="add"
        @click="showAddTask = true"
      />
    </div>

    <q-dialog v-model="showAddTask">
      <add-task @close="showAddTask = false" />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  computed: {
    ...mapGetters("tasks", ["tasksTodo", "tasksCompleted"]),
    ...mapState("tasks", ["search"])
  },
  components: {
    "add-task": require("../components/tasks/Modals/AddTask").default,
    "tasks-todo": require("../components/tasks/TasksTodo").default,
    "tasks-completed": require("../components/tasks/TasksCompleted").default,
    "no-tasks": require("../components/tasks/NoTasks").default,
    search: require("../components/tasks/Tools/Search.vue").default,
    sort: require("../components/tasks/Tools/Sort.vue").default
  },
  data() {
    return {
      showAddTask: false
    };
  },
  mounted() {
    this.$root.$on("showAddTask", () => {
      this.showAddTask = true;
    });
  }
};
</script>

<style lang="scss" scoped></style>
