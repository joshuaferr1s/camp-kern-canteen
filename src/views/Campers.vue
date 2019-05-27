<template>
  <v-container>
    <div id="campers-view">
      <!-- Search Bar + Add Camper -->
      <v-layout row>
        <v-flex xs10>
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
      </v-layout>

      <!-- Camper List -->
      <v-card>
        <!-- UPDATE -->
        <div>
          <v-data-table
            :headers="headers"
            :items="campers"
            :search="search"
            hide-actions
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.cabin }}</td>
              <td class="text-xs-left">${{ props.item.amount }}</td>
              <td class="justify-left layout">
                <v-icon
                  class="mr-4"
                  @click="editCamper(props.item)"
                  color="green"
                >
                  add_shopping_cart
                </v-icon>
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
import Vue from 'vue';
import { mapState } from 'vuex';
import Firebase from '../firebase';
import AddCamper from '../components/campers/AddCamper.vue';
import ConfirmDeletionDialog from '../components/ConfirmDeletionDialog.vue';
import EditCamper from '../components/campers/EditCamper.vue';

export default {
  components: {
    AddCamper,
    ConfirmDeletionDialog,
    EditCamper,
  },
  data: () => ({
    search: '',
    headers: [
      { text: 'Camper Name', value: 'name' },
      { text: 'Cabin', value: 'cabin' },
      { text: 'Amount', value: 'amount' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
  }),
  methods: {
    // NEW //
    async deleteCamper(results) {
      const { result, id } = results;
      if (!result) return;
      await Firebase.deleteCamper(id);
      this.$store.dispatch('getCampers');
    },
    // OLD //
    async editCamper(results) {
      const { result, index } = results;
      console.log(result);
    },
    async updateCamper(camper) {
      // eslint-disable-next-line
      const index = await this.campers.findIndex((x) => {
        return (
          x.name === this.curCamper.name
          && x.cabin === this.curCamper.cabin
          && x.amount === this.curCamper.amount
        );
      });
      await Vue.set(this.campers, index, camper);
      localStorage.setItem('campers', JSON.stringify(this.campers));
    },
  },
  // NEW //
  async mounted() {
    this.$store.dispatch('getCampers');
    this.$store.dispatch('getCabins');
  },
  computed: {
    ...mapState(['campers']),
  },
};
</script>
