<template>
    <v-card>
      <v-container
        fluid
        grid-list-lg
      >
        <v-layout row wrap>
          <v-flex xs12>
            <v-card color="blue-grey darken-2" class="white--text">
              <v-card-title primary-title>
                <div class="headline">Balance</div>
              </v-card-title>
              <v-card-text>£{{ currentBalance }}</v-card-text>
              <v-card-actions>
                <v-btn>Set Budget</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-flex xs12>
            <v-card color="blue-grey darken-2" class="white--text">
              <v-card-title primary-title><div class="headline">Graph</div></v-card-title>
              <v-responsive id="spendGraph"></v-responsive>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-dialog v-model="setupDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-card-title>
            <span class="headline">Welcome to your new Finance Tracker!</span>
          </v-card-title>
          <v-card-text>
              As part of the initial setup you need to enter your starting balance. This will only need to done once and everything will be based of this value, so don't lie!
          </v-card-text>
            <v-text-field
              :rules="[() => !!startingBalance || 'This field is required']"
              v-model="startingBalance"
              type="number"
              label="Starting Balance"
              placeholder="100.00"
              prefix="£"
              required
            ></v-text-field>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="saveStartingBalance">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
</template>
<script>
import Plotly from "plotly.js-basic-dist";
import { layout, scatter, index } from "plotly-js-material-design-theme";
import Router from "vue-router";

export default {
  data: function() {
    return {
      transactionData: {},
      currentBalance: null,
      startingBalance: null,
      setupDialog: false
    };
  },
  mounted: function() {
    this.startingBalance = window.localStorage.getItem("startingBalance")
    if(this.startingBalance == null) {
      this.setupDialog = true;
    }
    this.getTransactionData();
    this.createGraph();
  },
  methods: {
    saveStartingBalance: function() {
      window.localStorage.setItem("startingBalance", this.startingBalance)
      this.setupDialog = false
    },
    createGraph: function() {
      var data = [
        scatter({
          x: this.transactionData["dates"],
          y: this.transactionData["spend"],
          type: "scatter",
          connectgaps: true,
          mode: "lines"
        })
      ];

      var currentMonth = new Date().toLocaleDateString("en-uk", {
        month: "long"
      });

      var new_layout = {
        title: currentMonth + " spending",
        showlegend: false,
        yaxis: {
          title: "Balance",
          fixedrange: true,
          showline: true,
          linecolor: "#ffffff"
        },
        xaxis: {
          title: "Date",
          fixedrange: true,
          showgrid: false,
          showline: true,
          linecolor: "#ffffff"
        },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: {
          color: "#ffffff"
        }
      };

      var options = {
        displayModeBar: false,
        responsive: true
      };

      Plotly.newPlot("spendGraph", data, new_layout, options);
    },
    getTransactionData: function() {
      this.currentBalance = parseInt(this.startingBalance);
      console.log("starting at " + this.currentBalance)
      let transactions = JSON.parse(window.localStorage.getItem("transactions"));
      if(transactions == null) {
        this.transactionData.dates = null;
        this.transactionData.spend = null;
        return;
      }
      transactions = this.split(transactions);

      var date = new Date();
      date.setDate(1);
      var month = date.getMonth();
      var days = [date.toISOString().substring(0, 10)];
      var cost = [this.currentBalance]
      while (date.getMonth() == month) {
        let currentDate = date.toISOString().substring(0, 10);
        if(transactions[currentDate]) {
          days.push(currentDate);
          for(let transaction of transactions[currentDate]) {
            this.currentBalance += parseInt(transaction);
          }
          cost.push(this.currentBalance);
        }
        date.setDate(date.getDate() + 1);
      }
      this.transactionData["dates"] = days;
      this.transactionData["spend"] = cost;
    },
    compare: function(a,b) {
      if (a.dateTime < b.dateTime)
        return -1;
      if (a.dateTime > b.dateTime)
        return 1;
      return 0;
    },
    split: function(transactions) {
      let splitData = {}
      for(let transaction of transactions) {
        if(!(transaction.dateTime in Object.keys(splitData))) {
          splitData[transaction.dateTime] = []
        }
        splitData[transaction.dateTime].push(transaction.amount * (transaction.direction =="outgoing" ? -1 : 1))
      }

      return splitData;
    }
  }
};
</script>