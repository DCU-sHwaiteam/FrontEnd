<template>
  <v-app class="main-page">
    <!-- 상단 바 -->
    <v-app-bar app color="black" dark>
      <v-container>
        <v-row align="center" justify="space-between">
          <!-- 왼쪽: DCU 동아리 텍스트 -->
          <v-col>
            <v-toolbar-title class="title">DCU 동아리</v-toolbar-title>
          </v-col>
          <!-- 오른쪽: 내 정보, 로그아웃 버튼 -->
          <v-col class="info-buttons" cols="auto">
            <v-btn text color="white" @click="navigateTo('myProfile')">내 정보</v-btn>
            <v-btn text color="white" @click="logout">로그아웃</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- 중앙 카드 스타일 버튼들 -->
    <v-container class="center-content">
      <v-row justify="center" class="button-row">
        <v-col cols="12" sm="8" md="6">
          <v-card class="list-card" @click="navigateTo('myClub')" hover>
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
  </v-app>
</template>

<script>
export default {
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
    logout() {
      console.log("로그아웃되었습니다.");
    }
  }
};
</script>

<style scoped>
.main-page {
  background-color: #f5f5f5; /* 배경 색상 */
}

.title {
  font-size: 2rem; /* DCU 동아리 텍스트 크기 */
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
  gap: 16px; /* 카드 간격 */
}

.list-card {
  padding: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  transition: transform 0.2s ease;
}

.list-card:hover {
  transform: translateY(-4px); /* 마우스 오버 시 살짝 상승 효과 */
}

.v-card-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.v-card-subtitle {
  color: #666;
  font-size: 0.9rem;
}
</style>

