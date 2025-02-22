<template>
  <v-container>
    <h2>멤버 관리</h2>
    <p>동아리 회원을 관리하는 공간입니다.</p>

    <!-- 신청 목록 보기 버튼 -->
    <v-btn color="primary" @click="openApplicationsDialog">신청 목록 보기</v-btn>

    <!-- 신청 목록 팝업 -->
    <v-dialog v-model="applicationsDialog" max-width="500px">
      <v-card>
        <v-card-title>신청 목록</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="(applicant, index) in applications" :key="index">
              <div class="member-item">
                <!-- 프로필 -->
                <div class="profile-container">
                  <v-avatar size="50">
                    <img :src="applicant.profileImage || defaultProfileImage" alt="프로필 사진" />
                  </v-avatar>
                </div>

                <!-- 수직 구분선 -->
                <div class="divider"></div>

                <!-- 정보 영역 -->
                <div class="info-container">
                  <div class="name">{{ applicant.name }}</div>
                  <div class="details">{{ applicant.major }} | {{ applicant.studentId }}</div>
                </div>

                <!-- 승인 버튼 -->
                <div class="button-container">
                  <v-btn color="green" @click="approveMember(index)">승인</v-btn>
                </div>
              </div>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="applicationsDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 현재 멤버 목록 -->
    <v-list>
      <v-list-item v-for="(member, index) in members" :key="index">
        <div class="member-item">
          <!-- 프로필 -->
          <div class="profile-container">
            <v-avatar size="50">
              <img :src="member.profileImage || defaultProfileImage" alt="프로필 사진" />
            </v-avatar>
          </div>

          <!-- 수직 구분선 -->
          <div class="divider"></div>

          <!-- 정보 영역 -->
          <div class="info-container">
            <div class="name">{{ member.name }}</div>
            <div class="details">{{ member.major }} | {{ member.studentId }}</div>
          </div>

          <!-- 삭제 버튼 -->
          <div class="button-container">
            <v-btn color="red" @click="removeMember(index)">삭제</v-btn>
          </div>
        </div>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
export default {
  name: 'MembersTab',
  data() {
    return {
      applicationsDialog: false,
      applications: JSON.parse(localStorage.getItem("clubApplications")) || [],
      members: JSON.parse(localStorage.getItem("clubMembers")) || [],
      defaultProfileImage: "https://via.placeholder.com/50"
    };
  },
  methods: {
    openApplicationsDialog() {
      this.applicationsDialog = true;
    },
    approveMember(index) {
      const approvedMember = this.applications.splice(index, 1)[0];

      if (!this.members.some(member => member.studentId === approvedMember.studentId)) {
        // ✅ Vue가 반응형으로 감지할 수 있도록 새로운 배열을 할당!
        this.members = [...this.members, approvedMember];
        localStorage.setItem("clubMembers", JSON.stringify(this.members));
      }

      localStorage.setItem("clubApplications", JSON.stringify(this.applications));
    },
    removeMember(index) {
      // ✅ 특정 멤버 삭제
      this.members.splice(index, 1);
      this.members = [...this.members]; // Vue가 반응하도록 새 배열 할당
      localStorage.setItem("clubMembers", JSON.stringify(this.members));
    }
  }
};
</script>

<style scoped>
/* ✅ 멤버 리스트 스타일 */
.member-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  justify-content: flex-start; /* 왼쪽 정렬 */
  gap: 15px; /* 요소들 사이 간격 추가 */
}

/* ✅ 프로필 컨테이너 */
.profile-container {
  flex: 0 0 60px; /* 고정 크기 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ✅ 수직 구분선 */
.divider {
  width: 2px;
  height: 40px;
  background-color: #ccc;
}

/* ✅ 정보 컨테이너 */
.info-container {
  flex: 1; /* 남은 공간을 차지 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
}

/* ✅ 버튼 컨테이너 */
.button-container {
  flex: 0 0 auto;
  margin-left: auto; /* 오른쪽 끝으로 이동 */
}

/* ✅ 텍스트 스타일 */
.name {
  font-weight: bold;
  font-size: 16px;
}

.details {
  font-size: 14px;
  color: #666;
}
</style>
  
