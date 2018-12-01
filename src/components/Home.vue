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
              <v-responsive id="spendGraph" @click="$router.push('/detailed')"></v-responsive>
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
    this.startingBalance = window.localStorage.getItem("startingBalance");
    let currentDate = new Date();

    if(this.startingBalance == null) {
      this.setupDialog = true;
    } else if(window.localStorage.getItem("firstCalculation") == "true") {
      let retValue = this.getTransactionData(currentDate.getMonth());
      this.transactionData = retValue.transactionData;
      this.currentBalance = retValue.currentBalance;
    } else {
      let retValue = this.getTransactionData(currentDate.getMonth()-1);
      this.startingBalance = retValue.currentBalance;
      localStorage.setItem("startingBalance", this.startingBalance);
      retValue = this.getTransactionData(currentDate.getMonth());
      this.transactionData = retValue.transactionData;
      this.currentBalance = retValue.currentBalance;
      window.localStorage.setItem("firstCalculation", true)
      this.deleteOldEntries(retValue.transactionData);
}

    this.createGraph();
  },
  methods: {
    deleteOldEntries: function(okayValueList) {
      okayValueList = okayValueList.dates.sort(this.compare);
      console.log(okayValueList);
      let allTransactions = JSON.parse(
        window.localStorage.getItem("transactions")
      );
      allTransactions.sort(this.compare)
      let firstIndex = allTransactions.indexOf(allTransactions.find(trans => {
        return trans.dateTime === okayValueList[0];
      }))
      console.log(allTransactions, firstIndex);
      if(firstIndex > 0) {
        allTransactions = allTransactions.splice(firstIndex, allTransactions.length);
        console.log(allTransactions)
        window.localStorage.setItem("transactions", JSON.stringify(allTransactions))
      }
    },
    saveStartingBalance: function() {
      window.localStorage.clear();
      window.localStorage.setItem("startingBalance", parseFloat(this.startingBalance).toFixed(2));
      this.currentBalance = parseFloat(this.startingBalance).toFixed(2);
      this.setupDialog = false;
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
    getTransactionData: function(month) {
      let lCurrentBalance = parseFloat(this.startingBalance).toFixed(2);
      // this.currentBalance = parseFloat(this.startingBalance).toFixed(2);
      let transactions = JSON.parse(
        window.localStorage.getItem("transactions")
      );
      if (transactions == null) {
        return {
          transactionData: {
            dates: null,
            spend: null
          },
          currentBalance: lCurrentBalance
        }
      }
      transactions = this.split(transactions);

      var date = new Date();
      date.setMonth(month);
      date.setDate(1);
      var days = [date.toISOString().substring(0, 10)];
      var cost = [lCurrentBalance];
      while (date.getMonth() == month) {
        let currentDate = date.toISOString().substring(0, 10);
        if (transactions[currentDate]) {
          days.push(currentDate);
          for (let transaction of transactions[currentDate]) {
            lCurrentBalance = parseFloat(lCurrentBalance) + parseFloat(transaction);
          }
          lCurrentBalance = parseFloat(lCurrentBalance).toFixed(2);
          cost.push(lCurrentBalance);
        }
        date.setDate(date.getDate() + 1);
      }
      return {
        transactionData: {
          dates: days,
          spend: cost
        },
        currentBalance: lCurrentBalance
      }
    },
    compare: function(a, b) {
      if (a.dateTime < b.dateTime) return -1;
      if (a.dateTime > b.dateTime) return 1;
      return 0;
    },
    split: function(transactions) {
      let splitData = {};
      for (let transaction of transactions) {
        if (!(transaction.dateTime in Object.keys(splitData))) {
          splitData[transaction.dateTime] = [];
        }
        splitData[transaction.dateTime].push(
          transaction.amount * (transaction.direction == "outgoing" ? -1 : 1)
        );
      }

      return splitData;
    }
  }
};
</script>