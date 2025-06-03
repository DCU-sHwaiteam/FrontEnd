<template>
  <v-app class="club-detail-page">
    <!-- 상단 바 -->
    <v-app-bar
      flat
      color="#aee3fa"
      height="70"
      style="box-shadow:none;"
      class="main-app-bar"
    >
      <v-container class="d-flex align-center justify-space-between" style="height:100%;">
        <div class="d-flex align-center">
          <v-img
            src="/static/images/logo.png"
            alt="체크인클럽"
            contain
            max-height="32"
            max-width="32"
            class="mr-2"
          />
          <span class="font-weight-bold" style="font-size: 1.3rem; color: #222;">체크인클럽</span>
        </div>
        <div class="d-flex align-center">
          <v-btn text class="top-link" @click="$router.push({name: 'home'})">내정보</v-btn>
          <v-btn text class="top-link" @click="$router.push({name: 'login'})">로그아웃</v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <!-- 동아리 정보 헤더 (파란색 배경) -->
    <div class="club-header-section">
      <v-container>
        <div class="club-info-content">
          <h1 class="club-title">{{ club.name || '동아리 이름' }}</h1>
          <div class="club-leader">{{ club.leader_name || '동아리 장' }}</div>
          <div class="club-description">{{ club.description || '동아리 설명' }}</div>
        </div>
      </v-container>
    </div>

    <!-- 탭 네비게이션과 컨텐츠 -->
    <v-container class="club-content-container">
      <!-- 탭 네비게이션 -->
      <v-tabs v-model="activeTab" class="club-tabs">
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
  </v-app>
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
        const userRes = await axios.get(`${API_URL}current-user`, { withCredentials: true });
        this.currentUserEmail = userRes.data.email;

        const clubRes = await axios.get(`${API_URL}clubs/${clubId}`, { withCredentials: true });
        this.club = clubRes.data;

        const membersRes = await axios.get(`${API_URL}clubs/${clubId}/members`, { withCredentials: true });
        this.members = membersRes.data;

        this.isAdmin = this.club.leader_id === userRes.data.user.id;

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
.club-detail-page {
  background-color: #fff;
  min-height: 100vh;
}

.main-app-bar {
  background-color: #aee3fa !important;
  box-shadow: none !important;
}

.top-link {
  color: #222 !important;
  font-weight: 500;
  font-size: 1rem;
  margin-left: 24px;
  letter-spacing: 0.01em;
}

/* 동아리 정보 헤더 섹션 (파란색 배경) */
.club-header-section {
  background-color: #aee3fa;
  width: 100%;
  padding: 40px 0 30px 0;
  margin-top: 0;
}

.club-info-content {
  text-align: center;
}

.club-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 24px;
  color: #222;
}

.club-leader {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 16px;
  font-weight: 500;
}

.club-description {
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 0;
  line-height: 1.5;
}

/* 탭 컨텐츠 컨테이너 */
.club-content-container {
  max-width: 1200px;
  padding-top: 16px;
}

.club-tabs {
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 32px;
  position: sticky;
  top: 70px;
  background-color: #fff;
  z-index: 10;
}

/* 탭 스타일 개선 */
.club-tabs >>> .v-tab {
  font-size: 1.1rem;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.02em;
}

.club-tabs >>> .v-tab--selected {
  color: #1976d2 !important;
}
</style>
  
