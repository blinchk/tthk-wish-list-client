const state = () => ({
  wishes: null
})

const getters = {}

const actions = {
  getWishes({commit}) {
    return new Promise((resolve, reject) => {
      this.$axios.get('/api/wishes/recieve/3',
        {
          headers: {
            'Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJ1c2VyX25hbWUiOiJiY2hpazNAZ21haWwuY29tIn0.lezSJ5isKoc7NzcfDQ2hwVSJAV-76BoqWRPXegU2Iac'
          }
      }).then((response) => {
        if (response.status === 200) {
          commit('setWishes', response.data.wishes)
          resolve()
        }
      }).catch((error) => {
        reject(error)
      })
    })
  }
}

const mutations = {
  setWishes(state, payload) {
    state.wishes = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
