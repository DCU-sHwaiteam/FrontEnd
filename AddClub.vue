<template>
  <v-app>
    <!-- 상단 바 -->
    <v-app-bar app color="#8FD6F0" dark>
      <v-toolbar-title>동아리 등록</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="navigateToSearch">
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container class="form-container">
      <v-card class="form-card" elevation="6">
        <v-card-title>동아리 등록</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isFormValid">
            <v-text-field
              label="동아리 이름"
              v-model="clubName"
              filled
              rounded
              class="mb-3"
              required
            />

            <v-text-field
              label="동아리 장 이름"
              v-model="leaderName"
              filled
              rounded
              class="mb-3"
              required
            />

            <v-text-field
              label="동아리 장 이메일"
              v-model="leaderEmail"
              filled
              rounded
              class="mb-3"
              required
            />

            <v-text-field
              label="지도 교수"
              v-model="advisor"
              filled
              rounded
              class="mb-3"
              required
            />

            <v-text-field
              label="최대 인원수"
              v-model="maxMembers"
              type="number"
              filled
              rounded
              class="mb-3"
              required
            />

            <v-text-field
              label="동아리 활동 날짜와 시간"
              v-model="activitySchedule"
              hint="예: 매주 화요일 5시"
              filled
              rounded
              class="mb-3"
              required
            />

            <v-text-field
              label="태그 (콤마로 구분)"
              v-model="tags"
              filled
              rounded
              class="mb-3"
            />

            <v-textarea
              label="한 줄 소개"
              v-model="description"
              filled
              rounded
              rows="2"
              maxlength="100"
              hint="최대 100자까지 입력 가능합니다."
              class="mb-3"
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn color="grey" class="rounded-pill" @click="navigateToSearch"
            >돌아가기</v-btn
          >
          <v-btn
            color="primary"
            class="rounded-pill"
            :disabled="!isFormValid"
            @click="registerClub"
            >등록</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import { createClub } from "@/services/authService";

export default {
  data() {
    return {
      clubName: "",
      leaderName: "",
      leaderEmail: "",
      advisor: "",
      maxMembers: "",
      activitySchedule: "",
      tags: "",
      description: "",
      isFormValid: false,
    };
  },
  methods: {
    async registerClub() {
      if (this.isFormValid) {
        const newClub = {
          name: this.clubName,
          leaderName: this.leaderName,
          leaderEmail: this.leaderEmail,
          advisor: this.advisor,
          maxMembers: this.maxMembers,
          currentMembers: 0,
          activitySchedule: this.activitySchedule,
          tags: this.tags,
          description: this.description,
        };

        try {
          const response = await createClub(newClub);
          if (response.success) {
            this.$router.push({ name: "clubSearch" }); // 라우터 name이 "clubSearch"여야 함!
          } else {
            alert("동아리장 정보가 올바르지 않습니다.");
          }
        } catch (error) {
          console.error("Error registering club", error);
        }
      }
    },
    navigateToSearch() {
      this.$router.push({ name: "clubSearch" }); // 라우터 name이 "clubSearch"여야 함!
    },
  },
};
</script>

<style scoped>
.form-container {
  margin-top: 100px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.form-card {
  padding: 24px;
  border-radius: 16px;
  background-color: #ffffff;
}
</style>
