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
        <v-btn icon color="white" @click="openMembershipDialog" title="가입 승인 여부">
          <v-icon>mdi-account-check</v-icon>
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
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false,
      membershipDialog: false,
      club: {
        name: 'Sample Club',
        leader: 'Sample Leader',
        description: 'This is a sample club description.'
      },
      applicants: [
        { id: '1', name: '신청자1' },
        { id: '2', name: '신청자2' }
      ]
    };
  },
  methods: {
    openMembershipDialog() {
      this.membershipDialog = true;
    },
    approveApplicant(applicant) {
      console.log(`${applicant.name} 승인됨`);
      // 승인 처리 로직 추가
    },
    rejectApplicant(applicant) {
      console.log(`${applicant.name} 거부됨`);
      // 거부 처리 로직 추가
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

.slide-up-enter, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
  
