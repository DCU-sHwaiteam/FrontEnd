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
            <v-btn icon color="white" @click="navigateToAddClub" title="동아리 추가">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn icon color="white" @click="navigateTo('mainPage')" title="메인 페이지">
              <v-icon>mdi-home</v-icon>
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
          <v-card class="list-card" @click="openClubDialog(club)" hover>
            <v-card-title>{{ club.name }}</v-card-title>
            <v-card-subtitle>동아리 장: {{ club.leader_name }}</v-card-subtitle>  <!-- ✅ 수정 -->
            <v-card-text>{{ club.description }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- 동아리 상세 팝업 -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card v-if="selectedClub">
        <v-card-title class="headline">{{ selectedClub.name }}</v-card-title>
        <v-card-subtitle>동아리 장: {{ selectedClub.leader_name }}</v-card-subtitle>

        <v-card-text>
          <p>지도 교수: {{ selectedClub.advisor }}</p>
          <p>최대 인원수: {{ selectedClub.max_members }}</p>
          <p>현재 인원: {{ selectedClub.current_members }}</p>
          <p>활동 일정: {{ selectedClub.activity_schedule }}</p>
          <p>태그: {{ selectedClub.tags }}</p>
          <p>소개: {{ selectedClub.description }}</p>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary">신청</v-btn>
          <v-btn color="grey" @click="dialog = false">나가기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { fetchClubs } from "@/services/authService";

export default {
  name: "clubSearch",
  data() {
    return {
      searchQuery: "",
      dialog: false,
      selectedClub: null,
      clubs: []
    };
  },
  computed: {
    filteredClubs() {
      return this.clubs.filter(club =>
        club.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    async fetchClubList() {
      try {
        this.clubs = await fetchClubs();
      } catch (error) {
        console.error("Failed to load clubs", error);
      }
    },
    openClubDialog(club) {
      this.selectedClub = club;
      this.dialog = true;
    },
    navigateToAddClub() {
      this.$router.push({ name: "AddClub" });
    },
    navigateTo(page) {
      if (page === 'mainPage') {
        this.$router.push({ name: "mainPage" });
      }
    }
  },
  mounted() {
    this.fetchClubList();
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
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.list-card:hover {
  transform: translateY(-4px);
}
</style>
  
