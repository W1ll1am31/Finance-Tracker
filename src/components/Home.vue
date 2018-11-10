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
              <v-responsive id="myDiv"></v-responsive>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
</template>
<script>
import Plotly from "plotly.js-basic-dist";
import { layout, scatter } from "plotly-js-material-design-theme";
import Router from "vue-router";

export default {
  data: function() {
    return {
      currentBalance: null,
      transactionData: {},
      currentBalance: 100
    };
  },
  mounted: function() {
    this.getTransactionData();
    this.createGraph();
  },
  methods: {
    createGraph: function() {
      var data = [
        scatter({
          x: this.transactionData["dates"],
          y: this.transactionData["spend"],
          type: "scatter",
          connectgaps: true
        })
      ];

      var currentMonth = new Date().toLocaleDateString("en-uk", {
        month: "long"
      });
      var layout = {
        title: currentMonth + " spending",
        showlegend: false,
        yaxis: { fixedrange: true },
        xaxis: { fixedrange: true },
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

      Plotly.newPlot("myDiv", data, layout, options);
    },
    add: function() {
      this.$router.push("/camera");
    },
    getTransactionData: function() {
      var cost = [1, 3, 6, 4, null, 10];
      var date = new Date();
      date.setDate(1);
      var month = date.getMonth();
      var days = [];
      while(date.getMonth() == month) {
        days.push(date.toISOString())
        date.setDate(date.getDate() + 1);
      }
      this.transactionData["dates"] = days;
      this.transactionData["spend"] = cost;
    }
  }
};
</script>