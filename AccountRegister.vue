<template>
  <v-container style="width: 450px" class="account">
    <v-layout align-center row wrap>
      <v-flex xs12>
        <v-alert v-if="isError" type="error">
          {{ errorMsg }}
        </v-alert>
        <v-card>
          <v-toolbar flat color="indigo">
            <v-toolbar-title>
              <span class="white--text">회원가입</span>
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
                v-model="formData.name"
                :counter="10"
                :rules="nameRules"
                label="이름"
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.studentId"
                :rules="studentIdRules"
                label="학번"
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.department"
                :rules="departmentRules"
                label="학과"
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.phone"
                :rules="phoneRules"
                label="전화번호"
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
                <v-btn color="error" class="mr-4" @click="reset">리셋</v-btn>

                <v-btn
                  :disabled="!valid"
                  color="blue"
                  class="mr-4"
                  @click="register(formData)"
                >
                  회원가입
                </v-btn>

                <v-btn color="grey" class="mr-4" @click="goToLogin">
                  돌아가기
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
import { register } from "@/services/authService"; // 서비스 파일 import
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
      return this.formData.password === password;
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
        this.$router.push({ name: "login" }); // 회원가입 후 로그인 페이지로 이동
      } catch (err) {
        this.isError = true;
        this.errorMsg = err.message || "회원가입에 실패했습니다.";
      }
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>
