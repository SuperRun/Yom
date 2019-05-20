import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
import pkg from './package'

export default {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    {
        src: '~/plugins/easyRefresh.js',
        ssr: false
    }
    // {
    //     src: '~/plugins/regist-sw.js',
    //     ssr: false
    // }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/onesignal',
    '@nuxtjs/pwa',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
      baseURL: 'https://strapiserver.herokuapp.com' // 'http://localhost:1337'
  },
  workbox: {
      // Workbox options
      // swURL: 'custom-sw.js',
      config: { modulePathPrefix: '/workbox-v4.3.1' },
      cachingExtensions: '@/plugins/background-sync.js'
  },
  oneSignal: {
    init: {
        appId: '02440743-6079-4840-b62b-d4213d2989c0',
        allowLocalhostAsSecureOrigin: true,
        welcomeNotification: {
            disable: true
        }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },
  env: {
    baseUrl: process.env.BASE_URL || 'https://strapiserver.herokuapp.com'
  } // 'http://localhost:1337'
}
