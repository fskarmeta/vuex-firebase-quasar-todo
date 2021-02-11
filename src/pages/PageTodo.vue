<template>
  <q-page class="q-pa-md">
    <q-list separator bordered v-if="Object.keys(tasks).length">
      <task
        v-for="(task, key) in tasks"
        :id="key"
        :key="key"
        :task="task"
      ></task>
    </q-list>
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
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("tasks", ["tasks"])
  },
  components: {
    task: require("../components/tasks/Task").default,
    "add-task": require("../components/tasks/Modals/AddTask").default
  },
  data() {
    return {
      showAddTask: false
    };
  }
};
</script>

<style lang="scss" scoped></style>
