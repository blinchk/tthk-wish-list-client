<template>
  <v-layout align-center justify-center>
    <v-card elevation="3" width="500px" max-width="500px">
      <v-card-title>Add new wish</v-card-title>
      <v-card-text>
        <v-text-field v-model="name" label="Name" :rules="rules.name"></v-text-field>
        <v-text-field label="Description" hint="Optional"></v-text-field>
      </v-card-text>
      <v-card-actions class="text-right">
        <v-col class="text-right">
          <v-btn :disabled="!validName" :loading="loading" color="success" class="text-right" text
                 @click.stop="wishadding"
          >
            <v-spacer/>
            <v-icon left>
              mdi-plus
            </v-icon>
            Add wish
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "add-wish",
  data() {
    return {
      rules: {
        name: [val => val.length > 0 || 'This field is required!'],
      },
      name: '',
      loading: false
    }
  },
  computed: {
    ...mapState('wishes', ['wishes']),
    validName: function () {
      return this.name.length > 0
    }
  },
  mounted() {
    this.checkForToken()
  },
  methods: {
    ...mapActions('wishes', ['addWish']),
    ...mapActions(['checkForToken']),
    async wishadding() {
      this.addWish({
        name: this.name,
        description: this.description
      }).then(() => {
        this.loading = true
        this.$router.push('/wishes')
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
