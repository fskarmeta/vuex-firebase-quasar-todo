<template>
  <div class="row q-mb-sm">
    <q-input
      outlined
      :value="name"
      @input="$emit('update:name', $event)"
      label="Task name"
      class="col"
      :rules="[val => !!val || 'Field is required']"
      ref="name"
      autofocus
      clearable
      v-select-all
    />
  </div>
</template>

<script>
import { selectAll } from "../../../../directives/directive-select-all";
export default {
  props: ["name"],
  directives: {
    selectAll
  }
};
</script>

<style></style>
