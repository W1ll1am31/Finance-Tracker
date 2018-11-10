<template>
  <v-app dark>
    <v-toolbar fixed app>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-speed-dial
        v-model="fab"
        absolute
        direction="bottom"
        transition="slide-y-transition"
        right
      >
        <v-btn
          slot="activator"
          color="blue darken-2"
          dark
          fab
          hover
          v-model="fab"
        >
          <v-icon>attach_money</v-icon>
          <v-icon>close</v-icon>
        </v-btn>
        <v-tooltip v-model="fab" left>
          <v-btn
            fab
            dark
            small
            color="blue"
            slot="activator"
            @click="$router.push('/')"
          >
            <v-icon>home</v-icon>
          </v-btn>
          <span>Home</span>
        </v-tooltip>
        <v-tooltip v-model="fab" left>
          <v-btn
            fab
            dark
            small
            color="green"
            slot="activator"
            @click="$router.push('/newForm')"
          >
            <v-icon>add</v-icon>
          </v-btn>
          <span>Add new expense</span>
        </v-tooltip>
        <v-tooltip v-model="fab" left>
          <v-btn
            fab
            dark
            small
            color="indigo"
            slot="activator"
            @click="$router.push('/newSub')"
          >
            <v-icon>loop</v-icon>
          </v-btn>
          <span>Add new Subscription</span>
        </v-tooltip>
        <v-tooltip v-model="fab" left>
          <v-btn
            fab
            dark
            small
            color="red"
            slot="activator"
            @click="$router.push('/detailed')"
          >
            <v-icon>zoom_in</v-icon>
          </v-btn>
          <span>View Detailed transactions</span>
        </v-tooltip>
      </v-speed-dial> 
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  import Vue from 'vue'
  export default {
    data () {
      return {
        cordova: Vue.cordova,
        title: 'Vuetify.js',
        fab: false
      }
    },
    created () {
      var self = this
      this.cordova.on('deviceready', () => {
        self.onDeviceReady()
      })
    },
    methods: {
      onDeviceReady: function () {
        // Handle the device ready event.
        this.cordova.on('pause', this.onPause, false)
        this.cordova.on('resume', this.onResume, false)
        if (this.cordova.device.platform === 'Android') {
          document.addEventListener('backbutton', this.onBackKeyDown, false)
        }
      },
      onPause () {
        // Handle the pause lifecycle event.
        console.log('pause')
      },
      onResume () {
        // Handle the resume lifecycle event.
        // SetTimeout required for iOS.
        setTimeout(function () {
          console.log('resume')
        }, 0)
      },
      onBackKeyDown () {
        // Handle the back-button event on Android. By default it will exit the app.
        navigator.app.exitApp()
      }
    }
  }
</script>

<style>
	body {
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
	}
  .footer{ /* Apply this to v-bottom-nav if necessary. */
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);
  }
  #create .speed-dial {
  position: absolute;
}

#create .btn--floating {
  position: relative;
}
</style>
