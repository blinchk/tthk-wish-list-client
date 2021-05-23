<template>
  <v-layout wrap>
    <v-col cols="12">
      <v-row class="mb-3 justify-center">
        <v-card elevation="3" max-width="700px" width="700px">
          <v-form ref="wishAdditionForm" @submit.prevent="wishAdding">
            <v-card-title>Are you wish about something?</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="name"
                :rules="rules.name"
                label="Name"
                type="text"
              ></v-text-field>
              <v-text-field
                v-model="description"
                hint="Optional"
                label="Description"
                type="text"
              ></v-text-field>
            </v-card-text>
            <v-card-actions class="text-right">
              <v-col class="text-right">
                <v-btn
                  :disabled="!validWish"
                  :loading="additionIsLoading"
                  class="text-right"
                  color="success"
                  text
                  type="submit"
                >
                  <v-spacer/>
                  <v-icon left> mdi-plus</v-icon>
                  Add wish
                </v-btn>
              </v-col>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-row>
      <template v-if="loading">
        <v-row class="justify-center">
          <v-progress-circular color="primary" indeterminate/>
        </v-row>
      </template>
      <template v-else-if="wishes && user">
        <v-row
          v-for="wish in wishes"
          :key="wish.id"
          class="mb-3 justify-center"
        >
          <v-card
            v-if="wishInEdit && wishInEdit.id === wish.id"
            elevation="3"
            max-width="700px"
            width="700px"
          >
            <v-form @submit.prevent="editWish(wishInEdit)">
              <v-card-title>
                <v-row>
                  <v-text-field
                    v-model="wishInEdit.name"
                    :rules="rules.name"
                    class="ml-2 mt-3"
                    dense
                    label="Name"
                    prepend-icon="mdi-pencil"
                    single-line
                  />
                </v-row>
                <v-spacer/>
                <div class="subtitle-1">
                  <v-avatar
                    :color="avatarColor(userFullname(wish.user))"
                    class="mr-1"
                    size="28"
                  >
                    {{ userInitials(wish.user) }}
                  </v-avatar>
                  {{ userFullname(user) }}
                </div>
              </v-card-title>
              <v-divider/>
              <v-card-text class="my py-0">
                <v-textarea
                  v-model="wishInEdit.description"
                  dense
                  label="Description"
                  rows="2"
                  single-line
                />
              </v-card-text>
              <v-card-actions class="px-2 pt-0">
                <v-row class="align-center">
                  <v-col cols="6">
                    <span class="ml-2 text--secondary">{{
                        moment(wish.creationTime).format('HH:mm DD.MM.YYYY')
                      }}</span>
                  </v-col>
                </v-row>
              </v-card-actions>
              <v-divider/>
              <v-card-actions>
                <v-row class="align-center">
                  <v-col class="text-right">
                    <v-btn text @click.stop="wishInEdit = {}">Cancel</v-btn>
                    <v-btn
                      :disabled="!validName"
                      :loading="editIsLoading[wish.id]"
                      color="success"
                      depressed
                      text
                      type="submit"
                    >
                      <v-icon left>mdi-pencil</v-icon>
                      Edit
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-form>
          </v-card>
          <v-card v-else elevation="3" max-width="700px" width="700px">
            <v-card-title
            >{{ wish.name }}
              <v-spacer/>
              <div class="subtitle-1">
                <v-avatar
                  :color="avatarColor(userFullname(wish.user))"
                  class="mr-1"
                  size="28"
                >
                  {{ userInitials(wish.user) }}
                </v-avatar>
                {{ userFullname(user) }}
              </div>
            </v-card-title>
            <v-divider/>
            <v-card-text v-if="wish.description">
              <p>{{ wish.description }}</p>
            </v-card-text>
            <v-card-actions class="px-2">
              <v-row class="align-center">
                <v-col cols="6">
                  <span class="ml-2 text--secondary">{{
                      moment(wish.creationTime).format('HH:mm DD.MM.YYYY')
                    }}</span>
                </v-col>
                <v-col class="text-right" cols="6">
                {{wish.likes}}
                  <v-btn icon @click.stop="toggleLike(wish)" :color="wish.liked ? 'pink' : 'white' ">
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
            <v-divider/>
            <v-card-actions>
              <v-row class="align-center">
                <v-col class="text-caption" cols="8">
                  <p class="ml-2">
                    You can edit or delete this wish, because it is created by
                    <strong>you.</strong>
                  </p>
                </v-col>
                <v-col class="text-right" cols="4">
                  <template v-if="wish.user.id === user.id" class="mr-2">
                    <v-btn
                      :loading="deleteIsLoading[wish.id]"
                      color="error"
                      icon
                      @click.stop="openDeletionConfirmation(wish)"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-btn
                      color="success"
                      icon
                      @click.stop="openWishEditing(wish)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-row>
        <v-dialog v-model="deleteConfirmation" max-width="500px">
          <v-card>
            <v-card-title>Are you sure about wish deleting?</v-card-title>
            <v-card-text>
              This action cannot be canceled and will delete wish <br/>
              <strong v-if="selectedWish">{{ selectedWish.name }}</strong
              >, that created
              <span v-if="selectedWish">{{
                  moment(selectedWish.creationTime).format('DD.MM.YYYY HH:mm')
                }}</span
              >.
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="deleteConfirmation = false">Cancel</v-btn>
              <v-btn
                color="error"
                depressed
                @click.stop="deleteWish(selectedWish)"
              >
                <v-icon left>mdi-delete</v-icon>
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-else-if="!loading && !wishes">
        <v-container>
          <v-row class="justify-center">
            <span>There is nothing, maybe you like to add new wish?</span>
          </v-row>
        </v-container>
      </template>
    </v-col>
  </v-layout>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import randomMC from 'random-material-color'
