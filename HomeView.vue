<template>
  <v-app class="home-page">
    <v-container>
      <!-- 제목 -->
      <v-row justify="center" class="mb-4">
        <v-col cols="12" md="8" lg="6">
          <h2 class="page-title">내 정보</h2>
        </v-col>
      </v-row>

      <!-- 프로필 카드 -->
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card>
            <v-card-title>
              <v-avatar size="80" class="mr-4">
                <img :src="user.profileImage" alt="프로필 사진" />
              </v-avatar>
              <div>
                <h3>{{ user.name }}</h3>
                <p class="text-subtitle-1">{{ user.department }}</p>
              </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>학번</v-list-item-title>
                    <v-list-item-subtitle>{{ user.studentId }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>학과</v-list-item-title>
                    <v-list-item-subtitle>{{ user.department }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>이메일</v-list-item-title>
                    <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="primary" @click="editProfile">프로필 수정</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
      user: {
        profileImage: "https://via.placeholder.com/80", // 기본 프로필 이미지 URL
        name: "홍길동",
        studentId: "20241234",
        department: "컴퓨터공학과",
        email: "hong@example.com"
      }
    };
  },
  methods: {
    editProfile() {
      console.log("프로필 수정 버튼 클릭됨");
      // 프로필 수정 로직 추가 가능
    }
  }
};
</script>
<style scoped>
.home-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-top: 20px;
}

.page-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}

.v-avatar img {
  border-radius: 50%;
}

.v-card-title {
  display: flex;
  align-items: center;
}

.v-card-text {
  padding-top: 10px;
}

.v-card-actions {
  justify-content: flex-end;
}
</style>
