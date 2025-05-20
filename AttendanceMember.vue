<template>
  <v-container>
    <div class="d-flex justify-space-between align-center">
      <h1>출석 체크 페이지</h1>
      <v-btn 
        color="primary" 
        @click="openCreateAttendanceDialog" 
        v-if="isAdmin"
      >
        출석 생성
      </v-btn>
    </div>

    <!-- 출석 리스트 (원형 버튼 형태) -->
    <v-row>
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

    <!-- 출석 체크 팝업 (멤버용) -->
    <v-dialog v-model="showAttendanceDialog" max-width="400px">
      <v-card>
        <v-card-title>
          <span>{{ currentWeek }}주차 출석 체크</span>
        </v-card-title>

        <v-card-text>
          <v-chip 
            v-if="attendanceList[currentWeek - 1]?.type === 'PIN'" 
            class="otp-pin"
          >
            {{ attendanceList[currentWeek - 1].pin }}
          </v-chip>
          <p v-if="attendanceList[currentWeek - 1]?.type">
            출석 방식: {{ attendanceList[currentWeek - 1].type }}
          </p>
          <p>출석 가능 시간: {{ attendanceList[currentWeek - 1]?.time }}</p>

          <v-text-field 
            v-if="attendanceList[currentWeek - 1]?.type === 'PIN'" 
            label="PIN 입력" 
            v-model="inputPin"
          ></v-text-field>
          <p v-else-if="!attendanceList[currentWeek - 1]?.type">
            아직 출석이 생성되지 않았습니다.
          </p>
        </v-card-text>

        <v-card-actions class="d-flex justify-space-between align-center">
          <v-btn
            v-if="isAdmin"
            color="error"
            @click="confirmDeleteAttendance"
          >
            출석 삭제
          </v-btn>
          <div>
            <v-btn text color="red" @click="showAttendanceDialog = false">닫기</v-btn>
            <v-btn
              v-if="attendanceList[currentWeek - 1]?.type === 'PIN'"
              color="primary"
              @click="checkAttendance"
            >
              출석
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 출석 생성 팝업 (관리자용) -->
    <v-dialog v-model="showCreateAttendanceDialog" max-width="400px">
      <v-card>
        <v-card-title>출석 생성</v-card-title>
        <v-card-text>
          <v-select 
            v-model="selectedWeek" 
            :items="weeks" 
            label="출석 주차 선택"
          ></v-select>
          <v-select 
            v-model="attendanceType" 
            :items="attendanceTypes" 
            label="출석 방식"
          ></v-select>
          <v-text-field 
            v-model="attendanceTime" 
            label="출석 마감 시간 (HH:MM 형식)" 
            type="time"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn text color="red" @click="showCreateAttendanceDialog = false">취소</v-btn>
          <v-btn color="green" @click="createAttendance">출석 생성</v-btn>
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
    this.refreshInterval = setInterval(() => {
      this.loadAttendanceList();
    }, 60000);
  },
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
  watch: {
    clubId: {
      immediate: true,
      handler(newVal) {
        if (newVal) this.loadAttendanceList();
      }
    }
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
      // 마감 시간 체크 (프론트에서도, 하지만 서버가 최종 판정)
      if (this.isAttendanceClosed(this.currentWeek - 1)) {
        alert("출석 시간이 종료되었습니다.");
        return;
      }
      if (attendance.type === "PIN") {
        try {
          await markAttendance(this.clubId, this.currentWeek, this.inputPin);
          await this.loadAttendanceList();
          this.showAttendanceDialog = false;
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
    getAttendanceColor(status, time) {
      if (this.isAttendanceClosed(time)) return "gray";
      return status === "출석" ? "green" 
           : status === "결석" ? "red" 
           : status === "미생성" ? "gray"
           : "gray";
    },
    // ✅ 시간대 변환 없이 브라우저 로컬 시간 사용
    isAttendanceClosed(index) {
      const time = this.attendanceList[index]?.time;
      if (!time) return false;

      const now = new Date(); // 브라우저 로컬 시간(KST 환경이면 KST)
      const [hours, minutes] = time.split(":").map(Number);
      const attendanceDeadline = new Date(now);
      attendanceDeadline.setHours(hours, minutes, 0, 0);

      return now > attendanceDeadline;
    },
  }
};
</script>

<style scoped>
.attendance-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.attendance-circle:hover {
  transform: scale(1.1);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
}

.otp-pin {
  background-color: #ffcc00;
  color: black;
  font-weight: bold;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  position: absolute;
  right: 16px;
  top: 16px;
}
</style>

