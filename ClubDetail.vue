<template>
  <v-container>
    <!-- 동아리 상세 정보 -->
    <h1>{{ club.name }}</h1>
    <p>동아리 장: {{ club.leader }}</p>
    <p>소개: {{ club.description }}</p>

    <!-- 메뉴 아이콘 (우측 하단 고정) -->
    <v-btn
      icon
      color="white"
      fab
      @click="menuOpen = !menuOpen"
      class="fixed-menu-icon"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <!-- 슬라이드 메뉴 -->
    <transition name="slide-up">
      <div v-if="menuOpen" class="menu-overlay">
        <!-- 가입 승인 여부 아이콘 -->
        <v-btn icon color="white" @click="openMembershipDialog" title="가입 승인 여부">
          <v-icon>mdi-account-check</v-icon>
        </v-btn>

        <!-- 동아리 회원 확인 아이콘 -->
        <v-btn icon color="white" @click="openMemberListDialog" title="회원 확인">
          <v-icon>mdi-account-multiple</v-icon>
        </v-btn>
        
        <!-- 출석체크 아이콘 -->
        <v-btn icon color="white" @click="navigateToAttendance" title="출석체크">
          <v-icon>mdi-calendar-check</v-icon>
        </v-btn>
      </div>
    </transition>

    <!-- 신청자 관리 팝업 -->
    <v-dialog v-model="membershipDialog" max-width="600px">
      <v-card>
        <v-card-title>가입 신청 관리</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="applicant in applicants" :key="applicant.id">
              <v-list-item-content>
                <v-list-item-title>{{ applicant.name }} ({{ applicant.id }})</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn color="green" @click="approveApplicant(applicant)">승인</v-btn>
                <v-btn color="red" @click="rejectApplicant(applicant)">거부</v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="membershipDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 동아리 회원 확인 팝업 -->
    <v-dialog v-model="memberListDialog" max-width="600px">
      <v-card>
        <v-card-title>동아리 회원 목록</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="member in members" :key="member.id">
              <v-list-item-content>
                <v-list-item-title>{{ member.name }} ({{ member.id }})</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="memberListDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false,
      membershipDialog: false,
      memberListDialog: false,
      club: {
        name: 'Sample Club',
        leader: 'Sample Leader',
        description: 'This is a sample club description.',
        id: 123 // 예시 동아리 ID
      },
      applicants: [
        { id: '1', name: '신청자1' },
        { id: '2', name: '신청자2' }
      ],
      members: [
        { id: '101', name: '회원1' },
        { id: '102', name: '회원2' }
      ] // 초기 동아리 회원 목업 데이터
    };
  },
  methods: {
    openMembershipDialog() {
      this.membershipDialog = true;
    },
    openMemberListDialog() {
      this.memberListDialog = true;
    },
    navigateToAttendance() {
      this.$router.push({ name: 'AttendanceMember', params: { clubId: this.club.id } });
    },
    approveApplicant(applicant) {
      console.log(`${applicant.name} 승인됨`);
      // 승인 처리 로직: 신청자를 회원으로 추가
      this.members.push(applicant);
      // 신청자 리스트에서 제거
      this.applicants = this.applicants.filter(a => a.id !== applicant.id);
    },
    rejectApplicant(applicant) {
      console.log(`${applicant.name} 거부됨`);
      // 거부 처리 로직
    }
  }
};
</script>

<style scoped>
.fixed-menu-icon {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 10;
}

.menu-overlay {
  position: fixed;
  bottom: 72px;
  right: 16px;
  background-color: rgba(128, 128, 128, 0.8); /* 반투명 회색 */
  padding: 8px;
  border-radius: 16px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 11;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
  
