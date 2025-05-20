<template>
  <v-container>
    <h2>갤러리</h2>
    <p>동아리 활동 사진을 업로드하고 관리할 수 있습니다.</p>

    <v-btn color="primary" @click="openUploadDialog">📷 업로드</v-btn>

    <v-row>
      <!-- index 사용: openImageViewer(index) -->
      <v-col v-for="(image, index) in images" :key="image.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="photo-card" @click="openImageViewer(index)">
          <v-img :src="image.src" height="200px" contain></v-img>
          <v-divider></v-divider>
          <v-card-title class="image-title">{{ image.title }}</v-card-title>
          <v-card-text class="image-description">{{ image.description }}</v-card-text>
          <v-card-actions>
            <v-btn color="red" @click.stop="deleteImage(image.id)">🗑 삭제</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 업로드 팝업 -->
    <v-dialog v-model="uploadDialog" max-width="500px">
      <v-card>
        <v-card-title>📸 사진 업로드</v-card-title>
        <v-card-text>
          <v-text-field label="제목" v-model="newImage.title"></v-text-field>
          <v-textarea label="내용" v-model="newImage.description"></v-textarea>
          <v-file-input label="사진 선택" accept="image/*" @change="handleFileUpload"></v-file-input>
          <v-img v-if="previewImage" :src="previewImage" height="200px" contain></v-img>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="uploadDialog = false">취소</v-btn>
          <v-btn color="primary" @click="addImage">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 확대 보기 팝업 (슬라이드 가능) -->
    <v-dialog v-model="imageViewerDialog" max-width="800px">
      <v-card>
        <v-card-title class="popup-title">📷 사진 보기</v-card-title>
        <v-card-text>
          <!-- index가 필요 없는 곳에서는 image만 사용 -->
          <v-carousel v-model="currentImageIndex" hide-delimiters show-arrows>
            <v-carousel-item v-for="image in images" :key="image.id">
              <v-img :src="image.src" height="400px" contain></v-img>
              <v-card-title class="popup-image-title">{{ image.title }}</v-card-title>
              <v-card-text class="popup-image-description">{{ image.description }}</v-card-text>
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
        <v-card-actions>
          <v-btn color="grey" @click="imageViewerDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { fetchGalleryImages, uploadGalleryImage, deleteGalleryImage } from '@/services/authService';

export default {
  name: "GalleryTab",
  props: {
    clubId: [String, Number]
  },
  data() {
    return {
      uploadDialog: false,
      imageViewerDialog: false,
      currentImageIndex: 0,
      images: [],
      newImage: { title: "", description: "", file: null },
      previewImage: null
    };
  },
  mounted() {
    this.loadImages();
  },
  methods: {
    async loadImages() {
      this.images = await fetchGalleryImages(this.clubId);
    },
    openUploadDialog() {
      this.newImage = { title: "", description: "", file: null };
      this.previewImage = null;
      this.uploadDialog = true;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.newImage.file = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async addImage() {
      if (!this.newImage.title || !this.newImage.file) {
        alert("제목과 이미지를 입력하세요.");
        return;
      }
      await uploadGalleryImage(this.clubId, this.newImage);
      this.uploadDialog = false;
      this.loadImages();
    },
    async deleteImage(imageId) {
      await deleteGalleryImage(this.clubId, imageId);
      this.loadImages();
    },
    openImageViewer(index) {
      this.currentImageIndex = index;
      this.imageViewerDialog = true;
    }
  }
};
</script>

<style>
/* 기존 스타일 유지 */
.photo-card {
  margin: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.2s;
  cursor: pointer;
}
.photo-card:hover {
  transform: scale(1.05);
}
.image-title {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
}
.image-description {
  padding: 5px;
  color: #666;
}
.popup-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}
.popup-image-title {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
}
.popup-image-description {
  text-align: center;
  color: #555;
  padding: 10px;
}
.v-carousel .v-btn--variant-text {
  font-size: 8px !important;
  color: gray !important;
}
.v-carousel__controls {
  display: none !important;
}
</style>
  
