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
          <!-- Products -->
          <v-flex xs9 class="blue-grey lighten-4 products">
            <v-layout column>
              <v-container grid-list-md fluid>
                <p class="display-1 text-xs-center">Products</p>
                <v-layout row wrap>
                  <v-flex
                    v-for="(product, index) in products"
                    :key="`product-${index}`"
                    xs2
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
          <v-flex xs3 class="fullHeight">
            <v-layout column fill-height>
              <v-flex class="h10" pl-3>
                <v-switch v-model="display" :label="`Showing: ${display ? 'Cart' : 'Purchases'}`"></v-switch>
              </v-flex>
              <!-- Purchaes/Refund Screen -->
              <v-flex class="h75" v-if="!display">
                <v-layout column fill-height>
                  <v-flex class="h50">
                    <v-card>
                      <v-card-title class="subheading font-weight-bold">Purchases</v-card-title>
                      <v-list dense>
                        <v-list-tile v-for="(item, index) in minPurc" :key="`cart-${index}`" @click="refundItem(item.product)">
                          <v-list-tile-content>
                            <span><span class="font-weight-bold">{{ item.number }}x</span> {{ item.product }}</span>
                          </v-list-tile-content>
                          <v-list-tile-content class="align-end">
                            <span>${{ item.price }}</span>
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </v-card>
                  </v-flex>
                  <v-flex class="h50">
                    <v-divider></v-divider>
                    <v-card>
                      <v-card-title class="subheading font-weight-bold">Refunds</v-card-title>
                      <v-list dense>
                        <v-list-tile v-for="(item, index) in minRefunds" :key="`cart-${index}`" @click="removeRefundItem(item.product)">
                          <v-list-tile-content>
                            <span><span class="font-weight-bold">{{ item.number }}x</span> {{ item.product }}</span>
                          </v-list-tile-content>
                          <v-list-tile-content class="align-end">
                            <span>${{ item.price }}</span>
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-flex>
              <!-- Cart -->
              <v-flex class="h75" v-else>
                <v-card>
                  <v-card-title class="subheading font-weight-bold">Cart</v-card-title>
                  <v-divider></v-divider>
                  <v-list dense>
                    <v-list-tile v-for="(item, index) in minCart" :key="`cart-${index}`" @click="deleteItem(item.product)">
                      <v-list-tile-content>
                        <span><span class="font-weight-bold">{{ item.number }}x</span> {{ item.product }}</span>
                      </v-list-tile-content>
                      <v-list-tile-content class="align-end">
                        <span>${{ item.price }}</span>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-flex>
              <v-flex class="h15" v-if="!display">
                <v-list dense>
                  <v-divider inset></v-divider>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-title>Refund</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <span>${{ this.refundTotal }}</span>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
                <v-layout row justify-space-between>
                  <v-btn color="error" @click="closeDialog()">Cancel</v-btn>
                  <v-btn color="primary" @click="refund()">Refund</v-btn>
                </v-layout>
              </v-flex>
              <v-flex class="h15" v-else>
                <v-list dense>
                  <v-divider inset></v-divider>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-title>Money Left</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <span>${{ this.camper.amount - cartTotal }}</span>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
                <v-layout row justify-space-between>
                  <v-btn color="error" @click="closeDialog()">Cancel</v-btn>
                  <v-btn color="primary" @click="checkout()">Checkout</v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import Firebase from '../../firebase';

export default {
  props: ['id'],
  data() {
    return {
      dialog: false,
      done: false,
      display: true,
      loadingData: true,
      cart: [],
      tempCart: [],
      refunds: [],
    };
  },
  computed: {
    ...mapState(['products']),
    camper() {
      return this.$store.getters.camper(this.id);
    },
    cartTotal() {
      let result = 0;
      for (let index = 0; index < this.cart.length; index += 1) {
        result += Number(this.cart[index].price);
      }
      return result;
    },
    refundTotal() {
      let result = 0;
      for (let index = 0; index < this.refunds.length; index += 1) {
        result += Number(this.refunds[index].price);
      }
      return result;
    },
    minPurc() {
      if (!this.camper || !this.camper.purchases) return [];
      const cart = this.camper.purchases.reduce((acc, curr) => {
        const index = acc.findIndex(el => el.product === curr.product && el.price === curr.price);
        if (index < 0) acc.push({ ...curr, number: 1 });
        else acc[index].number += 1;
        return acc;
      }, []);
      this.minRefunds.forEach((el) => {
        const index = cart.findIndex(i => el.product === i.product);
        if (index >= 0) {
          Vue.set(cart[index], 'number', Number(cart[index].number) - Number(el.number));
        }
      });
      return cart.filter(el => el.number > 0);
    },
    minCart() {
      const cart = this.cart.reduce((acc, curr) => {
        const index = acc.findIndex(el => el.product === curr.product && el.price === curr.price);
        if (index < 0) acc.push({ ...curr, number: 1 });
        else acc[index].number += 1;
        return acc;
      }, []);
      return cart;
    },
    minRefunds() {
      const refunds = this.refunds.reduce((acc, curr) => {
        const index = acc.findIndex(el => el.product === curr.product && el.price === curr.price);
        if (index < 0) acc.push({ ...curr, number: 1 });
        else acc[index].number += 1;
        return acc;
      }, []);
      return refunds;
    },
  },
  watch: {
    async dialog() {
      if (!this.done) {
        this.loadingData = true;
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
    deleteItem(product) {
      const index = this.cart.findIndex(el => el.product === product);
      this.cart.splice(index, 1);
    },
    removeRefundItem(product) {
      const index = this.refunds.findIndex(el => el.product === product);
      this.refunds.splice(index, 1);
    },
    refundItem(product) {
      const item = this.camper.purchases.find(el => el.product === product);
      const min = this.minPurc.find(el => el.product === product);
      if (Number(min.number) <= 0) return;
      this.refunds.push(item);
    },
    addToCart(item) {
      if ((Number(this.camper.amount) - Number(this.cartTotal) - Number(item.price) < 0) || !this.display) return;
      this.cart.push(item);
    },
    async refund() {
      const purchases = [...this.camper.purchases];
      this.refunds.forEach((el) => {
        const index = purchases.findIndex(i => el.product === i.product);
        Vue.delete(purchases, index);
      });
      const camper = {
        id: this.id,
        data: {
          amount: String(Number(this.camper.amount) + Number(this.refundTotal)),
          purchases,
        },
      };
      this.tempRefunds = [...this.refunds];
      this.refunds = [];
      const res = await Firebase.editCamper(camper);
      if (res.message) {
        this.refunds = [...this.tempRefunds];
        this.tempRefunds = [];
      }
      this.tempRefunds = [];
    },
    async checkout() {
      const camper = {
        id: this.id,
        data: {
          amount: String(Number(this.camper.amount) - Number(this.cartTotal)),
          purchases: [...(this.camper.purchases ? this.camper.purchases : []), ...this.cart],
        },
      };
      this.tempCart = [...this.cart];
      this.cart = [];
      const res = await Firebase.editCamper(camper);
      if (res.message) {
        this.cart = [...this.tempCart];
        this.tempCart = [];
      }
      this.tempCart = [];
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
.products {
  max-height: 100vh;
  overflow-y: auto;
}
.h10 {
  max-height: 10%;
  overflow-y: auto;
}
.h75 {
  max-height: 75%;
  overflow-y: auto;
}
.h15 {
  max-height: 15%;
  overflow-y: auto;
}
.h50 {
  max-height: 50%;
  overflow-y: auto;
}
</style>
