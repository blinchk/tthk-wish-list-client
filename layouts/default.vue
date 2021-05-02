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
        <div class="user__info d-flex align-center" v-if="user">
          <v-avatar :color="avatarColor" size="40">{{ avatarInitials }}</v-avatar>
          <span class="ml-2"> Howdy, {{user.firstName}}</span>
        </div>
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
        <AlertNotification/>
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
import { mapActions, mapState } from 'vuex'
import AlertNotification from '~/components/AlertNotification'
import randomMC from 'random-material-color'

export default {
  data () {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'mdi-package',
          title: 'My wishes',
          to: '/wishes'
        }
      ],
      title: 'Wish List'
    }
  },
  components: {
    AlertNotification
  },
  methods: {
    ...mapActions(['logoutUser', 'getUser']),
    logout() {
      this.logoutUser();
      this.$router.push('/login');
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
  beforeMount() {
    this.getToken()
    if (this.accessToken) {
      this.getUser()
    }
  },
  computed: {
    ...mapState(['accessToken', 'user']),
    avatarInitials() {
      return this.user.firstName[0].toUpperCase() + this.user.lastName[0].toUpperCase()
    },
    avatarColor() {
      return randomMC.getColor( { text: this.user.firstName + this.user.lastName } );
    }
  }
}
</script>
