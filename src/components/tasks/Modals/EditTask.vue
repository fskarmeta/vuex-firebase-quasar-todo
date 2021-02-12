<template>
  <q-card>
    <modal-header>Edit Task</modal-header>

    <q-form @submit.prevent="onSubmit" @reset="onReset">
      <q-card-section class="q-pt-none">
        <modal-task-name :name.sync="taskToSubmit.name"></modal-task-name>
        <modal-due-date :dueDate.sync="taskToSubmit.dueDate"></modal-due-date>
        <modal-due-time
          v-if="taskToSubmit.dueDate"
          :dueTime.sync="taskToSubmit.dueTime"
        ></modal-due-time>
      </q-card-section>

      <modal-buttons :buttonName="(buttonName = 'update')"></modal-buttons>
    </q-form>
  </q-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: ["task", "id"],
  data() {
    return {
      taskToSubmit: {}
    };
  },
  methods: {
    ...mapActions("tasks", ["updateTask"]),
    onSubmit() {
      this.submitTask();
    },
    submitTask() {
      this.updateTask({
        id: this.id,
        updates: this.taskToSubmit
      });
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
  },
  components: {
    "modal-header": require("../Modals/Shared/ModalHeader").default,
    "modal-task-name": require("../Modals/Shared/ModalTaskName").default,
    "modal-due-date": require("../Modals/Shared/ModalDueDate").default,
    "modal-due-time": require("../Modals/Shared/ModalDueTime").default,
    "modal-buttons": require("../Modals/Shared/ModalButtons").default
  },
  mounted() {
    this.taskToSubmit = { ...this.task };
  }
};
</script>

<style></style>
