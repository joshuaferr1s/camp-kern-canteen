<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <template v-slot:activator="{on}">
      <v-icon @click="dialog = true" color="orange" class="mr-4">edit</v-icon>
    </template>
    <v-card>
      <v-card-title class="headline">Edit Product</v-card-title>
      <v-card-text v-if="loadingData" class="text-xs-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-card-text>
      <v-card-text v-else>
        <v-container grid-list-md>
          <v-text-field
            v-model="product"
            ref="product"
            label="Product"
            :placeholder="curProduct.product"
          ></v-text-field>
          <v-text-field
            v-model="price"
            ref="price"
            label="Price"
            :placeholder="curProduct.price"
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
      curProduct: {},
      product: '',
      price: '',
    };
  },
  computed: {
    ...mapState(['products']),
  },
  watch: {
    async dialog() {
      if (!this.done) {
        this.loadingData = true;
        this.curProduct = await this.products.find(el => el.id === this.id);
        this.loadingData = false;
      } else {
        this.done = false;
      }
    },
  },
  methods: {
    validate() {
      const exists = this.products.find(el => el.product === this.product && el.price === this.price, this);
      if (exists) return {};
      return Object.assign(
        {},
        this.product === '' ? undefined : { product: this.product },
        this.price === '' ? undefined : { price: this.price },
      );
    },
    async resolve(result) {
      const validated = this.validate();
      let res = null;
      if (result && Object.keys(validated).length > 0) {
        res = await Firebase.editProduct({ id: this.id, data: validated });
        if (res.message) {
          this.errorMsg = res.code;
          return;
        }
      } else if (result && Object.keys(validated).length === 0) return;
      this.$emit('resolve', { result, id: this.id, res });
      this.dialog = false;
      this.curProduct = {};
      this.product = '';
      this.price = '';
      this.loadingData = true;
      this.errorMsg = null;
      this.done = true;
    },
  },
};
</script>
