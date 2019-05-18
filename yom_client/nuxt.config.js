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
    '~/assets/style/app.styl',
    '~/assets/style/main.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/axios',
<<<<<<< HEAD
    { src: '~/plugins/regist-sw.js', ssr: false},
    { src: '~/plugins/easyRefresh.js', ssr: false},
    { src: '~plugins/ga.js', ssr: false }
=======
    // {
    //     src: '~/plugins/regist-sw.js',
    //     ssr: false
    // },
    {
        src: '~/plugins/easyRefresh.js',
        ssr: false
    }

>>>>>>> 9ca7893138efeae51b4bf3c07da9ee7ebf6de14e
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
      '@nuxtjs/onesignal',
      '@nuxtjs/pwa',
  ],
  router: {
    prefetchLinks: false
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
  ** Customize app manifest
  */
  manifest: {
      name: "YOM"
  },
  workbox: {
      swURL: 'custom-sw.js'
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
  }, // 'https://strapiserver.herokuapp.com'
  env: {
    baseUrl: 'https://strapiserver.herokuapp.com'
  }
}