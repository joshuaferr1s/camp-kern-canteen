<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <template v-slot:activator="{ on }">
      <v-icon
        class="mr-4"
        @click="dialog = true"
        color="green"
      >
        add_shopping_cart
      </v-icon>
    </template>
    <v-card class="fullHeight">
      <v-flex xs12 class="fullHeight">
        <v-layout row class="fullHeight">
          <v-flex xs8 class="blue-grey lighten-4 products">
            <!-- Products -->
            <v-layout column>
              <v-container grid-list-md fluid>
                <p class="display-1 text-xs-center">Products</p>
                <v-layout row wrap>
                  <v-flex
                    v-for="(product, index) in products"
                    :key="`product-${index}`"
                    xs3
                    @click="addToCart(product)"
                    class="pointer"
                  >
                    <v-card flat tile>
                      <v-card-title>{{ product.product }}</v-card-title>
                      <v-card-text>${{ product.price }}</v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-layout>
          </v-flex>
          <!-- Total + Actions -->
          <v-flex xs4 class="fullHeight">
            <v-layout column justify-space-between class="fullHeight">
              <v-flex>
                <v-list subheader class="mainCart">
                  <v-subheader>Cart</v-subheader>
                  <v-list-tile
                    v-for="(item, index) in cart"
                    :key="`cart-${index}`"
                    @click="deleteItem(index)"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title v-html="item.product"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <span>${{ item.price }}</span>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
                <v-list class="totalCart">
                  <v-divider inset></v-divider>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-title>Total</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <span>${{ cartTotal }}</span>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-flex>
              <div class="height-10">
                <v-layout row justify-space-between>
                  <v-btn color="error" @click="closeDialog()">Cancel</v-btn>
                  <v-btn color="primary" @click="checkout()">Process</v-btn>
                </v-layout>
              </div>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import Firebase from '../../firebase';

export default {
  props: ['id'],
  data() {
    return {
      dialog: false,
      done: false,
      loadingData: true,
      products: [
        {
          product: '3/4 Sleeve OH T',
          price: '18',
        },
        {
          product: 'Bandana',
          price: '6',
        },
        {
          product: 'Water Bottle',
          price: '10',
        },
        {
          product: '1 Sticker',
          price: '2',
        },
        {
          product: '3 Stickers',
          price: '5',
        },
        {
          product: 'Carabiner',
          price: '3',
        },
        {
          product: 'Deck of Cards',
          price: '5',
        },
        {
          product: 'Firestarter',
          price: '2',
        },
        {
          product: 'Flashlight',
          price: '6',
        },
        {
          product: 'Knit Hat',
          price: '10',
        },
        {
          product: 'Hooded Sweatshirt',
          price: '30',
        },
        {
          product: 'Light Wand',
          price: '5',
        },
        {
          product: 'Long Sleeve Ranch T',
          price: '15',
        },
        {
          product: 'Notebook & Pen',
          price: '7',
        },
        {
          product: 'Ohio T',
          price: '15',
        },
        {
          product: 'Patches',
          price: '4',
        },
        {
          product: 'Pen',
          price: '1',
        },
        {
          product: '1 Vintage Pin',
          price: '3',
        },
        {
          product: '2 Vintage Pins',
          price: '5',
        },
        {
          product: '5 Vintage Pins',
          price: '10',
        },
        {
          product: 'Poncho',
          price: '5',
        },
        {
          product: 'Socks',
          price: '10',
        },
        {
          product: 'Stuffed Animal',
          price: '8',
        },
        {
          product: 'Sunglasses',
          price: '5',
        },
        {
          product: 'Tshirts',
          price: '12',
        },
      ],
      cart: [],
      camper: {
        amount: null,
      },
    };
  },
  computed: {
    ...mapState(['campers']),
    cartTotal() {
      let result = 0;
      for (let index = 0; index < this.cart.length; index += 1) {
        result += Number(this.cart[index].price);
      }
      return result;
    },
  },
  watch: {
    async dialog() {
      if (!this.done) {
        this.loadingData = true;
        await this.$store.dispatch('getCampers');
        this.camper = await this.campers.find(el => el.id === this.id);
        this.loadingData = false;
      } else {
        this.done = false;
      }
    },
  },
  methods: {
    closeDialog() {
      this.dialog = false;
      this.cart = [];
      this.loadingData = true;
      this.done = true;
    },
    deleteItem(index) {
      this.cart.splice(index, 1);
    },
    addToCart(item) {
      if (Number(this.camper.amount) - this.cartTotal - Number(item.price) < 0) return;
      this.cart.push(item);
    },
    async checkout() {
      const camper = {
        id: this.id,
        data: {
          amount: String(this.camper.amount - this.cartTotal),
          purchases: [...(this.camper.purchases ? this.camper.purchases : []), ...this.cart],
        },
      };
      const res = await Firebase.editCamper(camper);
      if (res.message) return;
      await this.$store.dispatch('getCampers');
      this.closeDialog();
    },
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
.fullHeight {
  height: 100vh;
}
.height-10 {
  height: 10vh;
}
.products {
  max-height: 100vh;
  overflow-y: auto;
}
.mainCart {
  max-height: 80vh;
  overflow-y: auto;
}
.totalCart {
  max-height: 10vh;
  overflow-y: auto;
}
</style>
