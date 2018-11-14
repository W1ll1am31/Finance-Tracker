<template>
    <v-card>
        <h1>Detailed View</h1>
        <v-btn @click="loadDummyData()">loadDummyData</v-btn>
        <v-data-table
            :headers="headers"
            :items="transactions"
            class="elevation-1"
            xs12
            >
            <template slot="items" slot-scope="props">
                <tr @click="editTransaction(props.item)">
                    <td>{{ props.item.dateTime }}</td>
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.amount }}</td>
                </tr>
            </template>
            <template slot="no-data">
                <v-alert :value="true" color="error" icon="warning">
                    Sorry, nothing to display here :(
                </v-alert>
            </template>
        </v-data-table>
        <v-dialog v-model="dialog">
            <v-card>
                <v-card-title>
                    <span class="headline">Detailed Transaction</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="singleTransaction.name" label="Transaction name"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="singleTransaction.amount" label="Amount"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="singleTransaction.catagory" label="Catagory"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="singleTransaction.dateTime" label="Date/Time"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field v-model="singleTransaction.location" label="Location"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-radio-group v-model="singleTransaction.direction" row>
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
      selectedIndex: -1
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
      this.transactions[this.selectedIndex] = this.singleTransaction;
      window.localStorage.setItem(
        "transactions",
        JSON.stringify(this.transactions)
      );
      this.close();
    },
    loadDummyData: function() {
      let data = {
        name: "tran 1",
        amount: 10,
        catagory: "shop",
        dateTime: "today",
        location: "that place"
      };
      window.localStorage.setItem("transactions", JSON.stringify([data]));
    }
  }
};
</script>
