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
            <v-btn icon color="white" @click="drawer = true" title="메뉴">
              <v-icon>mdi-menu</v-icon>
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

        <!-- 팝업 하단 버튼 -->
        <v-card-actions>
          <v-btn color="primary" @click="applyClub">신청</v-btn>
          <v-btn color="grey" @click="dialog = false">나가기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 오른쪽에서 나오는 슬라이드 네비게이션 메뉴 -->
    <v-navigation-drawer v-model="drawer" app temporary location="right" dark color="rgba(0, 0, 0, 0.8)">
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
  </v-app>
</template>

<script>
export default {
  name: "clubSearch",
  data() {
    return {
      searchQuery: '',
      dialog: false,
      drawer: false,
      selectedClub: {},
      clubs: [
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
      ]
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
      this.drawer = false;
    },
    navigateToAddClub() {
      this.$router.push({ name: 'AddClub' });
    },
    openClubDialog(club) {
      this.selectedClub = club;
      this.dialog = true;
    },
    applyClub() {
      console.log(`${this.selectedClub.name}에 신청하였습니다.`);
      this.dialog = false;
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
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.list-card:hover {
  transform: translateY(-4px);
}

.v-navigation-drawer__content {
  background-color: rgba(0, 0, 0, 0.8) !important;
}

.white-text {
  color: white !important;
}
</style>
  
