<template>
  <q-card-actions align="right">
    <q-btn label="RESET" type="reset" color="primary" class="q-ml-sm" />
    <q-btn :label="buttonName" type="submit" color="primary" />
  </q-card-actions>
</template>

<script>
export default {
  props: ["buttonName"]
};
</script>

<style></style>
