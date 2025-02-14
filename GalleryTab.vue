<template>
  <v-container>
    <h2>갤러리</h2>
    <p>동아리 활동 사진을 업로드하고 관리할 수 있습니다.</p>

    <!-- 업로드 버튼 -->
    <v-btn color="primary" @click="openUploadDialog">📷 업로드</v-btn>

    <!-- 사진 목록 (그리드 레이아웃) -->
    <v-row>
      <v-col v-for="(image, index) in images" :key="index" cols="12" sm="6" md="4" lg="3">
        <v-card class="photo-card" @click="openImageViewer(index)">
          <v-img :src="image.src" height="200px" contain></v-img>
          <v-divider></v-divider> <!-- 🔹 구분선 추가 -->
          <v-card-title class="image-title">{{ image.title }}</v-card-title>
          <v-card-text class="image-description">{{ image.description }}</v-card-text>
          <v-card-actions>
            <v-btn color="red" @click.stop="deleteImage(index)">🗑 삭제</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 업로드 팝업 다이얼로그 -->
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
          <v-carousel v-model="currentImageIndex" hide-delimiters show-arrows>
            <v-carousel-item v-for="(image, index) in images" :key="index">
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
export default {
  name: "GalleryTab",
  data() {
    return {
      uploadDialog: false,
      imageViewerDialog: false,
      currentImageIndex: 0,
      images: JSON.parse(localStorage.getItem("galleryImages")) || [],
      newImage: { title: "", description: "", src: "" },
      previewImage: null
    };
  },
  methods: {
    openUploadDialog() {
      this.newImage = { title: "", description: "", src: "" };
      this.previewImage = null;
      this.uploadDialog = true;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result;
          this.newImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    addImage() {
      if (!this.newImage.title || !this.newImage.src) {
        alert("제목과 이미지를 입력하세요.");
        return;
      }
      this.images.push({ ...this.newImage });
      localStorage.setItem("galleryImages", JSON.stringify(this.images));
      this.uploadDialog = false;
    },
    deleteImage(index) {
      this.images.splice(index, 1);
      localStorage.setItem("galleryImages", JSON.stringify(this.images));
    },
    openImageViewer(index) {
      this.currentImageIndex = index;
      this.imageViewerDialog = true;
    }
  }
};
</script>

<style>
/* ✅ 업로드된 사진 카드 스타일 */
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

/* ✅ 제목과 내용 스타일 */
.image-title {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
}
.image-description {
  padding: 5px;
  color: #666;
}

/* ✅ 팝업 제목 및 설명 스타일 */
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

/* ✅ 슬라이드 동그라미(페이지 표시기) 크기 축소 & 색상 변경 */
.v-carousel .v-btn--variant-text {
  font-size: 8px !important; /* 원 크기 줄이기 */
  color: gray !important; /* 색상 회색으로 변경 */
}

/* ✅ 팝업의 아래 검은색 배경 제거 */
.v-carousel__controls {
  display: none !important;
}
</style>
  
