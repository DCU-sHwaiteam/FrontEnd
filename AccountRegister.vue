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

    <!-- 중앙 회원가입 카드 -->
    <v-container
      class="fill-height d-flex align-center justify-center signup-bg"
      style="background: #fff; min-height: 80vh;"
    >
      <v-card
        class="mx-auto pa-0"
        width="430"
        elevation="2"
        style="border-radius: 20px; overflow: hidden;"
      >
        <v-card-title class="justify-center" style="font-size:1.4rem; font-weight:bold; letter-spacing:0.05em; margin-top:32px;">
          회원가입
        </v-card-title>
        <v-card-text class="pb-0 pt-4 px-6">
          <v-alert v-if="isError" type="error" dense class="mb-4">
            {{ errorMsg }}
          </v-alert>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="formData.email"
              :rules="emailRules"
              label="이메일"
              required
              dense
              outlined
              rounded
              class="mb-4 signup-input"
              hide-details="auto"
            ></v-text-field>

            <v-text-field
              v-model="formData.name"
              :counter="10"
              :rules="nameRules"
              label="이름"
              required
              dense
              outlined
              rounded
              class="mb-4 signup-input"
              hide-details="auto"
            ></v-text-field>

            <v-text-field
              v-model="formData.studentId"
              :rules="studentIdRules"
              label="학번"
              required
              dense
              outlined
              rounded
              class="mb-4 signup-input"
              hide-details="auto"
            ></v-text-field>

            <v-text-field
              v-model="formData.department"
              :rules="departmentRules"
              label="학과"
              required
              dense
              outlined
              rounded
              class="mb-4 signup-input"
              hide-details="auto"
            ></v-text-field>

            <v-text-field
              v-model="formData.phone"
              :rules="phoneRules"
              label="전화번호"
              required
              dense
              outlined
              rounded
              class="mb-4 signup-input"
              hide-details="auto"
            ></v-text-field>

            <v-text-field
              v-model="formData.password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show ? 'text' : 'password'"
              label="비밀번호"
              hint="최소 8자"
              counter
              dense
              outlined
              rounded
              class="mb-4 signup-input"
              hide-details="auto"
              @click:append="show = !show"
            ></v-text-field>

            <v-text-field
              v-model="chkPassword"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show ? 'text' : 'password'"
              label="비밀번호 확인"
              hint="최소 8자"
              counter
              dense
              outlined
              rounded
              class="mb-4 signup-input"
              hide-details="auto"
              @click:append="show = !show"
            ></v-text-field>

            <div class="mb-4" style="min-height:24px;">
              <span v-if="sameChk(chkPassword)" class="teal--text accent-3" style="font-size:0.9rem;">
                비밀번호가 일치합니다.
              </span>
              <span v-else class="red--text lighten-2" style="font-size:0.9rem;">
                비밀번호가 일치하지 않습니다.
              </span>
            </div>

            <div class="d-flex justify-center signup-btn-group">
              <v-btn
                color="#828191"
                class="mr-2 white--text"
                style="min-width:110px; font-weight:bold;"
                @click="goToLogin"
              >
                돌아가기
              </v-btn>
              <v-btn
                :disabled="!valid"
                color="#8f9cfb"
                class="mr-2 white--text"
                style="min-width:110px; font-weight:bold;"
                @click="register(formData)"
              >
                회원가입
              </v-btn>
              <v-btn
                color="#f5a2a2"
                class="white--text"
                style="min-width:110px; font-weight:bold;"
                @click="reset"
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
import { register } from "@/services/authService";
import RegisterObj from "../store/resisterObj";

export default {
  data: () => ({
    formData: new RegisterObj("", "", "", "", "", ""),
    valid: false,
    isError: false,
    errorMsg: "",
    show: false,
    chkPassword: "",
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 8 || "Min 8 characters",
    },
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
    ],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    studentIdRules: [(v) => !!v || "Student ID is required"],
    departmentRules: [(v) => !!v || "Department is required"],
    phoneRules: [
      (v) => !!v || "Phone number is required",
      (v) => /^\d{10,11}$/.test(v) || "Enter a valid phone number",
    ],
  }),
  methods: {
    goToLogin() {
      this.$router.push({ name: "login" });
    },
    sameChk(password) {
      return this.formData.password === password && password?.length > 0;
    },
    async register() {
      if (
        !this.formData.email ||
        !this.formData.name ||
        !this.formData.studentId ||
        !this.formData.department ||
        !this.formData.phone ||
        !this.formData.password
      ) {
        this.isError = true;
        this.errorMsg = "모든 필드를 입력해주세요.";
        return;
      }

      try {
        await register(this.formData);
        this.$router.push({ name: "login" });
      } catch (err) {
        this.isError = true;
        this.errorMsg = err.message || "회원가입에 실패했습니다.";
      }
    },
    reset() {
      this.formData = new RegisterObj("", "", "", "", "", "");
      this.chkPassword = "";
      this.isError = false;
      this.errorMsg = "";
    },
  },
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
.v-card {
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
.v-card-title {
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  margin-top: 2rem;
}
.signup-input input {
  background: #e9e9e9 !important;
  border-radius: 20px !important;
}
.signup-input .v-input__control {
  border-radius: 20px !important;
}
.signup-btn-group {
  margin-bottom: 16px;
  margin-top: 12px;
}
.v-btn {
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.07);
}
.v-card-text {
  padding-top: 24px !important;
  padding-bottom: 24px !important;
}
.signup-bg {
  padding-top: 100px;
}
</style>




