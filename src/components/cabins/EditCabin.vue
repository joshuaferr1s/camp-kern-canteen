<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <template v-slot:activator="{on}">
      <v-icon @click="dialog = true" color="orange" class="mr-4">edit</v-icon>
    </template>
    <v-card>
      <v-card-title class="headline">Edit Cabin</v-card-title>
      <v-card-text v-if="loadingData" class="text-xs-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-card-text>
      <v-card-text v-else>
        <v-container grid-list-md>
          <v-text-field
            v-model="cabin"
            ref="cabin"
            label="Cabin"
            :placeholder="curCabin"
          ></v-text-field>
          <p class="red--text" v-if="errorMsg">Error Code: {{ errorMsg }}</p>
        </v-container>
      </v-card-text>
      <v-card-actions v-if="!loadingData">
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" flat @click="resolve(false)">Cancel</v-btn>
        <v-btn color="green darken-1" flat @click="resolve(true)">Update</v-btn>
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
      done: false,
      errorMsg: null,
      loadingData: true,
      curCabin: '',
      cabin: '',
    };
  },
  computed: {
    ...mapState(['cabins']),
  },
  watch: {
    async dialog() {
      if (!this.done) {
        this.loadingData = true;
        this.curCabin = await this.cabins.find(el => el.id === this.id).cabin;
        this.loadingData = false;
      } else {
        this.done = false;
      }
    },
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
      let res = null;
      if (result && Object.keys(validated).length > 0) {
        res = await Firebase.editCabin({ id: this.id, data: { ...validated } });
        if (res.message) {
          this.errorMsg = res.code;
          return;
        }
      } else if (result && Object.keys(validated).length === 0) return;
      this.$emit('resolve', { result, id: this.id, res });
      this.dialog = false;
      this.curCabin = '';
      this.cabin = '';
      this.loadingData = true;
      this.errorMsg = null;
      this.done = true;
    },
  },
};
</script>
