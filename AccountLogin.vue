<template>
  <v-app>
    <!-- 상단 브랜드 바 -->
    <v-app-bar
      flat
      color="#aee3fa"
      height="80"
      style="box-shadow:none;"
    >
      <v-container class="d-flex align-center pa-0" style="height:100%; max-width: 1200px;">
        <div class="d-flex align-center ml-4">
          <v-img
            src="/static/images/logo.png"
            alt="체크인클럽"
            contain
            max-height="50"
            max-width="50"
            class="mr-2"
          />
          <span class="font-weight-bold" style="font-size: 1.5rem; color: #2c3e50;">체크인클럽</span>
        </div>
      </v-container>
    </v-app-bar>

    <!-- 중앙 로그인 카드 -->
    <v-container
      class="fill-height d-flex align-center justify-center"
      style="background: #fff; min-height: 80vh;"
    >
      <v-card
        class="mx-auto pa-0"
        width="350"
        elevation="2"
        style="border-radius: 20px; overflow: hidden;"
      >
        <div style="background: #aee3fa; padding: 24px 0 0 0;">
          <v-img
            src="/static/images/logo.png"
            alt="체크인클럽"
            contain
            max-height="80"
            max-width="80"
            class="mx-auto mb-2"
          />
        </div>
        <v-card-text class="pb-0 pt-4 px-6">
          <v-alert v-if="isError" type="error" dense class="mb-4">
            {{ errorMsg }}
          </v-alert>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="inputUsername"
              :rules="[rules.required]"
              label="아이디"
              dense
              outlined
              rounded
              class="mb-4"
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              v-model="inputPassword"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show ? 'text' : 'password'"
              label="비밀번호"
              dense
              outlined
              rounded
              class="mb-2"
              hide-details="auto"
              @click:append="show = !show"
            ></v-text-field>
            <v-btn
              :disabled="!valid"
              color="#aee3fa"
              class="white--text mb-2"
              block
              large
              style="font-weight:bold;"
              @click="login"
            >
              체크인클럽 로그인
            </v-btn>
            <div class="d-flex justify-center">
              <v-btn
                color="primary"
                text
                class="mr-2"
                router
                :to="{ name: 'account' }"
                style="min-width:100px;"
              >
                회원가입
              </v-btn>
              <v-btn
                color="grey"
                text
                @click="reset"
                style="min-width:100px;"
              >
                리셋
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import { login } from "@/services/authService";

export default {
  data() {
    return {
      inputUsername: '',
      inputPassword: '',
      valid: false,
      isError: false,
      errorMsg: '',
      show: false,
      rules: {
        required: (value) => !!value || '필수 항목입니다.',
        min: (v) => v.length >= 8 || '최소 8자',
      },
    };
  },
  methods: {
    async login() {
      const useMock = process.env.VUE_APP_USE_MOCK === 'true';
      if (useMock) {
        if (
          this.inputUsername === 'test@example.com' &&
          this.inputPassword === 'password123'
        ) {
          localStorage.setItem("token", "mock-token-1234");
          this.$router.push({ name: "mainPage" });
          return;
        } else {
          this.isError = true;
          this.errorMsg = "아이디 또는 비밀번호가 잘못되었습니다. (Mock)";
          return;
        }
      }
      try {
        const response = await login(this.inputUsername, this.inputPassword);
        localStorage.setItem("token", response.token);
        this.$router.push({ name: "mainPage" });
      } catch (error) {
        this.isError = true;
        this.errorMsg = "아이디 또는 비밀번호가 잘못되었습니다.";
      }
    },
    reset() {
      this.inputUsername = '';
      this.inputPassword = '';
      this.isError = false;
      this.errorMsg = '';
    },
  },
};
</script>

<style scoped>
/* 로고 텍스트 정렬 개선 */
.v-app-bar .v-container {
  justify-content: flex-start !important;
  padding-left: 20px !important;
}

/* 중앙 카드 로고 크기 조정 */
.v-card div[style*="background: #aee3fa"] .v-img {
  transition: all 0.3s;
}

/* 입력 필드 포커스 효과 */
.v-text-field--outlined >>> fieldset {
  border-color: #aee3fa !important;
}

.v-text-field--outlined.v-input--is-focused >>> fieldset {
  border-color: #2c3e50 !important;
}


.v-card-text {
  padding-top: 24px !important;
  padding-bottom: 24px !important;
  margin-bottom: 16px; /* 버튼과 테두리 사이 간격 추가 */
}

/* 버튼 컨테이너에 추가 여백 주기 */
.d-flex.justify-center {
  margin-bottom: 16px;
}

</style>





