<template>
  <v-container class="gallery-container">
    <!-- 상단 제목/추가 버튼 (중앙 세로 정렬) -->
    <div class="gallery-header">
      <div class="gallery-title">갤러리</div>
      <v-btn class="gallery-add-btn" @click="openUploadDialog">추가</v-btn>
    </div>

    <!-- 사진 카드 리스트 -->
    <v-row justify="center">
      <v-col
        v-for="(image, index) in images"
        :key="image.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="d-flex justify-center"
      >
        <div class="photo-card" @click="openImageViewer(index)">
          <div class="photo-preview">
            <div class="photo-preview-inner">
              <span v-if="!image.src" class="preview-placeholder">사진 미리보기</span>
              <img v-else :src="image.src" alt="사진" />
            </div>
          </div>
          <div class="photo-info">
            <div class="photo-title">{{ image.title }}</div>
            <div class="photo-desc">{{ image.description }}</div>
            <div class="photo-delete" @click.stop="deleteImage(image.id)">삭제</div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- 사진 추가 팝업 -->
    <v-dialog v-model="uploadDialog" max-width="480px" content-class="gallery-upload-dialog">
      <div class="gallery-popup-card">
        <div class="popup-title">사진 추가</div>
        <div class="popup-input-label">제목</div>
        <input class="popup-input" v-model="newImage.title" placeholder="제목" />
        <div class="popup-input-label">내용</div>
        <textarea class="popup-textarea" v-model="newImage.description" placeholder="내용"></textarea>
        <div class="popup-input-label">사진 선택</div>
        <div class="popup-file-select">
          <input type="file" accept="image/*" @change="handleFileUpload" />
        </div>
        <div class="popup-preview-label">사진 미리보기</div>
        <div class="popup-preview-box">
          <span v-if="!previewImage" class="preview-placeholder">사진 미리보기</span>
          <img v-else :src="previewImage" alt="미리보기" />
        </div>
        <div class="popup-btn-row">
          <button class="popup-btn cancel" @click="uploadDialog = false">취소</button>
          <button class="popup-btn add" @click="addImage">추가</button>
        </div>
      </div>
    </v-dialog>

    <!-- 사진 상세 팝업 -->
    <v-dialog v-model="imageViewerDialog" max-width="800px" content-class="gallery-view-dialog">
      <div class="gallery-popup-card-large">
        <div class="popup-title">{{ images[currentImageIndex]?.title || '사진 제목' }}</div>
        <div class="popup-preview-box-large">
          <span v-if="!images[currentImageIndex]?.src" class="preview-placeholder">사진 미리보기</span>
          <img
            v-else
            :src="images[currentImageIndex].src"
            alt="사진"
            class="popup-image"
          />
        </div>
        <div class="popup-desc-box">
          <div class="popup-desc">{{ images[currentImageIndex]?.description || '사진 설명' }}</div>
        </div>
        <div class="popup-btn-row">
          <button class="popup-btn add" @click="imageViewerDialog = false">닫기</button>
        </div>
      </div>
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

<style scoped>
.gallery-container {
  padding-top: 32px;
}

/* 중앙 세로 정렬 헤더 */
.gallery-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 18px;
}
.gallery-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 10px;
}
.gallery-add-btn {
  background: #b8b4e3 !important;
  color: #fff !important;
  font-weight: 500;
  min-width: 140px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  margin-bottom: 18px;
}

/* 이하 기존 스타일 유지 (생략 없이 전체) */
.photo-card {
  background: #eef0fb;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  width: 240px;
  min-height: 260px;
  margin: 18px 10px 18px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  border: none;
  position: relative;
}
.photo-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.13);
  transform: translateY(-2px) scale(1.01);
}
.photo-preview {
  width: 90%;
  height: 100px;
  margin-top: 24px;
  background: #e5e5ee;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.photo-preview-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.photo-preview img {
  max-width: 100%;
  max-height: 80px;
  object-fit: contain;
}
.preview-placeholder {
  color: #999;
  font-size: 1rem;
  text-align: center;
}
.photo-info {
  width: 100%;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 12px;
}
.photo-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 2px;
}
.photo-desc {
  font-size: 1rem;
  color: #555;
  margin-bottom: 10px;
}
.photo-delete {
  color: #d56c6c;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 2px;
  transition: color 0.15s;
}
.photo-delete:hover {
  color: #b82c2c;
  text-decoration: underline;
}

/* 팝업 공통 카드 */
.gallery-popup-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.13);
  padding: 36px 36px 24px 36px;
  min-width: 340px;
  max-width: 440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.gallery-popup-card-large {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.13);
  padding: 36px 48px 24px 48px;
  min-width: 600px;
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.popup-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 32px;
  color: #222;
}
.popup-input-label {
  font-size: 1rem;
  color: #333;
  margin-bottom: 6px;
  font-weight: 500;
  width: 100%;
  text-align: left;
  margin-top: 12px;
}
.popup-input,
.popup-textarea {
  width: 100%;
  border-radius: 10px;
  border: none;
  background: #e5e5ee;
  padding: 10px 14px;
  margin-bottom: 8px;
  font-size: 1rem;
  outline: none;
  resize: none;
}
.popup-input::placeholder,
.popup-textarea::placeholder {
  color: #aaa;
}
.popup-file-select {
  width: 100%;
  background: #e5e5ee;
  border-radius: 10px;
  padding: 12px 10px;
  text-align: center;
  margin-bottom: 8px;
}
.popup-file-select input[type="file"] {
  width: 100%;
}
.popup-preview-label {
  font-size: 1rem;
  color: #888;
  margin: 8px 0 4px 0;
  text-align: left;
  width: 100%;
}
.popup-preview-box {
  width: 100%;
  height: 100px;
  background: #e5e5ee;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}
.popup-preview-box img {
  max-width: 100%;
  max-height: 80px;
  object-fit: contain;
}

/* 팝업 상세 이미지(크기 확대) */
.popup-preview-box-large {
  width: 100%;
  height: 400px;
  background: #e5e5ee;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0;
  padding: 20px;
}
.popup-preview-box-large img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.popup-btn-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
}
.popup-btn {
  min-width: 80px;
  padding: 8px 0;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  background: #b8b4e3;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s;
}
.popup-btn.cancel {
  background: #a9a9b5;
}
.popup-btn.add {
  background: #b8b4e3;
}
.popup-btn.cancel:hover {
  background: #88889a;
}
.popup-btn.add:hover {
  background: #9d9ac8;
}
.popup-desc-box {
  width: 100%;
  margin-bottom: 8px;
}
.popup-desc {
  width: 100%;
  background: #e5e5ee;
  border-radius: 10px;
  padding: 12px 0;
  color: #555;
  font-size: 1.1rem;
  text-align: center;
}
</style>
  
