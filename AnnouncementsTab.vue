<template>
  <v-container>
    <h2>공지사항</h2>
    <p>동아리 공지를 관리하는 공간입니다.</p>

    <!-- 공지 추가 (관리자 전용) -->
    <v-btn v-if="isAdmin" color="primary" class="mb-3" @click="openDialog">
      공지 추가
    </v-btn>

    <!-- 공지 목록 -->
    <v-row>
      <v-col v-for="(announcement, index) in announcements" :key="index" cols="12" sm="6" md="4">
        <v-card class="announcement-card">
          <v-card-title>{{ announcement.title }}</v-card-title>
          <v-card-text>{{ announcement.content }}</v-card-text>
          <v-card-actions v-if="isAdmin">
            <v-btn color="red" text @click="deleteAnnouncement(index)">삭제</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 공지 작성 다이얼로그 -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>공지 추가</v-card-title>
        <v-card-text>
          <v-text-field v-model="newAnnouncement.title" label="제목"></v-text-field>
          <v-textarea v-model="newAnnouncement.content" label="내용"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" text @click="dialog = false">취소</v-btn>
          <v-btn color="primary" @click="addAnnouncement">추가</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  props: {
    isAdmin: Boolean, // ClubDetail.vue에서 전달됨
  },
  data() {
    return {
      dialog: false,
      newAnnouncement: { title: "", content: "" },
      announcements: JSON.parse(localStorage.getItem("announcements")) || [], // 공지사항 로드
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    addAnnouncement() {
      if (this.newAnnouncement.title && this.newAnnouncement.content) {
        this.announcements.push({ ...this.newAnnouncement });
        localStorage.setItem("announcements", JSON.stringify(this.announcements)); // 로컬 저장
        this.newAnnouncement = { title: "", content: "" };
        this.dialog = false;
      }
    },
    deleteAnnouncement(index) {
      this.announcements.splice(index, 1);
      localStorage.setItem("announcements", JSON.stringify(this.announcements));
    },
  },
};
</script>

<style scoped>
.announcement-card {
  background-color: #fff7d1; /* 메모장 느낌의 배경 */
  border: 1px solid #f4c542;
  padding: 16px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
  
