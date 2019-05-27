<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <template v-slot:activator="{on}">
      <v-icon @click="dialog = true" color="orange" class="mr-4">edit</v-icon>
    </template>
    <v-card>
      <v-card-title class="headline">Edit Camper</v-card-title>
      <v-card-text>
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
        </v-container>
      </v-card-text>
      <v-card-actions>
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
      curId: null,
      curName: null,
      curCabin: null,
      curAmount: null,
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
        await this.$store.dispatch('getCampers');
        await this.$store.dispatch('getCabins');
        const curCamper = await this.campers.find(el => el.id === this.id);
        this.curName = curCamper.name;
        this.curCabin = curCamper.cabin;
        this.curAmount = curCamper.amount;
      }
    },
  },
  methods: {
    validate() {
      const exists = this.campers.find(el => el.name === this.name, this);
      if (exists) return;
      const result = {};
      Object.assign(
        result,
        this.name && { name: this.name },
        this.cabin && { cabin: this.cabin },
        this.amount && { amount: this.amount },
      );
      return result;
    },
    async resolve(result) {
      if (result && this.validate()) {
        await Firebase.editCamper({ name: this.name, cabin: this.cabin, amount: this.amount });
      }
      this.$emit('resolve', { result, index: this.camper });
      this.dialog = false;
      this.curId = null;
      this.curName = null;
      this.curCabin = null;
      this.curAmount = null;
      this.name = '';
      this.cabin = '';
      this.amount = '';
      this.done = true;
    },
  },
};
</script>
