<template>
  <v-app>
    <error-alert errorMsg="Helo" />
    <v-toolbar color="green lighten-3">
      <v-toolbar-title>Camp Kern Canteen</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat exact to="/campers">Campers</v-btn>
        <v-btn flat exact to="/cabins">Cabins</v-btn>
        <v-btn flat exact to="/products">Products</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <router-view></router-view>
  </v-app>
</template>

<script>
import ErrorAlert from './components/ErrorAlert.vue';

export default {
  components: { ErrorAlert },
};
</script>
