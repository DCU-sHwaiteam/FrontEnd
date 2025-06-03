<template>
  <v-container class="attendance-member-container">
    <!-- 상단 헤더 -->
    <div class="attendance-header">
      <div class="attendance-title">출석 체크</div>
      <div class="attendance-header-btns">
        <v-btn class="attendance-list-btn" @click="goToAttendancePage">
          출석 명부
        </v-btn>
        <v-btn
          v-if="isAdmin"
          class="attendance-create-btn"
          @click="openCreateAttendanceDialog"
        >
          출석 생성
        </v-btn>
      </div>
    </div>

    <!-- 주차별 출석 버튼 -->
    <v-row class="attendance-circle-row">
      <v-col
        v-for="(attendance, index) in attendanceList"
        :key="index"
        cols="3"
        md="2"
        class="d-flex justify-center"
      >
        <v-btn
          :color="getAttendanceColor(attendance.status, attendance.time)"
          class="attendance-circle"
          @click="openAttendanceDialog(index)"
        >
          {{ index + 1 }}주차
        </v-btn>
      </v-col>
    </v-row>

    <!-- 출석 체크 팝업 -->
    <v-dialog v-model="showAttendanceDialog" max-width="420px">
      <v-card class="attendance-popup-card">
        <v-card-title class="attendance-popup-title">
          {{ currentWeek }}주차 출석 체크
        </v-card-title>
        <v-card-text>
          <!-- 관리자만 PIN 번호 확인 가능 -->
          <v-chip
            v-if="isAdmin && attendanceList[currentWeek - 1]?.type === 'PIN'"
            class="otp-pin"
          >
            {{ attendanceList[currentWeek - 1].pin }}
          </v-chip>
          <div class="attendance-popup-info">
            <div v-if="attendanceList[currentWeek - 1]?.type">
              <span class="popup-label">출석 방식:</span>
              <span class="popup-value">{{ attendanceList[currentWeek - 1].type }}</span>
            </div>
            <div>
              <span class="popup-label">출석 가능 시간:</span>
              <span class="popup-value">{{ attendanceList[currentWeek - 1]?.time || '-' }}</span>
            </div>
          </div>
          <v-text-field
            v-if="attendanceList[currentWeek - 1]?.type === 'PIN'"
            label="PIN 입력"
            v-model="inputPin"
            outlined
            dense
            hide-details
          ></v-text-field>
          <p v-else-if="!attendanceList[currentWeek - 1]?.type" class="popup-empty">
            아직 출석이 생성되지 않았습니다.
          </p>
        </v-card-text>
        <v-card-actions class="attendance-popup-actions">
          <v-btn
            v-if="isAdmin"
            color="error"
            @click="confirmDeleteAttendance"
          >
            출석 삭제
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="showAttendanceDialog = false">닫기</v-btn>
          <v-btn
            v-if="attendanceList[currentWeek - 1]?.type === 'PIN'"
            color="primary"
            @click="checkAttendance"
          >
            출석
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 출석 생성 팝업 (관리자용) -->
    <v-dialog v-model="showCreateAttendanceDialog" max-width="480px">
      <v-card class="attendance-popup-card">
        <v-card-title>출석 생성</v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedWeek"
            :items="weeks"
            label="출석 주차"
            outlined
          ></v-select>
          <v-select
            v-model="attendanceType"
            :items="attendanceTypes"
            label="출석 방식"
            outlined
          ></v-select>
          <v-text-field
            v-model="attendanceTime"
            label="출석 마감 시간 (HH:MM)"
            type="time"
            outlined
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showCreateAttendanceDialog = false">취소</v-btn>
          <v-btn color="primary" @click="createAttendance">생성</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 출석 성공 알림 팝업 -->
    <v-dialog v-model="showSuccessDialog" max-width="320px">
      <v-card>
        <v-card-title class="success-title">출석에 성공했습니다</v-card-title>
        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="showSuccessDialog = false">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {
  fetchAttendanceList,
  createAttendanceRecord,
  markAttendance,
  deleteAttendanceRecord
} from '@/services/authService';

