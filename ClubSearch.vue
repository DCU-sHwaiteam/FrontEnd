<template>
  <v-app class="ClubSearch">
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

    <v-container class="search-container">
      <v-text-field
        label="동아리 이름으로 검색"
        v-model="searchQuery"
        append-icon="mdi-magnify"
        placeholder="동아리 이름을 입력하세요"
      ></v-text-field>

      <v-row>
        <v-col
          v-for="club in filteredClubs"
          :key="club.id"
          cols="12" sm="6" md="4"
        >
          <v-card class="list-card" @click="openClubDialog(club)" hover>
            <v-card-title>{{ club.name }}</v-card-title>
            <v-card-subtitle>동아리 장: {{ club.leader_name }}</v-card-subtitle>
            <v-card-text>{{ club.description }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

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
          <v-btn color="primary" @click="confirmApplyDialog = true">신청</v-btn>
          <v-btn color="grey" @click="dialog = false">나가기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:8000/';

const mockClubs = [
  {
    id: 1,
    name: "프론트엔드 연구회",
    leader_name: "김철수",
    description: "Vue.js와 React를 중심으로 웹 프론트엔드를 공부하는 동아리입니다.",
    advisor: "이교수",
    max_members: 20,
    current_members: 10,
    activity_schedule: "매주 수요일 오후 5시",
    tags: "프론트엔드,웹,코딩"
  },
  {
    id: 2,
    name: "AI 딥러닝 클럽",
    leader_name: "이영희",
    description: "AI와 딥러닝에 관심 있는 학생들이 모여 함께 프로젝트를 진행합니다.",
    advisor: "김교수",
    max_members: 15,
    current_members: 12,
    activity_schedule: "매주 금요일 오후 3시",
    tags: "AI,딥러닝,ML"
  }
];

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
      return this.clubs.filter(club =>
        club.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    async fetchClubList() {
      try {
        if (process.env.NODE_ENV === "development") {
          this.clubs = mockClubs;
        } else {
          this.clubs = await fetchClubs();
        }
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
        const userRes = await axios.get(`${API_URL}api/current-user`, { withCredentials: true });
        const userId = userRes.data.id;

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

















