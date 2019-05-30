<template>
  <v-alert
    v-model="dialog"
    dismissible
    type="error"
  >
    {{ errorMsg }}
  </v-alert>
</template>

<script>
export default {
  props: ['errorMsg'],
  data() {
    return {
      dialog: false,
    };
  },
  watch: {
    errorMsg() {
      if (this.errorMsg !== null) this.dialog = true;
      else this.dialog = false;
    },
  },
};
</script>
