<template>
  <v-app class="ClubSearch">
    <!-- 상단 바 -->
    <v-app-bar app color="black" dark>
      <v-container>
        <v-row align="center" justify="space-between">
          <v-col>
            <v-toolbar-title>동아리 검색</v-toolbar-title>
          </v-col>
          <v-col class="info-buttons" cols="auto">
            <v-btn icon color="white" @click="navigateToAddClub">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- 동아리 검색 창 -->
    <v-container class="search-container">
      <v-text-field
        label="동아리 이름으로 검색"
        v-model="searchQuery"
        append-icon="mdi-magnify"
        placeholder="동아리 이름을 입력하세요"
      ></v-text-field>

      <!-- 동아리 리스트 -->
      <v-row>
        <v-col
          v-for="club in filteredClubs"
          :key="club.id"
          cols="12" sm="6" md="4"
        >
          <v-card class="list-card" hover>
            <v-card-title>{{ club.name }}</v-card-title>
            <v-card-subtitle>{{ club.leader }} ({{ club.id }})</v-card-subtitle>
            <v-card-text>{{ club.description }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name : "clubSearch",
  data() {
    return {
      searchQuery: '',
      clubs: [
        { id: '20230001', name: '축구 동아리', leader: '김동아', description: '매주 축구 연습' },
        { id: '20230002', name: '음악 동아리', leader: '박음악', description: '매주 금요일 연주회' },
        { id: '20230003', name: '디지털 아트 동아리', leader: '이디지털', description: '디지털 아트 전시' },
        { id: '20230004', name: '테크 동아리', leader: '최테크', description: '매주 코드 챌린지' },
      ]
    };
  },
  computed: {
    filteredClubs() {
      // 검색 쿼리를 포함한 동아리 이름 필터링
      return this.clubs.filter(club => {
        return club.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  },
  methods: {
    navigateToAddClub() {
      this.$router.push({ name: 'AddClub' }); // 동아리 추가 페이지로 이동
    }
  }
};
</script>

<style scoped>
.search-container {
  margin-top: 100px;
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
  
