// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
import { VCalendar } from 'vuetify/labs/VCalendar' // ✅ VCalendar 추가
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components: {
    ...components,
    VCalendar, // ✅ VCalendar 등록
  },
  directives,
})

export default vuetify  // ✅ 변수로 저장 후 export

