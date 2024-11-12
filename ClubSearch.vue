<template>
  <v-app class="ClubSearch">
    <!-- 상단 바 (예시) -->
    <v-app-bar app color="black" dark>
      <v-container>
        <v-row align="center" justify="space-between">
          <v-col>
            <v-toolbar-title>동아리 검색</v-toolbar-title>
          </v-col>
          <!-- 오른쪽에 + 버튼 추가 -->
          <v-col class="info-buttons" cols="auto">
            <v-btn icon color="white" @click="navigateToAddClub">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- 동아리 검색 페이지의 컨텐츠 -->
    <v-container class="search-content">
      <!-- 여기에 검색 UI 요소 추가 -->
    </v-container>
  </v-app>
</template>

<script>
export default {
  name : "clubSearch",
  methods: {
    navigateToAddClub() {
      this.$router.push({ name: 'AddClub' }); // AddClub 페이지로 이동
    }
  }
};
</script>

<style scoped>
.club-search-page {
  background-color: #f5f5f5; /* 배경 색상 */
}

.info-buttons {
  display: flex;
  gap: 10px;
}
</style>
  
