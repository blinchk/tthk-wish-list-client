import wishes from './modules/wishes'
import profile from './modules/profile'
import users from './modules/users'

const state = () => ({
  accessToken: null,
  alertNotification: {
    status: false,
    color: 'error',
    text: 'Unhandled error.'
  },
  user: null
})

const errors = {
  USER_REGISTERED_SUCCESSFULLY: 'User registered successfully.',
  ACCESS_DENIED: 'Sorry, you cannot use this page.'
}

const getters = {
  alertNotification (state) {
    return state.alertNotification
  },
  avatarInitials (state) {
    return state.user.firstName[0].toUpperCase() + state.user.lastName[0].toUpperCase()
  },
  fullName (state) {
    return state.user.firstName + ' ' + state.user.lastName
  }
}

const actions = {
  registerUser ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.post('/api/auth/register', {
        'email': payload.email,
        'password': payload.password,
        'firstName': payload.firstName,
        'lastName': payload.lastName
      })
        .then((response) => {
          if (response.status === 200) {
            commit('createNewAlert', {
              color: 'success',
              text: errors.USER_REGISTERED_SUCCESSFULLY
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
  authUser ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.post('/api/auth/login', {
        'email': payload.email,
        'password': payload.password
      })
        .then((response) => {
          if (response.data.success) {
            resolve(response.data)
            commit('setAccessToken', response.data.accessToken)
          } else if (response.status === 401) {
            commit('createNewAlert', {
              color: 'error',
              text: response.data.error
            })
          }
        }).catch((error) => {
        commit('createNewAlert', {
          color: 'error',
          text: error.response.data.error
        })
        reject(error)
      })
    })
  },
  getUser ({
    state,
    commit
  }) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/api/user/', {
        headers: {
          'Token': state.accessToken
        }
      })
        .then((response) => {
          if (response.data.success) {
            resolve(response.data)
            commit('setUser', response.data.user)
          } else if (response.status === 401) {
            commit('createNewAlert', {
              color: 'error',
              text: response.data.error
            })
          }
        }).catch((error) => {
        commit('createNewAlert', {
          color: 'error',
          text: error.response.data.error
        })
        reject(error)
      })
    })
  },
  logoutUser ({ commit }) {
    commit('deleteUserData', null)
  },
  userFullname (payload) {
    return payload.firstName + ' ' + payload.lastName
  },
  throwAccessDenied ({ commit }) {
    commit('createNewAlert', {
      'text': errors.ACCESS_DENIED,
      'color': 'error'
    })
    this.$router.push('/')
  },
  checkForToken ({
    state,
    dispatch
  }) {
    if (!state.accessToken) {
      dispatch('throwAccessDenied')
      return false
    }
    return true
  }
}
const mutations = {
  createNewAlert (state, payload) {
    state.alertNotification.text = payload.text
    state.alertNotification.color = payload.color
    state.alertNotification.status = true
  },
  setAlertStatus (state, payload) {
    state.alertNotification.status = payload
  },
  setAccessToken (state, payload) {
    state.accessToken = payload
    localStorage.setItem('token', payload)
  },
  deleteUserData (state) {
    state.user = null
    state.accessToken = null
    localStorage.removeItem('token')
  },
  setUser (state, payload) {
    state.user = payload
  }
}

const modules = {
  wishes,
  profile,
  users
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules
}
