import newProj from './modules/newProj';
import indexedDB from './modules/indexedDB'
import cookieparser from 'cookieparser'

export  const namespaced = true;

export const modules ={
    newProj,
    indexedDB
}

export const actions ={
  nuxtServerInit({ commit }, { req }) {
    let auth = null
    let id = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        auth = JSON.parse(parsed.auth)
          id = JSON.parse(parsed.id)
      } catch (err) {
        // No valid cookie found
          console.log('No valid cookie')
      }
    }
    commit('auth/setAuth', auth)
    commit('auth/setId', id)
  }
}
