<template>
  <q-card>
    <q-card-section class="row">
      <div class="text-h6">Add Task</div>
      <q-space />
      <q-btn dense flat round icon="close" v-close-popup />
    </q-card-section>

    <q-form @submit.prevent="onSubmit" @reset="onReset">
      <q-card-section class="q-pt-none">
        <div class="row q-mb-sm">
          <q-input
            outlined
            v-model="taskToSubmit.name"
            label="Task name"
            class="col"
            :rules="[val => !!val || 'Field is required']"
            ref="name"
            autofocus
            clearable
          />
        </div>

        <div class="row q-mb-sm">
          <q-input
            outlined
            v-model="taskToSubmit.dueDate"
            label="Due date"
            clearable
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="taskToSubmit.dueDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="row q-mb-sm" v-if="taskToSubmit.dueDate">
          <q-input
            outlined
            v-model="taskToSubmit.dueTime"
            label="Due time"
            clearable
            class="col"
          >
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="taskToSubmit.dueTime">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="RESET" type="reset" color="primary" class="q-ml-sm" />
        <q-btn label="SAVE" type="submit" color="primary" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { mapActions } from "vuex";
export default {
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
