<template>
  <v-container>
    <!-- 동아리 기본 정보 -->
    <v-card class="club-info-card">
      <v-card-title>{{ club.name }}</v-card-title>
      <v-card-subtitle>동아리장: {{ club.leader }}</v-card-subtitle>
      <v-card-text>{{ club.description }}</v-card-text>
    </v-card>

    <!-- 탭 네비게이션 -->
    <v-tabs v-model="activeTab">
      <v-tab value="announcements">공지사항</v-tab>
      <v-tab value="schedule">일정</v-tab>
      <v-tab value="gallery">갤러리</v-tab>
      <v-tab value="members" v-if="isAdmin">멤버 관리</v-tab>
      <v-tab value="attendance" v-if="isAdmin">출석체크</v-tab>
    </v-tabs>

    <!-- 탭 내용 -->
    <v-window v-model="activeTab">
      <v-window-item value="announcements">
        <AnnouncementsTab :is-admin="isAdmin" />
      </v-window-item>
      <v-window-item value="schedule">
        <ScheduleTab :is-admin="isAdmin" />
      </v-window-item>
      <v-window-item value="gallery">
        <GalleryTab />
      </v-window-item>
      <v-window-item value="members" v-if="isAdmin">
        <MembersTab />
      </v-window-item>
      <v-window-item value="attendance" v-if="isAdmin">
        <AttendanceMember />
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script>
import AnnouncementsTab from '@/components/club/AnnouncementsTab.vue';
import ScheduleTab from '@/components/club/ScheduleTab.vue';
import GalleryTab from '@/components/club/GalleryTab.vue';
import MembersTab from '@/components/club/MembersTab.vue';
import AttendanceMember from '@/components/club/AttendanceMember.vue';
export default {
  components: {
    AnnouncementsTab,
    ScheduleTab,
    GalleryTab,
    MembersTab,
    AttendanceMember
  },
  data() {
    return {
      activeTab: 'announcements',
      club: {
        name: "",
        leader: "",
        description: ""
      },
      isAdmin: true // 이후에 사용자 역할과 연동 필요
    };
  },
  methods: {
    loadClubData() {
      const clubId = this.$route.params.id || localStorage.getItem("selectedClubId");  // URL 또는 로컬스토리지에서 ID 가져오기
      const savedClubs = JSON.parse(localStorage.getItem("clubs")) || [];

      // 선택한 동아리 찾기
      const selectedClub = savedClubs.find(club => club.id === clubId);

      if (selectedClub) {
        this.club = selectedClub;
      } else {
        console.error("해당 동아리를 찾을 수 없습니다.");
      }

      // 저장된 회원 & 신청자 정보 불러오기 (로컬 저장소 활용)
      this.members = JSON.parse(localStorage.getItem(`club_${clubId}_members`)) || [];
      this.applicants = JSON.parse(localStorage.getItem(`club_${clubId}_applicants`)) || [];
    }
  },
  mounted() {
  this.loadClubData();  // 페이지 로드 시 동아리 정보 불러오기
}
};
</script>

<style scoped>
.club-info-card {
  margin-bottom: 20px;
  padding: 20px;
}
</style>
  
