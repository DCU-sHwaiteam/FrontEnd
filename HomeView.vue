<template>
  <v-app class="home-page">
    <!-- 상단 바 -->
    <v-app-bar
      flat
      color="#aee3fa"
      height="70"
      style="box-shadow:none;"
      class="main-app-bar"
    >
      <v-container class="d-flex align-center justify-space-between" style="height:100%;">
        <div class="d-flex align-center">
          <v-img
            src="/static/images/logo.png"
            alt="체크인클럽"
            contain
            max-height="32"
            max-width="32"
            class="mr-2"
          />
          <span class="font-weight-bold" style="font-size: 1.3rem; color: #222;">체크인클럽</span>
        </div>
        <div class="d-flex align-center">
          <v-btn text class="top-link" @click="$router.push({name: 'home'})">내정보</v-btn>
          <v-btn text class="top-link" @click="$router.push({name: 'login'})">로그아웃</v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <v-container class="info-container">
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card class="profile-card" elevation="4">
            <!-- 프로필 상단 -->
            <div class="profile-header d-flex align-center">
              <v-avatar size="80" class="profile-avatar mr-4" @click="editProfile" style="cursor:pointer;">
                <img :src="user.profileImage" alt="프로필 사진" />
              </v-avatar>
              <div>
                <div class="profile-name">{{ user.name || '이름' }}</div>
                <div class="profile-desc">{{ user.intro || '자기 소개' }}</div>
              </div>
            </div>
            <v-divider class="my-2"></v-divider>
            <!-- 정보 리스트 -->
            <div class="profile-info-list">
              <div class="profile-info-row">
                <span class="profile-info-title">학번</span>
                <span class="profile-info-value">{{ user.studentId || '학번' }}</span>
              </div>
              <div class="profile-info-row">
                <span class="profile-info-title">학과</span>
                <span class="profile-info-value">{{ user.department || '학과' }}</span>
              </div>
              <div class="profile-info-row">
                <span class="profile-info-title">이메일</span>
                <span class="profile-info-value">{{ user.email || '이메일' }}</span>
              </div>
              <div class="profile-info-row">
                <span class="profile-info-title">전화번호</span>
                <span class="profile-info-value">{{ user.phone || '전화번호' }}</span>
              </div>
              <div class="profile-info-row">
                <span class="profile-info-title">가입된 동아리</span>
                <span class="profile-info-value profile-info-muted">{{ user.clubs || '가입된 동아리' }}</span>
              </div>
            </div>
            <v-card-actions class="profile-actions">
              <v-spacer></v-spacer>
              <v-btn color="#b8b4e3" class="white--text" @click="editProfile" style="min-width:110px;">프로필 수정</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <!-- 숨겨진 파일 입력 -->
      <input
        type="file"
        ref="fileInput"
        style="display: none"
        @change="onFileChange"
      />
    </v-container>
  </v-app>
</template>

<script>
import { fetchCurrentUser, uploadProfileImage } from "@/services/authService";

export default {
  data() {
    return {
      user: {
        profileImage: "/static/images/default_profile.png",
        name: "",
        intro: "",
        studentId: "",
        department: "",
        email: "",
        phone: "",
        clubs: ""
      },
    };
  },
  async mounted() {
    try {
      const userData = await fetchCurrentUser();
      this.user = {
        profileImage: userData.profileImage || "/static/images/default_profile.png.jpg",
        name: userData.name || "",
        intro: userData.intro || "자기 소개",
        studentId: userData.student_id || "",
        department: userData.department || "",
        email: userData.email || "",
        phone: userData.phone || "",
        clubs: userData.clubs ? userData.clubs.join(', ') : "가입된 동아리"
      };
    } catch (error) {
      console.error("프로필 정보 로드 실패", error);
    }
  },
  methods: {
    editProfile() {
      this.$refs.fileInput.click();
    },
    async onFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      try {
        const res = await uploadProfileImage(file);
        this.user.profileImage = res.profileImageUrl;
        alert("프로필 사진이 업데이트되었습니다.");
      } catch (error) {
        alert("프로필 사진 업로드에 실패했습니다.");
      }
    },
  },
};
</script>

<style scoped>
.home-page {
  background-color: #fff;
  min-height: 100vh;
}
.main-app-bar {
  background-color: #aee3fa !important;
  box-shadow: none !important;
}
.top-link {
  color: #222 !important;
  font-weight: 500;
  font-size: 1rem;
  margin-left: 24px;
  letter-spacing: 0.01em;
}
.info-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.profile-card {
  margin: 56px auto 0 auto;
  border-radius: 16px;
  max-width: 480px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.13);
  padding: 0 0 12px 0;
}
.profile-header {
  padding: 32px 32px 0 32px;
}
.profile-avatar {
  background: #e0e0e0;
}
.profile-name {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 2px;
}
.profile-desc {
  font-size: 1rem;
  color: #888;
  margin-bottom: 2px;
}
.profile-info-list {
  padding: 24px 0 0 0;
  text-align: center;
}
.profile-info-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 6px;
}
.profile-info-title {
  font-size: 1rem;
  color: #757575;
  font-weight: 400;
}
.profile-info-value {
  font-size: 1.07rem;
  color: #222;
  font-weight: 500;
  margin-top: 1px;
}
.profile-info-muted {
  color: #bdbdbd;
  font-size: 0.98rem;
}
.profile-actions {
  justify-content: flex-end !important;
  padding-right: 24px !important;
  padding-bottom: 8px !important;
}
</style>
