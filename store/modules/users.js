const state = () => ({
  users: null
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
  }
}

const mutations = {
  setUsers(state, payload) {
    state.users = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
