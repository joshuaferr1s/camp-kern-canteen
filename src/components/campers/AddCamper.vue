<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <template v-slot:activator="{on}">
      <v-btn color="pink" dark @click="dialog = true">
        Add a Camper
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">New Camper</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="name"
          ref="name"
          label="Camper Name"
        ></v-text-field>
        <v-select
          v-model="cabin"
          ref="cabin"
          :items="cabins"
          item-text="cabin"
          item-value="cabin"
          label="Cabin"
        ></v-select>
        <v-text-field
          v-model="amount"
          ref="amount"
          label="Amount"
          mask="####"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" flat @click="resolve(false)">Cancel</v-btn>
        <v-btn color="green darken-1" flat @click="resolve(true)">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import Firebase from '../../firebase';

export default {
  props: { id: String },
  data() {
    return {
      dialog: false,
      name: '',
      cabin: '',
      amount: null,
    };
  },
  computed: {
    ...mapState(['cabins']),
  },
  methods: {
    async resolve(result) {
      if (result) {
        await Firebase.addCamper({ name: this.name, cabin: this.cabin, amount: this.amount });
      }
      this.name = '';
      this.cabin = '';
      this.amount = null;
      this.dialog = false;
    },
  },
};
</script>
