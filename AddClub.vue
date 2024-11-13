<template>
    <v-container>
      <h1>동아리 추가 페이지</h1>
  
      <!-- 동아리 추가 양식 -->
      <v-form ref="form" v-model="isFormValid">
        <v-text-field
          label="동아리 이름"
          v-model="clubName"
          required
        ></v-text-field>
  
        <v-text-field
          label="동아리 장 이름"
          v-model="leaderName"
          required
        ></v-text-field>
  
        <v-text-field
          label="동아리 장 학번"
          v-model="leaderId"
          required
        ></v-text-field>

        <v-text-field
          label="동아리 장 아이디"
          v-model="leaderMail"
          required
        ></v-text-field>
  
        <v-text-field
          label="지도 교수"
          v-model="advisor"
          required
        ></v-text-field>
  
        <v-text-field
          label="최대 인원수"
          v-model="maxMembers"
          type="number"
          required
        ></v-text-field>
  
        <v-text-field
          label="동아리 활동 날짜와 시간"
          v-model="activitySchedule"
          hint="예: 매주 화요일 5시"
          required
        ></v-text-field>
  
        <v-text-field
          label="태그 (콤마로 구분)"
          v-model="tags"
        ></v-text-field>
  
        <v-textarea
          label="한 줄 소개"
          v-model="description"
          rows="2"
          maxlength="100"
          hint="최대 100자까지 입력 가능합니다."
        ></v-textarea>
  
        <!-- 버튼 -->
        <v-row class="button-row" justify="space-between" align="center">
          <v-btn @click="navigateToSearch" color="grey" outlined>돌아가기</v-btn>
          <v-btn @click="registerClub" color="primary" :disabled="!isFormValid">등록</v-btn>
        </v-row>
      </v-form>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        clubName: '',
        leaderName: '',
        leaderId: '',
        advisor: '',
        maxMembers: '',
        activitySchedule: '',
        tags: '',
        description: '',
        isFormValid: false, // 폼 유효성 확인
      };
    },
    methods: {
      navigateToSearch() {
        this.$router.push({ name: 'clubSearch' }); // 동아리 검색 페이지로 이동
      },
      registerClub() {
        if (this.isFormValid) {
          console.log("동아리가 등록되었습니다.");
          // 동아리 등록 로직을 추가
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .button-row {
    margin-top: 20px;
  }
  </style>
  
  
