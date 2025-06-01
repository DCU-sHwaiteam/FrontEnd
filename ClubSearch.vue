<template>
  <v-app class="ClubSearch">
    <!-- 상단 바 -->
    <v-app-bar app color="#8FD6F0" dark height="64">
      <v-container>
        <v-row align="center" justify="space-between">
          <v-col>
            <v-toolbar-title>동아리 검색</v-toolbar-title>
          </v-col>
          <v-col class="info-buttons" cols="auto">
            <v-btn
              icon
              color="white"
              @click="navigateToAddClub"
              title="동아리 추가"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              icon
              color="white"
              @click="navigateTo('mainPage')"
              title="메인 페이지"
            >
              <v-icon>mdi-home</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- 검색창 -->
    <v-container class="search-container">
      <v-text-field
        class="search-bar mb-6"
        label="동아리 이름으로 검색"
        v-model="searchQuery"
        append-icon="mdi-magnify"
        placeholder="동아리 이름을 입력하세요"
        hide-details
        rounded
        filled
      ></v-text-field>

      <!-- 동아리 리스트 -->
      <v-row>
        <v-col
          v-for="club in filteredClubs"
          :key="club.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card class="list-card" @click="openClubDialog(club)" hover>
            <v-card-title>{{ club.name }}</v-card-title>
            <v-card-subtitle>동아리 장: {{ club.leader_name }}</v-card-subtitle>
            <v-card-text>{{ club.description }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- 상세 보기 -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card v-if="selectedClub">
        <v-card-title class="headline">{{ selectedClub.name }}</v-card-title>
        <v-card-subtitle
          >동아리 장: {{ selectedClub.leader_name }}</v-card-subtitle
        >
        <v-card-text>
          <p>지도 교수: {{ selectedClub.advisor }}</p>
          <p>최대 인원수: {{ selectedClub.max_members }}</p>
          <p>현재 인원: {{ selectedClub.current_members }}</p>
          <p>활동 일정: {{ selectedClub.activity_schedule }}</p>
          <p>태그: {{ selectedClub.tags }}</p>
          <p>소개: {{ selectedClub.description }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="confirmApplyDialog = true">신청</v-btn>
          <v-btn color="grey" @click="dialog = false">나가기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 신청 확인 다이얼로그 -->
    <v-dialog v-model="confirmApplyDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">동아리 신청 확인</v-card-title>
        <v-card-text>정말로 신청하시겠습니까?</v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="submitApplication">확인</v-btn>
          <v-btn color="grey" @click="confirmApplyDialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import axios from "axios";
import { fetchClubs, joinClub } from "@/services/authService";

const API_URL = process.env.VUE_APP_API_BASE_URL || "http://localhost:8000/";

export default {
  name: "clubSearch",
  data() {
    return {
      searchQuery: "",
      dialog: false,
      confirmApplyDialog: false,
      selectedClub: null,
      clubs: [],
    };
  },
  computed: {
    filteredClubs() {
      return this.clubs.filter((club) =>
        club.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
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
    async submitApplication() {
      try {
        // 현재 로그인 유저 정보 불러오기
        const userRes = await axios.get(`${API_URL}current-user`, {
          withCredentials: true,
        });
        const userId = userRes.data.user.id;
        // 동아리 신청 API 호출
        await joinClub(userId, this.selectedClub.id);

        alert("동아리 신청이 완료되었습니다.");
        this.confirmApplyDialog = false;
        this.dialog = false;
      } catch (error) {
        console.error("동아리 신청 실패", error);
        alert("동아리 신청에 실패했습니다.");
      }
    },
    navigateToAddClub() {
      this.$router.push({ name: "AddClub" });
    },
    navigateTo(page) {
      if (page === "mainPage") {
        this.$router.push({ name: "mainPage" });
      }
    },
  },
  mounted() {
    this.fetchClubList();
  },
};
</script>

<style scoped>
.search-container {
  margin-top: 100px;
}

.search-bar .v-input__control {
  background-color: #d9d9d9;
  border-radius: 12px;
}

/* 검색창과 리스트 사이 여백 */
.mb-6 {
  margin-bottom: 36px !important;
}

.list-card {
  background-color: #cdd1ff;
  padding: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.list-card:hover {
  transform: translateY(-4px);
}
</style>
