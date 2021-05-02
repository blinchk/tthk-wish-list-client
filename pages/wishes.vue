<template>
  <v-layout align-start justify-center wrap>
    <v-col cols="6">
      <v-row v-for="wish in wishes" :key="wish.id" class="mb-3">
        <v-card width="700px" max-width="700px">
          <v-card-title>{{ wish.name }}</v-card-title>
          <v-card-text>
            <template v-if="wishes">
              <p>{{ wish.description }}</p>
            </template>
            <v-progress-circular v-else indeterminate/>
          </v-card-text>
        </v-card>
      </v-row>
    </v-col>
  </v-layout>
</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
  name: "wishes",
  mounted() {
    this.getWishes()
  },
  computed: {
    ...mapState('wishes', ['wishes'])
  },
  methods: {
    ...mapActions('wishes', ['getWishes'])
  }
}
</script>

<style scoped>

</style>
