# 현재 제거한 상태


<template>
  <v-container>
    <!-- 제목과 메뉴 아이콘 -->
    <v-row align="center" justify="space-between">
      <v-col cols="2"></v-col> <!-- 빈 공간을 추가하여 텍스트를 중앙으로 -->
      <v-col class="text-center">
        <h1>내 동아리</h1>
      </v-col>

      <v-col cols="auto">
        <v-btn icon color="white" @click="drawer = true" title="메뉴">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </v-col>
    </v-row>


    <!-- 동아리 목록 -->
    <v-row>
      <v-col
        v-for="club in clubs"
        :key="club.id"
        cols="12" sm="6" md="4"
      >
        <v-card @click="navigateToClub(club.id)" class="club-card">
          <v-card-title>{{ club.name }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- 오른쪽에서 나오는 슬라이드 네비게이션 메뉴 -->
    <v-navigation-drawer v-model="drawer" app temporary location = 'right' dark color="rgba(0, 0, 0, 0.8)">
      <v-list>
        <v-list-item @click="navigateTo('mainPage')">
          <v-list-item-title class="white-text">메인 페이지</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo('myClub')">
          <v-list-item-title class="white-text">내 동아리</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo('clubSearch')">
          <v-list-item-title class="white-text">동아리 검색</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      drawer: false, // 슬라이드 메뉴 상태
      clubs: [
        { id: '1', name: '축구 동아리' },
        { id: '2', name: '음악 동아리' }
      ]
    };
  },
  methods: {
    navigateToClub(id) {
      this.$router.push({ name: 'ClubDetail', params: { id } });
    },
    navigateTo(routeName) {
      this.drawer = false; // 메뉴 닫기
      this.$router.push({ name: routeName });
    }
  }
};
</script>

<style scoped>
.v-navigation-drawer__content {
  background-color: rgba(0, 0, 0, 0.8) !important;
}

.white-text {
  color: white !important;
}
</style>
