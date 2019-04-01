import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  theme: {
    primary: colors.blue.darken2,
    accent: colors.grey.darken3,
    secondary: colors.amber.darken3,
    info: colors.teal.lighten1,
    warning: colors.amber.base,
    error: colors.deepOrange.accent4,
    success: colors.green.accent3,
    themeColor: '#D4A079',
    lighter: '#F5EEE6',
    timelineColor1: '#d09796',
    timelineColor2: '#91dccb',
    timelineColor3: '#d9b780',

  }
})
