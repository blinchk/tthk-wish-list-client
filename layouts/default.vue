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
      <v-btn exact to="/register" elevation="0"><v-icon left>mdi-account-plus</v-icon> Sign Up</v-btn>
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
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Wish List'
    }
  },
  computed: {
    ...mapGetters(['alertNotification']),
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
