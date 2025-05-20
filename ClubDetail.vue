<template>
  <v-container>
    <!-- 동아리 기본 정보 -->
    <v-card class="club-info-card">
      <v-card-title>{{ club.name }}</v-card-title>
      <v-card-subtitle>동아리장: {{ club.leader_name }}</v-card-subtitle>
      <v-card-text>{{ club.description }}</v-card-text>
    </v-card>

    <!-- 탭 네비게이션 -->
    <v-tabs v-model="activeTab">
      <v-tab value="announcements">공지사항</v-tab>
      <v-tab value="schedule">일정</v-tab>
      <v-tab value="gallery">갤러리</v-tab>
      <v-tab value="members">멤버 관리</v-tab>
      <v-tab value="attendance">출석체크</v-tab>
    </v-tabs>

    <!-- 탭 내용 -->
    <v-window v-model="activeTab">
      <v-window-item value="announcements">
        <AnnouncementsTab v-if="club.id" :is-admin="isAdmin" :club-id="club.id" />
      </v-window-item>
      <v-window-item value="schedule">
        <ScheduleTab v-if="club.id" :is-admin="isAdmin" :club-id="club.id" />
      </v-window-item>
      <v-window-item value="gallery">
        <GalleryTab v-if="club.id" :club-id="club.id" />
      </v-window-item>
      <v-window-item value="members">
        <MembersTab v-if="club.id" :members="members" :club-id="club.id" />
      </v-window-item>
      <v-window-item value="attendance">
        <AttendanceMember v-if="club.id" :club-id="club.id" :is-admin="isAdmin" />
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

import axios from 'axios';

const API_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8000';

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
        leader_name: "",
        description: ""
      },
      members: [],
      isAdmin: false,
      currentUserEmail: ""
    };
  },
  methods: {
    async loadClubData() {
      const clubId = this.$route.params.id;

      try {
        // 로그인 사용자 정보 불러오기 (예: 세션 기반)
        const userRes = await axios.get(`${API_URL}current-user`, { withCredentials: true });
        this.currentUserEmail = userRes.data.email;

        // 동아리 정보 요청
        const clubRes = await axios.get(`${API_URL}clubs/${clubId}`, { withCredentials: true });
        this.club = clubRes.data;

        // 동아리 멤버 목록 요청
        const membersRes = await axios.get(`${API_URL}clubs/${clubId}/members`, { withCredentials: true });
        this.members = membersRes.data;

        // 현재 로그인한 유저가 동아리장인지 확인
        this.isAdmin = this.club.leader_id === userRes.data.user.id;

        // 콘솔로 값 확인해보세요!
        console.log("club.leader_id:", this.club.leader_id, "user.id:", userRes.data.user.id, "isAdmin:", this.isAdmin);
      } catch (err) {
        console.error("❌ 동아리 상세 정보 로드 실패:", err.response?.data || err);
      }
    }
  },
  mounted() {
    this.loadClubData();
  }
};
</script>

<style scoped>
.club-info-card {
  margin-bottom: 20px;
  padding: 20px;
}
</style>
  
