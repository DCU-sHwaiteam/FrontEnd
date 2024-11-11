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

    <!-- 중앙 리스트 형식 버튼들 -->
    <v-container class="center-content">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-btn block color="grey lighten-3" class="list-button" @click="navigateTo('myClub')">
            내 동아리
          </v-btn>
          <v-btn block color="grey lighten-3" class="list-button" @click="navigateTo('clubSearch')">
            동아리 검색
          </v-btn>
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
      // 로그아웃 기능 구현 부분
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

.list-button {
  font-size: 1.2rem;
  color: black;
  margin-bottom: 20px;
  height: 50px;
}
</style>

