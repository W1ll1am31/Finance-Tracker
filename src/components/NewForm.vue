<template>
  <v-layout justify-center>
    <v-flex xs12 sm10 md8 lg6>
      <v-card>
        <v-card-text>
          <v-text-field
            ref="name"
            v-model="formItems.name"
            :rules="[() => !!formItems.name || 'This field is required']"
            label="Transaction Name"
            placeholder="New Transaction"
            required
          ></v-text-field>
          <v-text-field
            ref="amount"
            :rules="[() => !!formItems.amount || 'This field is required']"
            v-model="formItems.amount"
            type="number"
            min="0.01"
            step="0.01"
            label="Amount"
            placeholder="10.00"
            prefix="£"
            required
            @change="amountChange"
          ></v-text-field>
          <v-menu
            :close-on-content-click="false"
            v-model="menu2"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
          >
            <v-text-field
              ref="dateTime"
              slot="activator"
              v-model="formItems.dateTime"
              label="Picker without buttons"
              append-icon="event"
              readonly
            ></v-text-field>
            <v-date-picker v-model="formItems.dateTime" @input="menu2 = false" :min="minDate"></v-date-picker>
          </v-menu>
          <v-text-field
            ref="location"
            v-model="formItems.location"
            label="location"
            required
            placeholder="ASDA"
          ></v-text-field>
          <v-text-field
            ref="catagory"
            v-model="formItems.catagory"
            label="catagory"
            required
            placeholder="Weekly Shop"
          ></v-text-field>
          <v-radio-group v-model="formItems.direction" row ref="direction">
            <v-radio label="Incoming" value="incoming"></v-radio>
            <v-radio label="Outgoing" value="outgoing"></v-radio>
          </v-radio-group>
          <div @click="addPhoto">
            <v-img
              ref="image"
              :src="image"
              v-if="image"
              height="125"
              class="grey darken-4"
            ></v-img>
            <v-icon v-else>
              add_a_photo
            </v-icon>
            Add photo of receipt
          </div>
        </v-card-text>
        <v-divider class="mt-5"></v-divider>
        <v-card-actions>
          <v-btn flat @click="resetForm">Reset</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="submit">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-snackbar
      v-model="snackbar"
      multi-line
      :timeout="5000"
      color="green"
    >
      Transaction successfully added!
      <v-btn @click="snackbar = false" icon>
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-layout>
</template>
<script>
  export default {
    data: () => ({
      snackbar: false,
      menu2: false,
      formItems: {
        name: null,
        amount: null,
        location: null,
        catagory: null,
        direction: "outgoing",
        dateTime: new Date().toISOString().substr(0, 10)
      },
      initialState: {
        name: null,
        amount: null,
        location: null,
        catagory: null,
        direction: "outgoing",
        dateTime: new Date().toISOString().substr(0, 10)
      },
      image: null
    }),
    computed: {
      minDate: function() {
        let date = new Date()
        date.setDate(1);
        return date.toISOString().split('T')[0];
      }
    },
    methods: {
      resetForm () {
          Object.keys(this.formItems).forEach(f => {
            this.$refs[f].resetValidation();
            this.formItems[f] = this.initialState[f];
          })
          this.image = null;
      },
      submit () {
        let formHasErrors = false
        Object.keys(this.formItems).forEach(f => {
          if (!this.$refs[f].valid) {
            formHasErrors = true
          }
          this.$refs[f].validate(true);
        })
        
        if(!formHasErrors) {
          let transactions = JSON.parse(window.localStorage.getItem("transactions"))
          let newTransaction = JSON.parse(JSON.stringify(this.formItems))
          if(transactions == null) {
            transactions = [];
          }
          newTransaction.id = this.generateRandomID();
          newTransaction.image = this.image
          transactions.push(newTransaction)
          window.localStorage.setItem("transactions", JSON.stringify(transactions))
          this.snackbar = true;
          this.resetForm();
        }
      },
      generateRandomID: function() {
        return Math.random().toString(36).substr(2, 9) + '_' + Math.random().toString(36).substr(2, 9);
      },
      amountChange: function(value) {
        if(value) {
          this.formItems.amount = parseFloat(value).toFixed(2);
        }
      },
      addPhoto: function() {
        if (window.location.protocol === 'file:' || window.location.port === '3000') {
          navigator.camera.getPicture(imageData => {
            this.image = imageData;
          }, message => {
            window.alert("Cannot take picture: " + message)
          }, { quality: 50, destinationType: Camera.DestinationType.FILE_URI, saveToPhotoAlbum: true });
        } else {
          window.alert("Adding images only supported on devices, not through NPM")
        }
      }
    }
  }
</script>