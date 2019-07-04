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
      <v-layout row justify-space-between>
        <v-flex xs5>
          <v-select
            v-model="sessions"
            ref="sessions"
            :items="sessionsMaster"
            multiple
            label="Sessions"
          ></v-select>
        </v-flex>
        <v-flex xs5>
          <v-select
            v-model="payments"
            ref="payments"
            :items="paymentsMaster"
            multiple
            label="Payment Types"
          ></v-select>
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
              <td class="text-xs-left">{{ props.item.sessions ? props.item.sessions.join(', ') : '' }}</td>
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
    headers: [
      { text: 'Camper Name', value: 'name' },
      { text: 'Cabin', value: 'cabin' },
      { text: 'Amount', value: 'amount' },
      { text: 'Method', value: 'method', sortable: false },
      { text: 'Sessions', value: 'sessions', sortable: false },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    sessions: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    sessionsMaster: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    payments: ['Card', 'Cash', 'Check'],
    paymentsMaster: ['Card', 'Cash', 'Check'],
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
      return this.campers.filter((el) => {
        let status = true;
        status = this.sessions.every(i => el.sessions ? el.sessions.includes(i) : true);
        if (!this.payments.includes(el.method)) status = false;
        return status;
      });
    },
  },
};
</script>
