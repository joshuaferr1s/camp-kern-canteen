<template>
  <v-container>
    <div id="campers-view">
      <!-- Search Bar + Add Camper -->
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
          <add-camper />
        </v-flex>
        <v-flex xs1>
          <v-btn fab small color="black">
            <confirm-deletion-dialog id="2" @resolve="deleteAllCampers" />
          </v-btn>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs4 justify-center>
          <v-checkbox v-model="methods" label="Cash" value="Cash"></v-checkbox>
        </v-flex>
        <v-flex xs4 align-center>
          <v-checkbox v-model="methods" label="Card" value="Card"></v-checkbox>
        </v-flex>
        <v-flex xs4 class="text-xs-center">
          <v-checkbox v-model="methods" label="Check" value="Check"></v-checkbox>
        </v-flex>
      </v-layout>

      <!-- Camper List -->
      <v-card>
        <!-- UPDATE -->
        <div>
          <v-data-table
            :headers="headers"
            :items="filteredCampers"
            :search="search"
            :rows-per-page-items='[15,30,45,{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}]'
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.cabin }}</td>
              <td class="text-xs-left">${{ props.item.amount }}</td>
              <td class="text-xs-left">{{ props.item.method }}</td>
              <td class="justify-left layout">
                <checkout :id="props.item.id" />
                <edit-camper :id="props.item.id" @resolve="editCamper" />
                <confirm-deletion-dialog :id="props.item.id" @resolve="deleteCamper" />
              </td>
            </template>
            <template slot="no-data">
              <div class="text-xs-center">
                <p class="red--text">There doesn't seem to be any campers.</p>
              </div>
            </template>
          </v-data-table>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import Firebase from '../firebase';
import AddCamper from '../components/campers/AddCamper.vue';
import ConfirmDeletionDialog from '../components/ConfirmDeletionDialog.vue';
import EditCamper from '../components/campers/EditCamper.vue';
import Checkout from '../components/campers/Checkout.vue';

export default {
  components: {
    AddCamper,
    ConfirmDeletionDialog,
    EditCamper,
    Checkout,
  },
  data: () => ({
    search: '',
    methods: [],
    headers: [
      { text: 'Camper Name', value: 'name' },
      { text: 'Cabin', value: 'cabin' },
      { text: 'Amount', value: 'amount' },
      { text: 'Method', value: 'method', sortable: false },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
  }),
  methods: {
    // NEW //
    async deleteAllCampers(results) {
      const { result } = results;
      if (!result) return;
      await Firebase.deleteCampers();
    },
    async deleteCamper(results) {
      const { result, id } = results;
      if (!result) return;
      await Firebase.deleteCamper(id);
    },
    // OLD //
    async editCamper(results) {
      const { result, id, res } = results;
    },
  },
  computed: {
    ...mapState(['campers']),
    filteredCampers() {
      if (this.methods.length === 0) return this.campers;
      return this.campers.filter(el => this.methods.includes(el.method));
    },
  },
};
</script>
