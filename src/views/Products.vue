<template>
  <v-container>
    <div id="products-view">
      <!-- Search Bar + Add Product -->
      <v-layout row>
        <v-flex xs9>
          <v-text-field
            v-model="search"
            single-line
            label="Search"
            prepend-icon="search"
            class="mb-2"
          ></v-text-field>
        </v-flex>
        <v-flex xs2>
          <add-product />
        </v-flex>
        <v-flex xs1>
          <v-btn fab small color="black">
            <confirm-deletion-dialog id="2" @resolve="deleteAllProducts" />
          </v-btn>
        </v-flex>
      </v-layout>

      <!-- Product List -->
      <v-card>
        <div>
          <v-data-table
            :headers="headers"
            :items="products"
            :search="search"
            hide-actions
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.product }}</td>
              <td class="text-xs-left">${{ props.item.price }}</td>
              <td class="justify-left layout">
                <edit-product :id="props.item.id" @resolve="editProduct" />
                <confirm-deletion-dialog :id="props.item.id" @resolve="deleteProduct" />
              </td>
            </template>
            <template slot="no-data">
              <div class="text-xs-center">
                <p class="red--text">There doesn't seem to be any products.</p>
              </div>
            </template>
          </v-data-table>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import Firebase from '../firebase';
import AddProduct from '../components/products/AddProduct.vue';
import EditProduct from '../components/products/EditProduct.vue';
import ConfirmDeletionDialog from '../components/ConfirmDeletionDialog.vue';

export default {
  components: {
    AddProduct,
    EditProduct,
    ConfirmDeletionDialog,
  },
  data: () => ({
    search: '',
    headers: [
      { text: 'Product', value: 'product' },
      { text: 'Price', value: 'price' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
  }),
  methods: {
    async deleteAllProducts(results) {
      const { result } = results;
      if (!result) return;
      await Firebase.deleteProducts();
    },
    async deleteProduct(results) {
      const { result, id } = results;
      if (!result) return;
      await Firebase.deleteProduct(id);
    },
    async editProduct(results) {
      const { result, id, res } = results;
    },
  },
  computed: {
    ...mapState(['products']),
  },
};
</script>
