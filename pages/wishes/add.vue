<template>
  <v-layout align-center justify-center>
    <v-card elevation="3" width="500px" max-width="500px">
      <v-card-title>Add new wish</v-card-title>
      <v-card-text>
        <v-text-field v-model="name" label="Wish name"></v-text-field>
        <v-text-field v-model="description" label="Wish description"></v-text-field>
      </v-card-text>
      <v-card-actions class="text-right">
        <v-col class="text-right">
          <v-btn :loading="loading" color="success" class="text-right" right @click.stop="wishadding">
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
import {mapState, mapActions} from "vuex";

export default {
  name: "add-wish",
  data() {
    return {
      name: '',
      description: '',
      loading: false
    }
  },
  computed:{
    ...mapState('wishes', ['wishes'])
  },
  mounted () {
    this.checkForToken()
  },
  methods:{
    ...mapActions('wishes', ['addWish']),
    ...mapActions(['checkForToken']),
    async wishadding() {
      this.addWish({
        name: this.name,
        description: this.description
      }).then(() => {
        this.loading = true
        this.$router.push('/wishes')
      }).catch(() =>{
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
