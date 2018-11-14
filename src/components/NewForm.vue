<template>
  <v-layout justify-center>
    <v-flex xs12 sm10 md8 lg6>
      <v-card ref="form">
        <v-card-text>
          <v-text-field
            ref="name"
            v-model="name"
            :rules="[() => !!name || 'This field is required']"
            label="Transaction Name"
            placeholder="New Transaction"
            required
          ></v-text-field>
          <v-text-field
            ref="amount"
            :rules="[() => !!amount || 'This field is required']"
            v-model="amount"
            label="Amount"
            placeholder="10.00"
            prefix="£"
            required
          ></v-text-field>
          <v-text-field
            ref="dateTime"
            :rules="[() => !!dateTime || 'This field is required']"
            v-model="dateTime"
            label="dateTime"
            placeholder="Today"
            required
          ></v-text-field>
          <v-text-field
            ref="location"
            v-model="location"
            :rules="[() => !!location || 'This field is required']"
            label="location"
            required
            placeholder="ASDA"
          ></v-text-field>
          <v-text-field
            ref="catagory"
            :rules="[() => !!catagory || 'This field is required']"
            v-model="catagory"
            label="catagory"
            required
            placeholder="Weekly Shop"
          ></v-text-field>
          <v-radio-group v-model="direction" row>
            <v-radio label="Incoming" value="incoming"></v-radio>
            <v-radio label="Outgoing" value="outgoing"></v-radio>
          </v-radio-group>
          <!-- <v-autocomplete
            ref="country"
            :rules="[() => !!country || 'This field is required']"
            :items="countries"
            v-model="country"
            label="Country"
            placeholder="Select..."
            required
          ></v-autocomplete> -->
        </v-card-text>
        <v-divider class="mt-5"></v-divider>
        <v-card-actions>
          <v-btn flat @click="resetForm">Reset</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="submit">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
  export default {
    data: () => ({
      name: null,
      amount: null,
      dateTime: null,
      location: null,
      catagory: null,
      direction: "outgoing",
    }),

    computed: {
      form () {
        return {
          name: this.name,
          amount: this.amount,
          dateTime: this.dateTime,
          location: this.location,
          catagory: this.catagory
        }
      }
    },
    methods: {
      resetForm () {
        Object.keys(this.form).forEach(f => {
          this.$refs[f].reset()
        })
      },
      submit () {
        let formHasErrors = false

        Object.keys(this.form).forEach(f => {
          if (!this.form[f]) formHasErrors = true
          this.$refs[f].validate(true)
        })
        if(!formHasErrors) {
          let transactions = JSON.parse(window.localStorage.getItem("transactions"))
          let newTransaction = JSON.parse(JSON.stringify(this.form))
          newTransaction.id = this.generateRandomID();
          newTransaction.direction = this.direction
          transactions.push(newTransaction)
          window.localStorage.setItem("transactions", JSON.stringify(transactions))
        }
      },
      generateRandomID: function() {
        return Math.random().toString(36).substr(2, 9) + '_' + Math.random().toString(36).substr(2, 9);
      }
    }
  }
</script>