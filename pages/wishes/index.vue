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
                  <v-btn v-if="wish.likes" icon @click.stop="showLiked(wish)">
                    {{ wish.likes }}
                  </v-btn>
                  <v-dialog v-model="showPeople" max-width="500px">
                    <v-card>
                      <v-card-title>People who liked this wish...</v-card-title>
                      <v-card-text v-for="like in likes" :key="like.id">
                        <v-avatar :color="avatarColor(userFullname(like.user))" class="mr-1" size="35">
                          {{ userInitials(like.user) }}
                        </v-avatar>
                        {{ like.user.firstName }} {{ like.user.lastName }}
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                  <v-btn :color="wish.liked ? 'pink' : 'white' " icon @click.stop="toggleLike(wish)">
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
                    <v-btn :color="wish.gifted ? 'pink' : 'white'" icon @click.stop="openGiftEditing(wish)">
                      <v-icon>
                        mdi-gift
                      </v-icon>
                    </v-btn>
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
        <v-dialog v-model="giftEditing" max-width="500px">
          <v-card v-if="selectedWish">
            <v-card-title class="justify-space-between" v-if="selectedWish.gifted"><span>Gift Editing</span>
              <v-btn icon color="error" @click.stop="deleteGift(selectedWish)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-title v-else>Adding Wish</v-card-title>
            <v-card-text>
              <v-row class="justify-end">
                <v-switch v-model="giftWithUrl" label="Link URL to gift"/>
              </v-row>
              <v-text-field label="Gift Title" v-model="giftTitle"></v-text-field>
              <v-expand-transition>
                <v-text-field v-if="giftWithUrl" v-model="giftLink" label="Gift URL"></v-text-field>
              </v-expand-transition>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click.stop="giftEditing = false; cleanGiftFields()">Cancel</v-btn>
              <v-btn color="primary" v-if="selectedWish.gifted" @click.stop="changeGift()">
                <v-icon left>mdi-pencil</v-icon>
                Edit gift
              </v-btn>
              <v-btn color="success" v-else @click.stop="toggleGift(selectedWish)">
                <v-icon left>mdi-plus</v-icon>
                Add gift
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
import {mapActions, mapMutations, mapState} from 'vuex'
import randomMC from 'random-material-color'
import moment from 'moment'

export default {
  name: 'wishes',
  data() {
    return {
      loading: false,
      deleteConfirmation: false,
      giftEditing: false,
      deleteIsLoading: {},
      showPeople: false,
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
      giftTitle: '',
      giftLink: '',
      selectedGift: '',
      items: null,
      additionIsLoading: false,
      giftWithUrl: false,
      moment,
    }
  },
  created() {
    this.loading = true
  },
  mounted() {
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
    ...mapState('wishes', ['wishes', 'likes', 'gift']),
    ...mapState(['user', 'accessToken']),
    validName: function () {
      return this.wishInEdit.name.length > 0
    },
    validWish: function () {
      return this.name.length > 0
    },
  },
  methods: {
    ...mapActions('wishes', ['getWishes', 'getGifts', 'addWish']),
    ...mapActions(['getUser', 'checkForToken']),
    ...mapMutations(['createNewAlert']),
    userFullname(user) {
      return user.firstName + ' ' + user.lastName
    },
    userInitials(user) {
      return user.firstName[0] + user.lastName[0]
    },
    avatarColor(fullName) {
      return randomMC.getColor({text: fullName})
    },
    openDeletionConfirmation(wish) {
      this.deleteConfirmation = true
      this.selectedWish = wish
    },
    deleteWish(wish) {
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
      this.selectedWish = null
    },
    openWishEditing(wish) {
      this.wishInEdit = {
        id: wish.id,
        name: wish.name,
        description: wish.description,
      }
    },
    openGiftEditing(wish) {
      this.selectedWish = wish
      this.giftEditing = true
      if(wish.gifted){
        this.getGiftByWish(wish)
      }

    },
    editWish(wish) {
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
    clearAdditionForm() {
      this.name = ''
      this.description = ''
      this.$refs.wishAdditionForm.resetValidation()
    },
    async wishAdding() {
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

    toggleLike(wish) {
      this.$store.dispatch('wishes/addLike', {
        connection: wish.id
      }).then(() => {
        this.getWishes()
      })
    },
    showLiked(wish) {
      this.showPeople = true
      this.$store.dispatch('wishes/peopleLiked', {
        wish: wish
      })
    },
    toggleGift(wish) {
      this.$store.dispatch('wishes/addGift', {
        wish: wish,
        title: this.giftTitle,
        link: this.giftLink
      }).then(() => {
        this.giftEditing = false
        this.getWishes()
        this.cleanGiftFields()
      })
    },
    changeGift() {
      this.$store.dispatch('wishes/changeGift', {
        id: this.selectedGift,
        title: this.giftTitle,
        link: this.giftLink
      }).then(() => {
        this.giftEditing = false
        this.getWishes()
        this.cleanGiftFields()
      })
    },
    deleteGift(wish) {
      this.$store.dispatch('wishes/deleteGift', {
        wish: wish
      }).then(() => {
        this.giftEditing = false
        this.getWishes()
        this.cleanGiftFields()
      })
    },
    getGiftByWish(wish){
      this.$store.dispatch('wishes/getGiftByWish',{
        wish: wish
      }).then( gift =>{
        this.selectedGift = gift.id
        this.giftTitle = gift.title
        if(gift.link){
          this.giftLink = gift.link
          this.giftWithUrl = true
        }

      })
    },
    cleanGiftFields(){
      this.giftLink = ''
      this.giftTitle = ''
    }
  }
}
</script>

<style scoped>
</style>
