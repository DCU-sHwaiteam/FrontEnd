<template>
  <v-container>
    <h2>공지사항</h2>
    <p>동아리 공지를 관리하는 공간입니다.</p>

    <v-btn v-if="isAdmin" color="primary" class="mb-3" @click="openDialog">
      공지 추가
    </v-btn>

    <v-row>
      <v-col v-for="announcement in announcements" :key="announcement.id" cols="12" sm="6" md="4">
        <v-card class="announcement-card">
          <v-card-title>{{ announcement.title }}</v-card-title>
          <v-card-text>{{ announcement.content }}</v-card-text>
          <v-card-actions v-if="isAdmin">
            <v-btn color="red" text @click="deleteAnnouncement(announcement.id)">삭제</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

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
import { fetchAnnouncements, addAnnouncement, deleteAnnouncement } from '@/services/authService';

export default {
  props: {
    isAdmin: Boolean,
    clubId: [String, Number], // ClubDetail에서 club-id로 전달
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
  
