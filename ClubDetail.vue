<template>
    <v-container>
      <h2>{{ club.name }} 출석체크</h2>
  
      <!-- 출석체크 기능 -->
      <v-btn color="primary" @click="markAttendance">출석 체크</v-btn>
  
      <!-- 가입 신청 검토 아이콘 버튼 -->
      <v-btn icon color="primary" @click="openApplicationReview">
        <v-icon>mdi-account-check</v-icon>
      </v-btn>
  
      <!-- 가입 신청 검토 팝업 -->
      <v-dialog v-model="applicationDialog" max-width="600px">
        <v-card>
          <v-card-title>가입 신청 검토</v-card-title>
          <v-card-text>
            <!-- 가입 신청 내역 표시 -->
            <div v-for="applicant in club.applications" :key="applicant.id">
              <p>{{ applicant.name }} ({{ applicant.id }})</p>
              <v-btn @click="approveApplicant(applicant.id)">승인</v-btn>
              <v-btn @click="rejectApplicant(applicant.id)">거부</v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="grey" @click="applicationDialog = false">닫기</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  export default {
    props: ['id'], // 라우트에서 전달받은 동아리 ID
    data() {
      return {
        club: {}, // 동아리 정보 저장
        applicationDialog: false
      };
    },
    created() {
      this.loadClubData();
    },
    methods: {
      loadClubData() {
        // 이곳에서 동아리 데이터를 불러옵니다 (예: API 또는 스토어에서 가져오기)
        this.club = {
          name: "동아리 이름",
          applications: [
            { id: "1001", name: "회원1" },
            { id: "1002", name: "회원2" }
          ]
        };
      },
      markAttendance() {
        console.log("출석 체크 완료");
      },
      openApplicationReview() {
        this.applicationDialog = true;
      },
      approveApplicant(id) {
        console.log(`${id} 회원 승인`);
      },
      rejectApplicant(id) {
        console.log(`${id} 회원 거부`);
      }
    }
  };
  </script>
  