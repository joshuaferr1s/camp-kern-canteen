<template>
  <v-container>
    <div id="cabins-view">
      <!-- Search Bar + Add Cabin -->
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
          <add-cabin />
        </v-flex>
      </v-layout>

      <!-- Cabin List -->
      <v-card>
        <!-- UPDATE -->
        <div>
          <v-data-table
            :headers="headers"
            :items="cabins"
            :search="search"
            hide-actions
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.cabin }}</td>
              <td class="justify-left layout">
                <edit-cabin :id="props.item.id" @resolve="editCabin" />
                <confirm-deletion-dialog :id="props.item.id" @resolve="deleteCabin" />
              </td>
            </template>
            <template slot="no-data">
              <div class="text-xs-center">
                <p class="red--text">There doesn't seem to be any cabins.</p>
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
import AddCabin from '../components/cabins/AddCabin.vue';
import EditCabin from '../components/cabins/EditCabin.vue';
import ConfirmDeletionDialog from '../components/ConfirmDeletionDialog.vue';

export default {
  components: {
    AddCabin,
    EditCabin,
    ConfirmDeletionDialog,
  },
  data: () => ({
    search: '',
    headers: [
      { text: 'Cabin', value: 'cabin' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
  }),
  methods: {
    async deleteCabin(results) {
      const { result, id } = results;
      if (!result) return;
      await Firebase.deleteCabin(id);
    },
    async editCabin(results) {
      const { res } = results;
    },
  },
  computed: {
    ...mapState(['cabins']),
  },
};
</script>
