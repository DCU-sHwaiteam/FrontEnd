<template>
  <v-container>
    <h1>출석체크 페이지</h1>

    <!-- 플러스 아이콘 (우측 상단 고정) -->
    <v-btn icon color="primary" @click="showAttendanceDialog = true" class="add-attendance-btn">
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- 출석 체크 팝업 -->
    <v-dialog v-model="showAttendanceDialog" max-width="500px">
      <v-card>
        <v-card-title>출석 체크 설정</v-card-title>
        <v-card-text>
          <v-form>
            <!-- 날짜 선택 -->
            <v-menu
              ref="dateMenu"
              v-model="dateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="attendanceDate"
                  label="출석 날짜"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="attendanceDate" @input="dateMenu = false"></v-date-picker>
            </v-menu>

            <!-- 시작 시간 선택 -->
            <v-text-field
              v-model="startTime"
              label="시작 시간"
              type="time"
              prepend-icon="mdi-clock-start"
            ></v-text-field>

            <!-- 종료 시간 선택 -->
            <v-text-field
              v-model="endTime"
              label="종료 시간"
              type="time"
              prepend-icon="mdi-clock-end"
            ></v-text-field>

            <!-- 출석 방식 선택 -->
            <v-select
              v-model="attendanceType"
              :items="attendanceTypes"
              label="출석 방식"
              prepend-icon="mdi-check"
            ></v-select>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn text color="red" @click="showAttendanceDialog = false">취소</v-btn>
          <v-btn text color="green" @click="saveAttendanceSettings">저장</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      showAttendanceDialog: false,
      dateMenu: false,
      attendanceDate: '',
      startTime: '',
      endTime: '',
      attendanceType: '',
      attendanceTypes: ['PIN', 'QR', '와이파이']
    };
  },
  methods: {
    saveAttendanceSettings() {
      console.log("출석 날짜:", this.attendanceDate);
      console.log("시작 시간:", this.startTime);
      console.log("종료 시간:", this.endTime);
      console.log("출석 방식:", this.attendanceType);
      this.showAttendanceDialog = false;
    }
  }
};
</script>

<style scoped>
.add-attendance-btn {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 10;
}
</style>



  
  
  
  