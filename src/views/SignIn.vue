<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Camp Kern Canteen</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="signIn(password)">
                <v-text-field prepend-icon="lock" label="Password" type="password" v-model="password"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="signIn(password)">Sign In</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      password: '',
    };
  },
  methods: {
    ...mapActions(['signIn']),
  },
};
</script>
