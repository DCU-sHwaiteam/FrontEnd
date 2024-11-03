<template>
    <v-container style="width: 450px" class="account">
      <v-layout align-center row wrap>
        <v-flex xs12>
          <v-alert v-if="isError" type="error">
            {{ errorMsg }}
          </v-alert>
          <v-card>
            <v-toolbar flat color="indigo">
              <v-toolbar-title
                ><span class="white--text">회원가입</span></v-toolbar-title
              >
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
                  v-model="formData.name"
                  :counter="10"
                  :rules="nameRules"
                  label="Name"
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
  
                <v-text-field
                  v-model="chkPassword"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min]"
                  :type="show ? 'text' : 'password'"
                  label="Enter Password Again"
                  hint="At least 8 characters"
                  counter
                  @click:append="show = !show"
                ></v-text-field>
  
                <h6 v-if="sameChk(chkPassword)" class="mb-5 teal--text accent-3">
                  Please create the two passwords identical.
                </h6>
                <h6 v-else class="mb-5 red--text lighten-2">
                  Please create the two passwords identical.
                </h6>
  
                <div class="mt-3 d-flex flex-row-reverse">
                  <v-btn color="error" class="mr-4" @click="reset"> 리셋 </v-btn>
  
                  <v-btn
                    :disabled="!valid"
                    color="blue"
                    class="mr-4"
                    @click="register(formData)"
                  >
                    회원가입
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
  // RegisterObj 모델 임포트
  import RegisterObj from "../store/resisterObj"
  import axios from "axios" // Axios 라이브러리 임포트
  
  export default {
    data: () => ({
      // 폼 데이터 및 유효성 관련 상태
      formData: new RegisterObj("", "", ""), // RegisterObj 인스턴스
      valid: false, // 폼 유효성 상태
      nameRules: [ // 이름 유효성 규칙
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 10) || "Name must be less than 10 characters"
      ],
      isError: false, // 에러 여부
      errorMsg: "", // 에러 메시지
      emailRules: [ // 이메일 유효성 규칙
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      show: false, // 비밀번호 보이기 여부
      chkPassword: "", // 비밀번호 확인 필드
      rules: { // 일반 유효성 규칙
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters"
      }
    }),
    methods: {
      // 메인 페이지로 이동하는 메소드
      goToMain() {
        this.$router.push({
          name: "login" // 로그인 페이지로 라우팅
        })
      },
      // 비밀번호 확인 일치 여부 체크하는 메소드
      sameChk(password) {
        if (this.formData.password == password) return true // 비밀번호가 일치하면 true 반환
        else {
          this.valid = false // 일치하지 않으면 유효성 false로 설정
          return false
        }
      },
      // 회원가입 처리하는 메소드
      register(RegisterObj) {
        // 이메일, 이름, 비밀번호 입력 여부 체크
        if (
          !this.formData.email ||
          !this.formData.name ||
          !this.formData.password
        ) {
          this.isError = true
          this.errorMsg = "이메일과 닉네임과 비밀번호를 모두 입력해주세요." // 에러 메시지 설정
          return
        }
        // Axios를 사용하여 서버에 회원가입 요청
        axios
          .post("/signup", RegisterObj)
          .then(() => {
            this.goToMain() // 성공 시 메인 페이지로 이동
          })
          .catch((err) => {
            if (err.response) {
              this.isError = true
              this.errorMsg = err.response.data.message // 에러 메시지 설정
            }
          })
      },
      // 폼 검증 메소드
      validate() {
        this.$refs.form.validate() // 폼 검증 수행
      },
      // 폼 리셋 메소드
      reset() {
        this.$refs.form.reset() // 폼 초기화
      },
      // 폼 유효성 리셋 메소드
      resetValidation() {
        this.$refs.form.resetValidation() // 유효성 초기화
      }
    }
  }
  </script>