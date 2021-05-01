<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      clipped-left
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer/>
      <template v-if="this.accessToken">
        <span v-if="user">Howdy, {{user.firstName}}</span>
        <v-btn elevation="0" icon @click.stop="logout()"><v-icon>mdi-logout</v-icon></v-btn>
      </template>
      <template v-else>
        <v-btn exact to="/register" elevation="0" icon><v-icon>mdi-account-plus</v-icon></v-btn>
        <v-btn exact to="/login" elevation="0" icon><v-icon>mdi-login</v-icon></v-btn>
      </template>
    </v-app-bar>
    <v-main>
      <v-container fill-height>
        <nuxt/>
        <v-snackbar v-model="alertNotificationStatus" :color="alertNotification.color" bottom
                    right timeout="1000" :multi-line="alertNotification.text > 40"
        >
          <v-icon v-if="alertNotification.color === 'error'" left>mdi-alert-circle-outline</v-icon>
          <v-icon v-else-if="alertNotification.color === 'warning'" left>mdi-alert-outline</v-icon>
          <v-icon v-else-if="alertNotification.color === 'success'" left>mdi-check-circle-outline</v-icon>
          <v-icon v-else left>mdi-information-outline</v-icon>
          {{ alertNotification.text }}
        </v-snackbar>
      </v-container>
    </v-main>
    <v-footer
      absolute
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}, BredBrains</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/'
        }
      ],
      title: 'Wish List'
    }
  },
  methods: {
    ...mapActions(['logoutUser', 'getUser']),
    logout() {
      this.logoutUser();
      this.$router.push('/');
    },
    getToken() {
      if (process.browser) {
        let token = localStorage.getItem('token')
        if (token) {
          this.$store.commit('setAccessToken', token);
        }
      }
    }
  },
  mounted() {
    this.getToken()
    if (this.accessToken) {
      this.getUser().then(() => {

      })
    }
  },
  computed: {
    ...mapState(['accessToken', 'alertNotification', 'user']),
    alertNotificationStatus: {
      get() {
        return this.$store.getters.alertNotification.status
      },
      set(payload) {
        this.$store.commit('setAlertStatus', payload)
      }
    }
  }
}
</script>
