<template>
  <v-app class="main-page">
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
          <v-btn text class="top-link" @click="navigateTo('home')">내정보</v-btn>
          <v-btn text class="top-link" @click="logout">로그아웃</v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <!-- 중앙 큰 버튼 -->
    <v-container class="main-center-content">
      <v-row justify="center" align="center" no-gutters>
        <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
          <div
            class="main-big-btn"
            @click="openMyClubPopup"
            tabindex="0"
          >
            내 동아리
            <div class="main-btn-arrow"></div>
          </div>
        </v-col>
        <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
          <div
            class="main-big-btn"
            @click="navigateTo('clubSearch')"
            tabindex="0"
          >
            동아리 검색
            <div class="main-btn-arrow"></div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- 내 동아리 팝업 (가로 길이 넓힘) -->
    <v-dialog v-model="showMyClubPopup" max-width="900px" content-class="club-popup-dialog">
      <v-card class="club-popup-card">
        <v-card-title class="club-popup-title">가입된 동아리 목록</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div v-if="loading" class="loading-spinner">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <div v-else>
            <div v-if="approvedClubs && approvedClubs.length > 0">
              <div
                v-for="club in approvedClubs"
                :key="'club-'+club.id"
                class="club-list-item"
                @click="navigateToClubDetail(club.id)"
              >
                {{ club.name }}
              </div>
            </div>
            <div v-else class="empty-message">
              가입된 동아리가 없습니다.
            </div>
          </div>
        </v-card-text>
        <div class="club-popup-actions">
          <v-btn color="#b8b4e3" class="white--text" @click="showMyClubPopup = false">닫기</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      showMyClubPopup: false,
      approvedClubs: [],
      loading: false
    };
  },
  methods: {
    openMyClubPopup() {
      this.loadApprovedClubs();
      this.showMyClubPopup = true;
    },
    async loadApprovedClubs() {
      this.loading = true;
      if (process.env.NODE_ENV === 'development') {
        this.approvedClubs = [
          { id: 1, name: '가입된 동아리 1' },
          { id: 2, name: '가입된 동아리 2' }
        ];
        this.loading = false;
        return;
      }
      try {
        const response = await axios.get('/api/my-clubs', { withCredentials: true });
        if (Array.isArray(response.data)) {
          this.approvedClubs = [...response.data];
        } else if (response.data && Array.isArray(response.data.clubs)) {
          this.approvedClubs = [...response.data.clubs];
        } else {
          this.approvedClubs = [];
        }
      } catch (error) {
        console.error('동아리 목록을 불러오는 데 실패했습니다.', error);
        alert('동아리 목록을 불러오지 못했습니다. 다시 시도해주세요.');
        this.approvedClubs = [];
      } finally {
        this.loading = false;
      }
    },
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
    navigateToClubDetail(clubId) {
      this.$router.push({ name: 'ClubDetail', params: { id: clubId } });
      this.showMyClubPopup = false;
    },
    logout() {
      this.$router.push({ name: 'login' });
    }
  }
};
</script>

<style scoped>
.main-page {
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

.main-center-content {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-big-btn {
  width: 270px;
  height: 120px;
  background: #6b9bc6;
  color: #fff;
  font-size: 2rem;
  font-weight: 400;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  margin: 32px 24px;
  padding: 0 36px 0 36px;
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  outline: none;
}
.main-big-btn:focus,
.main-big-btn:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  transform: translateY(-2px) scale(1.03);
}

.main-btn-arrow {
  width: 80%;
  height: 2px;
  background: #fff;
  margin-top: 18px;
  border-radius: 1px;
  position: relative;
}
.main-btn-arrow::after {
  content: '';
  display: block;
  position: absolute;
  right: 0;
  top: -4px;
  width: 18px;
  height: 18px;
  border-bottom: 2px solid #fff;
  border-right: 2px solid #fff;
  transform: rotate(-45deg);
  border-radius: 2px;
}

/* 팝업 스타일 */
.club-popup-dialog {
  background: transparent !important;
  box-shadow: none !important;
}

.club-popup-card {
  border-radius: 16px !important;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.10) !important;
  padding: 32px 0 40px 0;
  max-width: 750px;
  min-width: 500px;
  margin: 0 auto;
}

.club-popup-title {
  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 10px;
  letter-spacing: 0.01em;
}

.club-list-item {
  background: #d9d9d9;
  border-radius: 16px;
  margin: 16px 40px 0 40px;
  padding: 24px 32px;
  font-size: 1.13rem;
  font-weight: 500;
  color: #222;
  box-shadow: 0 4px 8px rgba(0,0,0,0.07);
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  text-align: center;
}
.club-list-item:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.13);
  transform: translateY(-2px) scale(1.01);
}

.club-popup-actions {
  display: flex;
  justify-content: flex-end;
  padding-right: 48px;
  padding-top: 20px;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
}

.empty-message {
  text-align: center;
  color: #aaa;
  margin-top: 24px;
  font-size: 1.1rem;
}
</style>

