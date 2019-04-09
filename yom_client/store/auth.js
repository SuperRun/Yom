const cookieparser = process.server ? require('cookieparser') : undefined
const state = () => ({
  auth:null
})
const mutations = {
  setAuth(state, auth) {
    state.auth = auth
  }
}
export default {
  namespaced: true,
  state,
  mutations
}
