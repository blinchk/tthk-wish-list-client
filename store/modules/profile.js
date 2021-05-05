const state = () => ({
  profile: null
})

const getters = {}

const actions = {
  getProfile({commit, rootState}) {
    return new Promise(((resolve, reject) => {
      this.$axios.get('/api/user/', {
        headers: {
          'Token': rootState.accessToken
        }
      }).then((response) => {
        if (response.status === 200) {
          commit('setProfile', response.data.user)
          resolve(response.data.user)
        }
      }).catch((error) => {
        if (error.response.status === 401) {
          commit('createNewAlert', {
            color: 'error',
            text: 'User is not authorized'
          }, {root: true})
        } else {
          commit('createNewAlert', {
            color: 'error',
            text: error.response.data.error
          }, {root: true})
        }
        reject()
      })
    }))
  },
  editProfile({commit, rootState, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.post('/api/user/', {
          'firstName': payload.firstName,
          'lastName': payload.lastName,
        },
        {
          headers: {
            'Token': rootState.accessToken
          }
        }).then((response) => {
        if (response.status === 200) {
          commit('createNewAlert', {
            color: 'success',
            text: 'Profile updated'
          }, {root: true})
          commit('setProfile', response.data.user)
          dispatch('getUser', null, {root: true})
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
  }
}

const mutations = {
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
