<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <template v-slot:activator="{on}">
      <v-icon @click="dialog = true" color="orange" class="mr-4">edit</v-icon>
    </template>
    <v-card>
      <v-card-title class="headline">Edit Camper</v-card-title>
      <v-card-text v-if="loadingData" class="text-xs-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-card-text>
      <v-card-text v-else>
        <v-container grid-list-md>
          <v-text-field
            v-model="name"
            ref="name"
            label="Name"
            :placeholder="curName"
          ></v-text-field>
          <v-select
            v-model="cabin"
            ref="cabin"
            :items="cabins"
            item-text="cabin"
            item-value="cabin"
            label="Cabin"
            :placeholder="curCabin"
          ></v-select>
          <v-text-field
            v-model="amount"
            ref="amount"
            label="Amount"
            mask="####"
            :placeholder="curAmount"
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
      curName: '',
      curCabin: '',
      curAmount: '',
      name: '',
      cabin: '',
      amount: '',
    };
  },
  computed: {
    ...mapState(['campers', 'cabins']),
  },
  watch: {
    async dialog() {
      if (!this.done) {
        this.loadingData = true;
        const curCamper = await this.campers.find(el => el.id === this.id);
        this.curName = curCamper.name;
        this.curCabin = curCamper.cabin;
        this.curAmount = curCamper.amount;
        this.loadingData = false;
      } else {
        this.done = false;
      }
    },
  },
  methods: {
    validate() {
      if (this.name === '' || this.cabin === '' || this.amount === '') return {};
      const exists = this.campers.find(el => el.name === this.name, this);
      if (exists) return {};
      return Object.assign(
        {},
        this.name === '' ? undefined : { name: this.name },
        this.cabin === '' ? undefined : { cabin: this.cabin },
        this.amount === '' ? undefined : { amount: this.amount },
      );
    },
    async resolve(result) {
      const validated = this.validate();
      let res = null;
      if (result && Object.keys(validated).length > 0) {
        res = await Firebase.editCamper({ id: this.id, data: { ...validated } });
        if (res.message) {
          this.errorMsg = res.code;
          return;
        }
      }
      this.$emit('resolve', { result, id: this.camper, res });
      this.dialog = false;
      this.curId = '';
      this.curName = '';
      this.curCabin = '';
      this.curAmount = '';
      this.name = '';
      this.cabin = '';
      this.amount = '';
      this.loadingData = false;
      this.errorMsg = null;
      this.done = true;
    },
  },
};
</script>
