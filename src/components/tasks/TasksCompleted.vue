<template>
  <div class="q-mt-lg">
    <list-header bgColor="bg-green-4">Completed</list-header>
    <q-list separator bordered>
      <task
        v-for="(task, key) in tasksCompleted"
        :id="key"
        :key="key"
        :task="task"
      ></task>
    </q-list>
  </div>
</template>

<script>
export default {
  props: ["tasksCompleted"],
  components: {
    task: require("./Task").default,
    "list-header": require("./Shared/ListHeader").default
  }
};
</script>

<style></style>
