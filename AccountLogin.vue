<template>
  <v-container style="width: 450px" class="login">
    <v-layout align-center row wrap>
      <v-col cols="12">
        <v-alert v-if="isError" type="error">
          {{ errorMsg }}
        </v-alert>
        <v-card>
          <v-toolbar flat color="indigo">
            <v-toolbar-title>
              <span class="white--text">로그인</span>
            </v-toolbar-title>
          </v-toolbar>
          <div class="pa-5">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="inputUsername"
                :rules="[rules.required]"
                label="아이디"
                required
              ></v-text-field>

              <v-text-field
                v-model="inputPassword"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="show ? 'text' : 'password'"
                label="비밀번호"
                hint="최소 8자"
                counter
                @click:append="show = !show"
              ></v-text-field>

              <div class="mt-3 d-flex flex-row-reverse">
                <v-btn color="error" class="mr-4" @click="reset">리셋</v-btn>

                <v-btn color="primary" class="mr-4" link router :to="{ name: 'account' }">
                  회원가입
                </v-btn>

                <v-btn
                  :disabled="!valid"
                  color="success"
                  class="mr-4"
                  @click="login"
                >
                  로그인
                </v-btn>
              </div>
            </v-form>
          </div>
        </v-card>
      </v-col>
    </v-layout>
  </v-container>
</template>

<script>
import { login } from "@/services/authService"; // 로그인 API 추가

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
      // 👉 MOCK 활성화 여부 확인
      const useMock = process.env.VUE_APP_USE_MOCK === 'true';

      if (useMock) {
        // ✅ 목업 로그인: 테스트 계정 "test@example.com" / "password123"
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

      // ✅ 실제 백엔드 로그인
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


