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
            <!-- 동아리 추가 아이콘 -->
            <v-btn icon color="white" @click="navigateToAddClub" title="동아리 추가">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <!-- 홈 아이콘 -->
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
            <v-card-subtitle>{{ club.leader }} ({{ club.id }})</v-card-subtitle>
            <v-card-text>{{ club.description }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- 동아리 상세 팝업 -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">{{ selectedClub.name }}</v-card-title>
        <v-card-subtitle>동아리 장: {{ selectedClub.leader }} ({{ selectedClub.leaderId }})</v-card-subtitle>

        <v-card-text>
          <p>지도 교수: {{ selectedClub.advisor }}</p>
          <p>최대 인원수: {{ selectedClub.maxMembers }}</p>
          <p>현재 인원: {{ selectedClub.currentMembers }}</p>
          <p>활동 일정: {{ selectedClub.activitySchedule }}</p>
          <p>태그: {{ selectedClub.tags }}</p>
          <p>소개: {{ selectedClub.description }}</p>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="applyClub">신청</v-btn>
          <v-btn color="grey" @click="dialog = false">나가기</v-btn>
          <v-btn color="red" @click.stop="deleteClub(selectedClub.id)">삭제</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  name: "clubSearch",
  data() {
    return {
      searchQuery: '',
      dialog: false,
      selectedClub: {},
      clubs: [] // 기존 하드코딩된 데이터 제거
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
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
    navigateToAddClub() {
      this.$router.push({ name: 'AddClub' });
    },
    openClubDialog(club) {
      this.selectedClub = club;
      this.dialog = true;
    },
    applyClub() {
      // 기존 신청 내역 불러오기
      let myClubs = JSON.parse(localStorage.getItem("myClubs")) || [];
    
      // 중복 추가 방지
      if (!myClubs.some(club => club.id === this.selectedClub.id)) {
        myClubs.push(this.selectedClub);
        localStorage.setItem("myClubs", JSON.stringify(myClubs));
      }

      console.log(`${this.selectedClub.name}에 신청 완료!`);
      this.dialog = false;
    },
    deleteClub(clubId) {  // ❌ 동아리 삭제 기능 추가
      this.clubs = this.clubs.filter(club => club.id !== clubId);
      localStorage.setItem('clubs', JSON.stringify(this.clubs));

      // 신청한 동아리(myClubs)에서도 삭제
      let myClubs = JSON.parse(localStorage.getItem("myClubs")) || [];
      myClubs = myClubs.filter(club => club.id !== clubId);
      localStorage.setItem("myClubs", JSON.stringify(myClubs));
    },
    loadClubs() {  // 📥 localStorage에서 데이터 불러오기
      const savedClubs = localStorage.getItem('clubs');
      if (savedClubs) {
        this.clubs = JSON.parse(savedClubs);
      } else {
        // 기본 데이터 설정 (최초 1회)
        this.clubs = [
          {
            id: '20230001',
            name: '축구 동아리',
            leader: '김동아',
            leaderId: '12345678',
            advisor: '박교수',
            maxMembers: 20,
            currentMembers: 15,
            activitySchedule: '매주 화요일 5시',
            tags: '운동, 축구',
            description: '매주 축구 연습을 함께하는 동아리입니다.'
          },
          {
            id: '20230002',
            name: '음악 동아리',
            leader: '박음악',
            leaderId: '87654321',
            advisor: '이교수',
            maxMembers: 15,
            currentMembers: 10,
            activitySchedule: '매주 금요일 6시',
            tags: '음악, 연주',
            description: '음악을 좋아하는 사람들의 모임입니다.'
          }
        ];
        localStorage.setItem('clubs', JSON.stringify(this.clubs));
      }
    }
  },
  mounted() {
    this.loadClubs(); // 🔄 페이지 로드시 데이터 불러오기
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
  
