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
        <v-alert :value="true" color="error" outline icon="warning">No transactions available</v-alert>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-card-title>
          <v-text-field
            class="headline"
            v-model="singleTransaction.name"
            label="Transaction name"
            ref="name"
          ></v-text-field>
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
                    label="Transaction Date"
                    append-icon="event"
                    readonly
                  ></v-text-field>
                  <v-date-picker
                    v-model="singleTransaction.dateTime"
                    @input="dateMenu = false"
                    :min="minDate"
                  ></v-date-picker>
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
              <div>
                <div v-if="singleTransaction.image">
                  <v-img
                    @click="addPhoto"
                    ref="image"
                    :src="singleTransaction.image"
                    height="125"
                    class="grey darken-4"
                  ></v-img>
                  <v-btn fab @click="deleteImage(singleTransaction.image)">
                    <v-icon>close</v-icon>
                  </v-btn>
                </div>
                <v-btn fab v-else @click="addPhoto">
                  <v-icon>add_a_photo</v-icon>
                </v-btn>Image of receipt
              </div>
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
  computed: {
    minDate: function() {
      let date = new Date();
      date.setDate(1);
      return date.toISOString().split("T")[0];
    }
  },
  created: function() {
    this.transactions = this.getTransactions();
  },
  methods: {
    addPhoto: function() {
      if (
        window.location.protocol === "file:" ||
        window.location.port === "3000"
      ) {
        navigator.camera.getPicture(
          imageData => {
            this.singleTransaction.image = imageData;
          },
          message => {
            window.alert("Cannot take picture: " + message);
          },
          {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            saveToPhotoAlbum: true
          }
        );
      } else {
        window.alert(
          "Adding images only supported on devices, not through NPM"
        );
        let randomIndex = Math.floor(Math.random() * 86);
        this.singleTransaction.image = "https://picsum.photos/510/300?image=" + randomIndex;
      }
    },
    deleteImage: function(image) {
      this.singleTransaction.image = null;
    },
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
      this.singleTransaction = JSON.parse(JSON.stringify(item));
      this.selectedIndex = this.transactions.indexOf(item);
    },
    deleteTransaction: function(item) {
      this.transactions.splice(this.selectedIndex, 1);
      this.deleteImage(item.image);
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
      let doNotCheck = ["id", "image"];
      Object.keys(this.singleTransaction).forEach(f => {
        if (doNotCheck.indexOf(f) == -1) {
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
