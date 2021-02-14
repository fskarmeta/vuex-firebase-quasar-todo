<template>
  <q-page>
    <div class="q-pa-md absolute full-width full-height column">
      <template v-if="tasksDownloaded">
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
        <q-scroll-area class="q-scroll-area-tasks">
          <no-tasks
            v-if="
              !Object.keys(tasksTodo).length &&
                !search &&
                !settings.showTasksInOneList
            "
          ></no-tasks>
          <tasks-todo
            v-if="Object.keys(tasksTodo).length"
            :tasksTodo="tasksTodo"
          />
          <tasks-completed
            v-if="Object.keys(tasksCompleted).length"
            :tasksCompleted="tasksCompleted"
            class="q-mb-xl"
          />
        </q-scroll-area>
        <div class="absolute-bottom text-center q-mb-lg no-pointer-events">
          <q-btn
            class="all-pointer-events"
            round
            dense
            color="primary"
            size="24px"
            icon="add"
            @click="showAddTask = true"
          />
        </div>
      </template>
      <template v-else>
        <span class="absolute-center">
          <q-spinner color="primary" size="3em" />
        </span>
      </template>
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
    ...mapGetters("settings", ["settings"]),
    ...mapState("tasks", ["search", "tasksDownloaded"])
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

<style lang="scss" scoped>
.q-scroll-area-tasks {
  display: flex;
  flex-grow: 1;
}
</style>
