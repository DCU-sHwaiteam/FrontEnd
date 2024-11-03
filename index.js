#store/index.js
import { createStore } from 'vuex';
import axios from 'axios';


// Vuex 스토어를 생성하여 export
export default createStore({
  // state: 컴포넌트에서 공유할 수 있는 상태를 정의
  state: {
    userInfo: null,    // 사용자 정보를 저장할 상태
    isLogin: false     // 사용자가 로그인 상태인지 확인하는 상태
  },
  // mutations: state를 변경하는 동기 메서드를 정의
  mutations: {
    // loginSuccess: 로그인 성공 시 호출되며 사용자 정보를 state에 저장한다
    loginSuccess(state, payload) {
      state.isLogin = true           // 로그인 상태를 true로 설정
      state.userInfo = payload       // payload를 userInfo에 저장
    },
    // logout: 로그아웃 시 호출되며 로그인 상태와 사용자 정보를 초기화한다
    logout(state) {
      state.isLogin = false          // 로그인 상태를 false로 설정
      state.userInfo = null          // userInfo를 null로 초기화
      localStorage.removeItem("access_token") // 로컬 스토리지에서 액세스 토큰 삭제
    }
  },
  // actions: 비동기 작업을 수행하고 mutation을 호출하는 메서드를 정의한다
  actions: {
    // getAccountInfo: 서버로부터 사용자 정보를 가져오는 함수
    getAccountInfo({ commit }) {
      // 로컬 스토리지에서 access_token을 가져온다.
      let token = localStorage.getItem("access_token")
      axios
        .get("/userinfo", {
          headers: {
            "X-AUTH-TOKEN": token   // 요청 헤더에 X-AUTH-TOKEN으로 토큰 추가
          }
        })
        .then((response) => {
          // 서버 응답이 성공적이면 loginSuccess mutation을 호출하여 사용자 정보를 저장한다.
          commit("loginSuccess", response.data.data)
        })
        .catch((error) => {
          // 오류가 발생할 경우 에러 로그를 콘솔에 출력한다.
          console.log(error)
        })
    }
  },
  // modules: 상태를 모듈별로 나누어 관리할 때 사용합니다 (현재는 빈 객체로 설정).
  modules: {}
})

#router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AccountRegister from '@/views/AccountRegister.vue'
import AccountLogin from '@/views/AccountLogin.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/account',
    name: 'account',
    component: AccountRegister
  },
  {
    path: '/login',
    name: 'login',
    component: AccountLogin
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router


