const state = () => ({
  users: null,
  wishes: null,
  profile: null
})

const getters = {}

const actions = {
  getUsers({commit, rootState}) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/api/user/users', {
        headers: {
          'Token': rootState.accessToken
        }
      }).then((response) => {
        if (response.status === 200) {
          commit('setUsers', response.data.users)
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
  getUserProfile({commit, rootState}, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/api/user/' + payload.id, {
        headers: {
          'Token': rootState.accessToken
        }
      }).then((response) => {
        if (response.status === 200) {
          commit('setProfile', response.data)
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
  followUser({commit, rootState}, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.post('/api/user/' + payload.id + '/follow', {},
        {
          headers: {
            'Token': rootState.accessToken
          }
        }).then((response) => {
        if (response.status === 200) {
          if (response.data.follow) {
            commit('createNewAlert', {
              color: 'success',
              text: 'User followed'
            }, {root: true})
          } else {
            commit('createNewAlert', {
              color: 'success',
              text: 'User unfollowed'
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
  }
}

const mutations = {
  setUsers(state, payload) {
    state.users = payload
  },
  setWishes(state, payload) {
    state.wishes = payload
  },
  setProfile(state, payload) {
    state.profile = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