export default {
  props: {
    clubId: {
      type: [String, Number],
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showAttendanceDialog: false,
      showCreateAttendanceDialog: false,
      showSuccessDialog: false,
      currentWeek: 1,
      selectedWeek: 1,
      attendanceType: "PIN",
      attendanceTime: "",
      attendanceTypes: ["PIN", "QR", "와이파이"],
      weeks: Array.from({ length: 16 }, (_, i) => i + 1),
      attendanceList: Array.from({ length: 16 }, (_, i) => ({
        week: i + 1,
        status: '미생성',
        type: null,
        time: null,
        pin: null
      })),
      inputPin: "",
      refreshInterval: null
    };
  },
  mounted() {
    this.loadAttendanceList();
    this.refreshInterval = setInterval(this.loadAttendanceList, 60000);
  },
  beforeUnmount() {
    clearInterval(this.refreshInterval);
  },
  methods: {
    async loadAttendanceList() {
      try {
        const serverData = await fetchAttendanceList(this.clubId);
        this.attendanceList = this.attendanceList.map(local => {
          const serverItem = serverData.find(item => item.week === local.week);
          return serverItem ? { ...local, ...serverItem } : local;
        });
      } catch (error) {
        console.error("출석 리스트 불러오기 실패", error);
      }
    },
    openAttendanceDialog(index) {
      this.currentWeek = index + 1;
      this.inputPin = "";
      this.showAttendanceDialog = true;
    },
    openCreateAttendanceDialog() {
      this.showCreateAttendanceDialog = true;
    },
    async createAttendance() {
      try {
        await createAttendanceRecord(this.clubId, {
          week: this.selectedWeek,
          type: this.attendanceType,
          time: this.attendanceTime
        });
        await this.loadAttendanceList();
        this.showCreateAttendanceDialog = false;
      } catch (error) {
        alert("출석 생성 실패: " + (error.response?.data?.message || "서버 오류"));
      }
    },
    async checkAttendance() {
      const attendance = this.attendanceList[this.currentWeek - 1];
      if (this.isAttendanceClosed(this.currentWeek - 1)) {
        alert("출석 시간이 종료되었습니다.");
        return;
      }
      if (attendance.type === "PIN") {
        try {
          await markAttendance(this.clubId, this.currentWeek, this.inputPin);
          await this.loadAttendanceList();
          this.showAttendanceDialog = false;
          this.showSuccessDialog = true;
        } catch (error) {
          alert(error.response?.data?.message || "출석 체크 실패");
        }
      }
    },
    async confirmDeleteAttendance() {
      if (confirm("정말로 이 주차의 출석을 삭제하시겠습니까?")) {
        try {
          await deleteAttendanceRecord(this.clubId, this.currentWeek);
          await this.loadAttendanceList();
          this.showAttendanceDialog = false;
        } catch (error) {
          alert(error.response?.data?.message || "출석 삭제 실패");
        }
      }
    },
    // 출석 성공시 초록색 유지, 출석 전엔 시간 만료시 회색
    getAttendanceColor(status, time) {
      if (status === "출석") return "green";
      if (status === "결석") return "red";
      if (status === "미생성") return "grey";
      // 출석/결석/미생성이 아닌 경우만 시간 체크
      if (this.isAttendanceClosed(time)) return "grey";
      return "grey";
    },
    isAttendanceClosed(indexOrTime) {
      let time;
      if (typeof indexOrTime === "number") {
        time = this.attendanceList[indexOrTime]?.time;
      } else {
        time = indexOrTime;
      }
      if (!time) return false;
      const now = new Date();
      const [hours, minutes] = time.split(":").map(Number);
      const attendanceDeadline = new Date(now);
      attendanceDeadline.setHours(hours, minutes, 0, 0);
      return now > attendanceDeadline;
    },
    goToAttendancePage() {
      this.$router.push({
        name: 'AttendancePage',
        params: { id: this.clubId }
      });
    }
  }
};
</script>

<style scoped>
.attendance-member-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 16px;
}

.attendance-header {
  text-align: center;
  margin-bottom: 32px;
}

.attendance-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 16px;
}

.attendance-header-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.attendance-list-btn,
.attendance-create-btn {
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: normal;
}

.attendance-list-btn {
  background: #b8b4e3 !important;
  color: white !important;
}

.attendance-create-btn {
  background: #8f9cfb !important;
  color: white !important;
}

.attendance-circle-row {
  margin: 0 -8px;
}

.attendance-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  transition: transform 0.2s;
}

.attendance-circle:hover {
  transform: scale(1.05);
}

.attendance-popup-card {
  padding: 24px;
  border-radius: 16px !important;
}

.attendance-popup-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 16px;
}

.attendance-popup-info {
  margin-bottom: 16px;
}

.popup-label {
  color: #666;
  margin-right: 8px;
}

.popup-value {
  color: #222;
  font-weight: 500;
}

.otp-pin {
  background: #ffd700 !important;
  color: black !important;
  font-weight: bold;
  margin-bottom: 16px;
}

.attendance-popup-actions {
  padding-top: 16px;
}

.success-title {
  text-align: center;
  font-size: 1.1rem;
  font-weight: bold;
  color: #222;
  margin: 24px 0 8px 0;
}
</style>

