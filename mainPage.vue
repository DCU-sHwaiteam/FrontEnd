<template>
  <v-app class="main-page">
    <!-- 상단 바 -->
    <v-app-bar app color="black" dark>
      <v-container>
        <v-row align="center" justify="space-between">
          <v-col>
            <v-toolbar-title class="title">DCU 동아리</v-toolbar-title>
          </v-col>
          <v-col class="info-buttons" cols="auto">
            <v-btn text color="white" @click="navigateTo('home')">내 정보</v-btn>
            <v-btn text color="white" @click="logout">로그아웃</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- 중앙 카드 스타일 버튼들 -->
    <v-container class="center-content">
      <v-row justify="center" class="button-row">
        <v-col cols="12" sm="8" md="6">
          <v-card class="list-card" @click="openMyClubPopup" hover>
            <v-card-title>내 동아리</v-card-title>
            <v-card-subtitle>내 동아리를 관리하고 확인하세요</v-card-subtitle>
          </v-card>
          <v-card class="list-card" @click="navigateTo('clubSearch')" hover>
            <v-card-title>동아리 검색</v-card-title>
            <v-card-subtitle>다른 동아리를 찾아보세요</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- 내 동아리 팝업 -->
    <v-dialog v-model="showMyClubPopup" max-width="500px">
      <v-card>
        <v-card-title>가입된 동아리 목록</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div v-if="loading" class="loading-spinner">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          <v-list v-else>
            <v-list-item
              v-for="club in approvedClubs"
              :key="club.id"
              @click="navigateToClubDetail(club.id)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ club.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" text @click="showMyClubPopup = false">닫기</v-btn>
        </v-card-actions>
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

      // 개발 환경에서만 목업 데이터 사용
      if (process.env.NODE_ENV === 'development') {
        this.approvedClubs = [
          { id: 1, name: '인공지능 동아리' },
          { id: 2, name: '프로그래밍 학회' }
        ];
        this.loading = false;
        return;
      }

      // 운영 환경에서는 API 호출
      try {
        const response = await axios.get('/api/my-clubs', { withCredentials: true });
        if (response.data.success) {
          this.approvedClubs = response.data.clubs;
        } else {
          console.error('동아리 목록을 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('동아리 목록을 불러오는 중 오류 발생:', error);
        alert('동아리 목록을 불러오지 못했습니다. 다시 시도해주세요.');
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
      console.log("로그아웃되었습니다.");
      this.$router.push({ name: 'login' });
    }
  }
};
</script>

<style scoped>
.main-page {
  background-color: #f5f5f5;
}

.title {
  font-size: 2rem;
  text-align: left;
}

.info-buttons {
  display: flex;
  gap: 10px;
}

.center-content {
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-row {
  gap: 16px;
}

.list-card {
  padding: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.list-card:hover {
  transform: translateY(-4px);
}

.v-card-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.v-card-subtitle {
  color: #666;
  font-size: 0.9rem;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
}
</style>

