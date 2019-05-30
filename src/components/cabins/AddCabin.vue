<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <template v-slot:activator="{on}">
      <v-btn color="pink" dark @click="dialog = true">
        Add a Cabin
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">New Cabin</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="cabin"
          ref="cabin"
          label="Cabin"
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
      cabin: '',
    };
  },
  computed: {
    ...mapState(['cabins']),
  },
  methods: {
    validate() {
      const exists = this.cabins.find(el => el.cabin === this.cabin, this);
      if (exists) return {};
      return Object.assign(
        {},
        this.cabin === '' ? undefined : { cabin: this.cabin },
      );
    },
    async resolve(result) {
      const validated = this.validate();
      if (result && Object.keys(validated).length > 0) {
        await Firebase.addCabin({ cabin: this.cabin });
        this.$store.dispatch('getCabins');
      } else if (result && Object.keys(validated).length === 0) return;
      this.cabin = '';
      this.dialog = false;
    },
  },
};
</script>
