  <template>
      <v-card>
          <h1>Detailed View</h1>
          <v-btn @click="clearData()">Clear Data</v-btn>
          <v-data-table
              :headers="headers"
              :items="transactions"
              class="elevation-1"
              xs12
              :pagination.sync="pagination"
              >
              <template slot="items" slot-scope="props">
                  <tr @click="editTransaction(props.item)">
                      <td>{{ props.item.dateTime }}</td>
                      <td>{{ props.item.name }}</td>
                      <td>£{{ props.item.amount }}</td>
                  </tr>
              </template>
              <template slot="no-data">
                  <v-alert :value="true" color="error" outline icon="warning">
                      No transactions available
                  </v-alert>
              </template>
          </v-data-table>
          <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
              <v-card>
                  <v-card-title>
                    <v-text-field class="headline" v-model="singleTransaction.name" label="Transaction name" ref="name"></v-text-field>
                  </v-card-title>
                  <v-card-text>
                      <v-container grid-list-md>
                          <v-layout wrap>
                              <v-flex xs12 sm6 md4>
                                  <v-text-field
                                    :rules="[() => !!singleTransaction.amount || 'This field is required']"
                                    v-model="singleTransaction.amount"
                                    type="number"
                                    label="Amount"
                                    placeholder="10.00"
                                    prefix="£"
                                    required
                                    @change="amountChange"
                                    ref="amount"
                                  ></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm6 md4>
                                  <v-text-field v-model="singleTransaction.catagory" label="Catagory" ref="catagory"></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm6 md4>
                                  <v-menu
                                    :close-on-content-click="false"
                                    v-model="dateMenu"
                                    :nudge-right="40"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                  >
                                    <v-text-field
                                      ref="dateTime"
                                      slot="activator"
                                      v-model="singleTransaction.dateTime"
                                      label="Picker without buttons"
                                      append-icon="event"
                                      readonly
                                    ></v-text-field>
                                    <v-date-picker v-model="singleTransaction.dateTime" @input="dateMenu = false"></v-date-picker>
                                  </v-menu>
                              </v-flex>
                              <v-flex xs12 sm6 md4>
                                  <v-text-field v-model="singleTransaction.location" label="Location" ref="location"></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm6 md4>
                                  <v-radio-group v-model="singleTransaction.direction" row ref="direction">
                                    <v-radio label="Incoming" value="incoming"></v-radio>
                                    <v-radio label="Outgoing" value="outgoing"></v-radio>
                                  </v-radio-group>
                              </v-flex>
                          </v-layout>
                      </v-container>
                  </v-card-text>

                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                      <v-btn color="blue darken-1" flat @click.native="deleteTransaction">Delete</v-btn>
                      <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
                  </v-card-actions>
              </v-card>
          </v-dialog>
      </v-card>
  </template>
  <script>
export default {
  data: function() {
    return {
      headers: [
        {
          text: "Transaction Date",
          value: "dateTime"
        },
        { text: "Name", value: "name" },
        { text: "Amount", value: "amount" }
      ],
      transactions: [],
      dialog: false,
      singleTransaction: {},
      selectedIndex: -1,
      pagination: {
        sortBy: "dateTime",
        descending: true
      },
      dateMenu: false
    };
  },
  created: function() {
    this.transactions = this.getTransactions();
  },
  methods: {
    getTransactions: function() {
      let transactions = JSON.parse(
        window.localStorage.getItem("transactions")
      );
      if (transactions == null) {
        return [];
      } else {
        return transactions;
      }
    },
    editTransaction: function(item) {
      this.dialog = true;
      this.singleTransaction = item;
      this.selectedIndex = this.transactions.indexOf(item);
    },
    deleteTransaction: function(item) {
      this.transactions.splice(this.selectedIndex, 1);
      window.localStorage.setItem(
        "transactions",
        JSON.stringify(this.transactions)
      );
      this.close();
    },
    close: function() {
      this.dialog = false;
      this.singleTransaction = {};
      this.selectedIndex = -1;
    },
    save: function() {
      let formHasErrors = false;
      console.log(this.$refs)
      Object.keys(this.singleTransaction).forEach(f => {
        if(f != "id") {
          console.log(f)
          if (!this.$refs[f].valid) {
            formHasErrors = true;
          }
          this.$refs[f].validate(true);
        }
      });

      if (!formHasErrors) {
        this.transactions[this.selectedIndex] = this.singleTransaction;
        window.localStorage.setItem(
          "transactions",
          JSON.stringify(this.transactions)
        );
        this.close();
      }
    },
    clearData: function() {
      window.localStorage.clear();
      this.transactions = [];
    },
    amountChange: function(value) {
      if (value) {
        this.singleTransaction.amount = parseFloat(value).toFixed(2);
      }
    }
  }
};
</script>
