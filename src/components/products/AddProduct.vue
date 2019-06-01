<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <template v-slot:activator="{on}">
      <v-btn color="pink" dark @click="dialog = true">
        Add a Product
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">New Product</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="product"
          ref="product"
          label="Product"
        ></v-text-field>
        <v-text-field
          v-model="price"
          ref="price"
          label="Price"
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
      product: '',
      price: '',
    };
  },
  computed: {
    ...mapState(['products']),
  },
  methods: {
    validate() {
      if (this.product === '' || this.price === '') return {};
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
      if (result && Object.keys(validated).length > 0) {
        await Firebase.addProduct(validated);
      } else if (result && Object.keys(validated).length === 0) return;
      this.product = '';
      this.price = '';
      this.dialog = false;
    },
  },
};
</script>
