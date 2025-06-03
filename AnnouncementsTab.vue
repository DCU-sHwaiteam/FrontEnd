<template>
  <v-container class="announcements-container">
    <div class="announcements-header">
      <h2 class="announcements-title">공지사항</h2>
      <v-btn v-if="isAdmin" color="#b8b4e3" class="white--text add-btn" @click="openDialog">
        추가
      </v-btn>
    </div>

    <v-row>
      <v-col v-for="announcement in announcements" :key="announcement.id" cols="12" sm="6" md="4">
        <v-card class="announcement-card">
          <v-card-title class="announcement-card-title">{{ announcement.title }}</v-card-title>
          <v-card-text class="announcement-card-content">
            <div class="content-label">내용</div>
            <div class="content-text">{{ announcement.content }}</div>
          </v-card-text>
          <v-card-actions v-if="isAdmin" class="announcement-card-actions">
            <v-spacer></v-spacer>
            <v-btn color="#f5a2a2" class="white--text" @click="deleteAnnouncement(announcement.id)">삭제</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 공지 추가 팝업 -->
    <v-dialog v-model="dialog" max-width="500px" content-class="add-announcement-dialog">
      <v-card class="add-announcement-card">
        <v-card-title class="add-announcement-title">공지 추가</v-card-title>
        <v-card-text class="add-announcement-content">
          <div class="input-label">제목</div>
          <v-text-field 
            v-model="newAnnouncement.title" 
            outlined
            dense
            hide-details
            class="mb-4"
          ></v-text-field>
          <div class="input-label">내용</div>
          <v-textarea 
            v-model="newAnnouncement.content" 
            outlined
            rows="4"
            hide-details
          ></v-textarea>
        </v-card-text>
        <v-card-actions class="add-announcement-actions">
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="dialog = false">취소</v-btn>
          <v-btn color="#b8b4e3" class="white--text" @click="addAnnouncement">추가</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { fetchAnnouncements, addAnnouncement, deleteAnnouncement } from '@/services/authService';

export default {
  props: {
    isAdmin: Boolean,
    clubId: [String, Number],
  },
  data() {
    return {
      dialog: false,
      newAnnouncement: { title: "", content: "" },
      announcements: [],
    };
  },
  mounted() {
    this.loadAnnouncements();
  },
  methods: {
    async loadAnnouncements() {
      if (!this.clubId) {
        console.error("clubId가 없습니다!");
        return;
      }
      this.announcements = await fetchAnnouncements(this.clubId);
    },
    openDialog() {
      this.dialog = true;
    },
    async addAnnouncement() {
      if (this.newAnnouncement.title && this.newAnnouncement.content) {
        await addAnnouncement(this.clubId, this.newAnnouncement);
        this.newAnnouncement = { title: "", content: "" };
        this.dialog = false;
        this.loadAnnouncements();
      }
    },
    async deleteAnnouncement(announcementId) {
      await deleteAnnouncement(this.clubId, announcementId);
      this.loadAnnouncements();
    },
  },
};
</script>

<style scoped>
.announcements-container {
  padding: 24px 0;
}

.announcements-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.announcements-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #222;
}

.add-btn {
  min-width: 80px;
  font-weight: 500;
}

.announcement-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 16px;
  background: #e1e0f6;
}

.announcement-card-title {
  font-size: 1.1rem;
  font-weight: bold;
  padding-bottom: 8px;
}

.announcement-card-content {
  padding-top: 0;
}

.content-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 4px;
}

.content-text {
  font-size: 1rem;
  color: #222;
  line-height: 1.4;
}

.announcement-card-actions {
  padding-top: 8px;
  padding-right: 16px;
  padding-bottom: 12px;
}

/* 팝업 스타일 */
.add-announcement-dialog {
  background: transparent !important;
  box-shadow: none !important;
}

.add-announcement-card {
  border-radius: 16px !important;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.10) !important;
  padding: 24px 32px 24px 32px;
  max-width: 500px;
  margin: 0 auto;
}

.add-announcement-title {
  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 16px;
}

.add-announcement-content {
  padding-top: 0;
  padding-bottom: 0;
}

.input-label {
  font-size: 1rem;
  color: #222;
  margin-bottom: 8px;
  font-weight: 500;
}

.add-announcement-actions {
  padding-top: 24px;
  justify-content: flex-end;
}
</style>
  
