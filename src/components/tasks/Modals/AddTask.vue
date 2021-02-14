<template>
  <q-card>
    <modal-header>Add Task</modal-header>

    <q-form @submit.prevent="onSubmit" @reset="onReset">
      <q-card-section class="q-pt-none">
        <modal-task-name :name.sync="taskToSubmit.name"></modal-task-name>
        <modal-due-date :dueDate.sync="taskToSubmit.dueDate"></modal-due-date>
        <modal-due-time
          v-if="taskToSubmit.dueDate"
          :dueTime.sync="taskToSubmit.dueTime"
        ></modal-due-time>
      </q-card-section>

      <modal-buttons :buttonName="(buttonName = 'save')"></modal-buttons>
    </q-form>
  </q-card>
</template>

<script>
import { mapActions } from "vuex";
import mixinAddEditTask from "../../../mixins/mixin-add-edit-task";

export default {
  mixins: [mixinAddEditTask],
  data() {
    return {
      taskToSubmit: {
        name: "",
        dueDate: "",
        dueTime: "",
        completed: false
      }
    };
  },
  methods: {
    ...mapActions("tasks", ["addTask"]),
    onSubmit() {
      this.submitTask();
    },
    submitTask() {
      this.addTask(this.taskToSubmit);
      this.$emit("close");
    },
    onReset() {
      this.taskToSubmit = {
        name: "",
        dueDate: "",
        dueTime: "",
        completed: false
      };
    }
  }
};
</script>

<style></style>
