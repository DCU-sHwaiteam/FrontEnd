<template>
    <v-container style="width: 450px" class="login">
      <v-layout align-center row wrap>
        <v-flex xs12>
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
                  v-model="formData.email"
                  :rules="emailRules"
                  label="Enter E-mail"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="formData.password"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show ? 'text' : 'password'"
                  label="Enter Password"
                  hint="At least 8 characters"
                  counter
                  @click:append="show = !show"
                ></v-text-field>

                <div class="mt-3 d-flex flex-row-reverse">
                  <v-btn color="error" class="mr-4" @click="reset"> 리셋 </v-btn>

                  <v-btn
                    color="primary"
                    class="mr-4"
                    link
                    router
                    :to="{ name: 'account' }"
                  >
                    회원가입
                  </v-btn>

                  <v-btn
                    :disabled="!valid"
                    color="success"
                    class="mr-4"
                    @click="login(formData)"
                  >
                    로그인
                  </v-btn>
                </div>
              </v-form>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
import LoginObj from "../store/loginObj";
import axios from "axios";

export default {
  data: () => ({
    formData: new LoginObj("", ""),
    valid: false,
    isError: false,
    errorMsg: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    show: false,
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 8 || "Min 8 characters"
    }
  }),
  methods: {
    login(LoginObj) {
      // 이메일과 비밀번호가 입력되었는지 체크
      if (!this.formData.email || !this.formData.password) {
        this.isError = true;
        this.errorMsg = "이메일과 비밀번호를 입력해주세요.";
        return;
      }
      // Axios를 사용하여 서버에 로그인 요청
      axios
        .post("/signin", LoginObj)
        .then((res) => {
          // 로그인 성공 시 토큰을 로컬 스토리지에 저장
          let token = res.data.token;
          localStorage.setItem("access_token", token);
          this.$store.dispatch("getAccountInfo"); // 사용자 정보를 가져오는 스토어 액션 호출
          this.$router.push({ name: "MainPage" }); // 메인 페이지로 이동
        })
        .catch((err) => {
          if (err.response) {
            this.isError = true;
            this.errorMsg = err.response.data.message; // 에러 메시지 설정
          }
        });
    },
    validate() {
      this.$refs.form.validate(); // 폼 검증 수행
    },
    reset() {
      this.$refs.form.reset(); // 폼 초기화
    },
    resetValidation() {
      this.$refs.form.resetValidation(); // 유효성 초기화
    }
  }
}
</script>

----------------------------------------
#학생정보 백엔드 구축되기 전까지 임의로 아이디 비번 설정해서 로그인 되게 하였음
# 아이디 : user1@cu.ac.kr 비밀번호 : 123456789
<template>
  <v-container style="width: 450px" class="login">
    <v-layout align-center row wrap>
      <v-flex xs12>
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
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
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
      // 가상의 사용자 데이터
      users: [
        { username: 'user1@cu.ac.kr', password: '123456789' },
        { username: 'user2', password: 'pass2' },
      ],
    };
  },
  methods: {
    login() {
      // 입력한 ID와 비밀번호가 배열에 존재하는지 확인
      const user = this.users.find(
        (user) =>
          user.username === this.inputUsername &&
          user.password === this.inputPassword
      );

      if (user) {
        // 성공: 페이지 이동 (예: 메인 페이지로)
        this.$router.push({ name: 'mainPage' });
      } else {
        // 실패: 에러 메시지 표시
        this.isError = true;
        this.errorMsg = '아이디 또는 비밀번호가 잘못되었습니다.';
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


