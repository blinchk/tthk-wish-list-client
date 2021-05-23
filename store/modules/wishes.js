const state = () => ({
  wishes: null,
  likes: null,
})

const getters = {}

const actions = {
  getWishes({
              commit,
              rootState
            }) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/api/user/' + rootState.user.id + '/wishes',
        {
          headers: {
            'Token': rootState.accessToken
          }
        }).then((response) => {
        if (response.status === 200) {
          commit('setWishes', response.data.wishes)
          resolve()
        }
      }).catch((error) => {
        if (error.response.data.error) {
          commit('createNewAlert', {
            'text': error.response.data.error,
            'color': 'error'
          }, {root: true})
        } else {
          commit('createNewAlert', {
            'text': error,
            'color': 'error'
          }, {root: true})
        }
        reject(error)
      })
    })
  },
  addWish({commit, rootState}, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.put('api/wish/', {
          'name': payload.name,
          'description': payload.description
        },
        {
          headers: {
            'Token': rootState.accessToken
          }
        })
        .then((response) => {
          if (response.status === 200) {
            commit('createNewAlert', {
              color: 'success',
              text: 'Wish added'
            }, {root: true})
            resolve()
          }
        }).catch((error) => {
        if (error.response.status === 409) {
          commit('createNewAlert', {
            color: 'error',
            text: 'This wish already exists'
          }, {root: true})
        } else {
          commit('createNewAlert', {
            color: 'error',
            text: error.response.data.error
          }, {root: true})
        }
        reject()
      })
    })
  },
  deleteWish({
               commit,
               rootState
             }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.delete('/api/wish/' + payload.wish.id,
        {
          headers: {
            'Token': rootState.accessToken
          }
        })
        .then((response) => {
          if (response.status === 200) {
            commit('createNewAlert', {
              color: 'success',
              text: 'Wish deleted'
            }, {root: true})
            resolve()
          }
        }).catch((error) => {
        if (error.response.status === 401) {
          commit('createNewAlert', {
            color: 'error',
            text: 'Not authorized'
          }, {root: true})
        } else {
          commit('createNewAlert', {
            color: 'error',
            text: error.response.data.error
          })
        }
        reject()
      })
    })
  },
  editWish({
             commit,
             rootState
           }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.patch('/api/wish/',
        {
          'id': payload.wish.id,
          'name': payload.wish.name,
          'description': payload.wish.description
        },
        {
          headers: {
            'Token': rootState.accessToken
          }
        })
        .then((response) => {
          if (response.status === 200) {
            commit('createNewAlert', {
              color: 'success',
              text: 'Wish edited'
            }, {root: true})
            resolve()
          }
        }).catch((error) => {
        if (error.response.status === 401) {
          commit('createNewAlert', {
            color: 'error',
            text: 'Not authorized'
          }, {root: true})
        } else {
          commit('createNewAlert', {
            color: 'error',
            text: error.response.data.error
          }, {root: true})
        }
        reject()
      })
    })
  },
  addLike({commit, rootState}, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.post('api/wish/like', {
          'connection': payload.connection,
          'connection_type': 'wishes'
        },
        {
          headers: {
            'Token': rootState.accessToken
          }
        })
        .then((response) => {
          if (response.status === 200) {
            if (response.data.liked) {
              commit('createNewAlert', {
                color: 'success',
                text: 'Wish liked'
              }, {root: true})
            } else {
              commit('createNewAlert', {
                color: 'success',
                text: 'Wish unliked'
              }, {root: true})
            }
            resolve()
          }
        }).catch((error) => {
        if (error.response.data.error) {
          commit('createNewAlert', {
            'text': error.response.data.error,
            'color': 'error'
          }, {root: true})
        } else {
          commit('createNewAlert', {
            'text': error,
            'color': 'error'
          }, {root: true})
        }
        reject(error)
      })
    })
  },
  peopleLiked({commit, rootState}, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.get('api/wish/' + payload.wish.id + '/likes', {
        headers: {
          'Token': rootState.accessToken
        }
      }).then((response) => {
        if (response.status === 200) {
          commit('setLikes', response.data.likes)
          resolve(response.data.likes)
        }
      }).catch((error) => {
        if (error.response.data.error) {
          commit('createNewAlert', {
            'text': error.response.data.error,
            'color': 'error'
          }, {root: true})
        }
        reject(error)
      })

    })
  }
}

const mutations = {
  setWishes(state, payload) {
    state.wishes = payload
  },
  setLikes(state, payload) {
    state.likes = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
