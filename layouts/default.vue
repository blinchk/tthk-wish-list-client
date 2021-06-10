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
          v-for="(item, i) in currentRoutes"
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
        <nuxt-link v-if="user" id="profile-link" exact to="/profile/edit">
          <v-avatar :color="avatarColor(fullName)" size="40">{{ avatarInitials }}</v-avatar>
          <span class="ml-1"> Howdy, {{ user.firstName }}</span>
        </nuxt-link>
        <v-btn elevation="0" icon @click.stop="logout()">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
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
      fixed
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}, BredBrains</span>
    </v-footer>
  </v-app>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'
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
          to: '/',
          authorized: false,
          admin: false
        },
        {
          icon: 'mdi-package',
          title: 'My wishes',
          to: '/wishes/',
          authorized: true,
          admin: false
        },
        {
          icon: ' mdi-account-multiple',
          title: 'Users',
          to: '/profile/',
          authorized: true,
          admin: false
        },
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
          this.getUser()
        }
      }
    },
    avatarColor(fullName) {
      return randomMC.getColor({ text: fullName })
    }
  },
  created() {
    this.getToken()
  },
  computed: {
    ...mapState(['accessToken', 'user']),
    ...mapGetters(['avatarInitials', 'fullName']),
    currentRoutes() {
      if (this.accessToken) {
        return this.items
      } else {
        return this.items.filter((item) => item.authorized !== true)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
#profile-link {
  color: white;
  text-decoration: none;
}

</style>
