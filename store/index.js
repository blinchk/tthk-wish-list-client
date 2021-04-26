const state = () => ({
  accessToken: null,
  authorized: false,
  alertNotification: {
    status: false,
    color: null,
    text: 'Unhandled error.'
  }
})

const getters = {
  alertNotification(state) {
    return state.alertNotification
  }
}

const actions = {
  registerUser ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.post('/api/auth/register', {
        'username': payload.username,
        'password': payload.password,
        'firstName': payload.firstName,
        'lastName': payload.lastName
      })
      .then((response) => {
        if (response.data.success) {
          commit('createNewAlert', {
            color: 'success',
            text: 'User registered successfully'
          })
          resolve()
        }
      }).catch((error) => {
        if (error.response.status === 409) {
          commit('createNewAlert', {
            color: 'error',
            text: 'Username is already taken!'
          })
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

}
const mutations = {
  createNewAlert(state, payload) {
    state.alertNotification.text = payload.text
    state.alertNotification.color = payload.color
    state.alertNotification.status = true;
  },
  setAlertStatus(state, payload) {
    state.alertNotification.status = payload;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
