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
            <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="attendanceDate" label="출석 날짜" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="attendanceDate" @input="dateMenu = false"></v-date-picker>
            </v-menu>

            <!-- 출석 방식 선택 -->
            <v-select v-model="attendanceType" :items="attendanceTypes" label="출석 방식" prepend-icon="mdi-check"></v-select>

            <!-- 출석 가능 시간 선택 -->
            <v-select v-model="attendanceDuration" :items="['1','10', '20', '30', '40']" label="출석 시간 (분)" prepend-icon="mdi-clock-outline"></v-select>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn text color="red" @click="showAttendanceDialog = false">취소</v-btn>
          <v-btn text color="green" @click="saveAttendanceSettings">저장</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 생성된 출석 체크 리스트 -->
    <v-row>
      <v-col v-for="(attendance, index) in attendanceList" :key="index" cols="12" md="6">
        <v-card class="pa-3 attendance-card">
          <v-card-title>
            <div>출석 날짜: {{ attendance.date }}</div>
            <div>시간: {{ formatTime(attendance.startTime) }} ~ {{ formatTime(attendance.endTime) }}</div>
          </v-card-title>

          <v-card-subtitle>
            <div>방식: {{ attendance.type }}</div>
            <div>설정된 시간: {{ attendance.duration }}분</div>
            <div class="status-text" :class="{'present': attendance.status === '출석', 'absent': attendance.status === '결석'}">
              출석 상태: {{ attendance.status }}
            </div>
          </v-card-subtitle>
          
          <v-card-actions>
            <!-- 출석 버튼 -->
            <v-btn v-if="attendance.type === 'PIN' && isAttendanceOpen(attendance)" color="primary" @click="checkAttendance(index)" class="ml-auto attendance-btn">
              출석
            </v-btn>
            
            <!-- 핀 번호 생성 버튼 (관리자만) -->
            <v-btn v-if="isAdmin && attendance.type === 'PIN'" color="secondary" @click="generatePin(index)" class="ml-2">
              PIN 생성
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dayjs from "dayjs";

export default {
  data() {
    return {
      showAttendanceDialog: false,
      dateMenu: false,
      attendanceDate: dayjs().format("YYYY-MM-DD"),
      attendanceDuration: "",
      attendanceType: "PIN",
      attendanceTypes: ["PIN", "QR", "와이파이"],
      attendanceList: [],
      isAdmin: true, // 관리자 여부 (추후 실제 권한 시스템 적용 필요)
    };
  },
  methods: {
    saveAttendanceSettings() {
      const duration = this.attendanceDuration ? parseInt(this.attendanceDuration) : 10;
      const startTime = dayjs();
      const endTime = startTime.add(duration, "minute");

      this.attendanceList.push({
        date: this.attendanceDate || dayjs().format("YYYY-MM-DD"),
        startTime: startTime.format("HH:mm"),
        endTime: endTime.format("HH:mm"),
        type: this.attendanceType || "미지정",
        pin: null,
        duration: duration,
        status: '결석',
        startTimestamp: startTime.toISOString(),
        endTimestamp: endTime.toISOString(),
      });

      this.resetDialog();
      this.showAttendanceDialog = false;
    },
    resetDialog() {
      this.attendanceDate = dayjs().format("YYYY-MM-DD");
      this.attendanceDuration = "";
      this.attendanceType = "PIN";
    },
    checkAttendance(index) {
      const userPin = prompt("PIN 번호를 입력하세요:");
      if (userPin === this.attendanceList[index].pin?.toString()) {
        alert("출석 완료!");
        this.attendanceList[index].status = '출석';
      } else {
        alert("PIN 번호가 틀렸습니다.");
      }
    },
    generatePin(index) {
      const newPin = Math.floor(1000 + Math.random() * 9000);
      this.attendanceList[index].pin = newPin;
      alert(`새로운 PIN 번호: ${newPin}`);
    },
    isAttendanceOpen(attendance) {
      const currentTime = dayjs();
      const startTime = dayjs(attendance.startTimestamp);
      const endTime = dayjs(attendance.endTimestamp);
      return currentTime.isAfter(startTime) && currentTime.isBefore(endTime);
    },
    formatTime(time) {
      return time ? time : "00:00";
    },
  },
};
</script>

<style scoped>
.attendance-card {
  height: 220px;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.attendance-btn {
  font-weight: bold;
}

.status-text {
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
}

.status-text.present {
  color: green;
}

.status-text.absent {
  color: red;
}
</style>
