<template>
  <v-app>
    <v-toolbar>
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
