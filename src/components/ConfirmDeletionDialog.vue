<template>
  <!-- <v-layout row justify-center> -->
    <v-dialog v-model="dialog" persistent max-width="290">
      <template v-slot:activator="{on}">
        <v-icon @click="dialog = true" color="error">delete</v-icon>
      </template>
      <v-card>
        <v-card-title class="headline">Confirm Deletion?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="resolve(false)">Cancel</v-btn>
          <v-btn color="green darken-1" flat @click="resolve(true)">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  <!-- </v-layout> -->
</template>

<script>
export default {
  props: { id: String },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    resolve(result) {
      this.$emit('resolve', { result, id: this.id });
      this.dialog = false;
    },
  },
};
</script>