import moment from 'moment'

export default {
  name: 'wishes',
  data () {
    return {
      loading: false,
      deleteConfirmation: false,
      deleteIsLoading: {},
      editIsLoading: {},
      selectedWish: null,
      wishInEdit: {
        name: '',
        description: ''
      },
      rules: {
        name: [(val) => val.length > 0 || 'This field is required!'],
      },
      name: '',
      description: '',
      additionIsLoading: false,
      moment,
    }
  },
  created () {
    this.loading = true
  },
  mounted () {
    if (!this.accessToken) {
      this.loading = this.checkForToken()
    } else if (this.user) {
      this.getWishes()
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    } else {
      this.getUser()
        .then(() => {
          this.getWishes()
            .then(() => {
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {
          this.loading = false
          this.throwAccessDenied()
        })
    }
  },
  computed: {
    ...mapState('wishes', ['wishes']),
    ...mapState(['user', 'accessToken']),
    validName: function () {
      return this.wishInEdit.name.length > 0
    },
    validWish: function () {
      return this.name.length > 0
    },
  },
  methods: {
    ...mapActions('wishes', ['getWishes', 'addWish', 'addLike']),
    ...mapActions(['getUser', 'checkForToken']),
    ...mapMutations(['createNewAlert']),
    userFullname (user) {
      return user.firstName + ' ' + user.lastName
    },
    userInitials (user) {
      return user.firstName[0] + user.lastName[0]
    },
    avatarColor (fullName) {
      return randomMC.getColor({ text: fullName })
    },
    openDeletionConfirmation (wish) {
      this.deleteConfirmation = true
      this.selectedWish = wish
    },
    deleteWish (wish) {
      this.deleteConfirmation = false
      this.deleteIsLoading[wish.id] = true
      if (this.accessToken) {
        this.$store
          .dispatch('wishes/deleteWish', {
            wish: wish,
          })
          .then(() => {
            this.deleteIsLoading[wish.id] = false
            this.getWishes()
          })
          .catch(() => {
            this.deleteIsLoading[wish.id] = false
          })
      } else {
        this.deleteIsLoading[wish.id] = false
        this.throwAccessDenied()
      }
    },
    openWishEditing (wish) {
      this.wishInEdit = {
        id: wish.id,
        name: wish.name,
        description: wish.description,
      }
    },
    editWish (wish) {
      this.editIsLoading[wish.id] = true
      if (this.accessToken) {
        this.$store
          .dispatch('wishes/editWish', {
            wish: wish,
          })
          .then(() => {
            this.getWishes()
              .then(() => {
                this.wishInEdit = {}
                this.editIsLoading[wish.id] = false
              })
              .catch(() => {
                this.editIsLoading[wish.id] = false
              })
          })
      } else {
        this.editIsLoading[wish.id] = false
        this.throwAccessDenied()
      }
    },
    clearAdditionForm () {
      this.name = ''
      this.description = ''
      this.$refs.wishAdditionForm.resetValidation()
    },
    async wishAdding () {
      this.additionIsLoading = true
      this.addWish({
        name: this.name,
        description: this.description,
      })
        .then(() => {
          this.additionIsLoading = false
          this.getWishes()
          this.clearAdditionForm()
        })
        .catch(() => {
          this.additionIsLoading = false
        })
    },
    toggleLike(wish){
      this.$store.dispatch('wishes/addLike',{
        connection: wish.id
      }).then(()=> {
        this.getWishes()
      })
    }
  }
}
</script>

<style scoped>
</style>
