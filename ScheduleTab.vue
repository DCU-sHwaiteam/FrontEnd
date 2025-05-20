<template>
  <div class="calendar-container">
    <!-- 캘린더 -->
    <FullCalendar
      class="full-calendar"
      :options="calendarOptions"
      @dateClick="handleDateClick"
    />

    <!-- 일정 추가 폼 -->
    <div class="event-form">
      <input v-model="newEventDate" type="date" />
      <input v-model="newEventTitle" type="text" placeholder="이벤트 제목" />
      <button @click="addEvent">추가</button>
    </div>

    <!-- 일정 목록 -->
    <div class="event-list">
      <h3>📅 이벤트 목록</h3>
      <ul>
        <li v-for="event in events" :key="event.id" :style="{ borderLeft: `5px solid ${event.color}` }">
          <strong>{{ event.date }}</strong> - {{ event.title }}
          <button @click="removeEvent(event.id)">삭제</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import { fetchSchedules, addSchedule, deleteSchedule } from "@/services/authService";

export default {
  components: { FullCalendar },
  props: {
    clubId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      newEventTitle: "",
      newEventDate: "",
      events: [],
      calendarOptions: {
        plugins: [dayGridPlugin],
        initialView: "dayGridMonth",
        height: "auto",
        events: []
      }
    };
  },
  async mounted() {
    await this.loadEvents();
  },
  methods: {
    async loadEvents() {
      try {
        const data = await fetchSchedules(this.clubId);
        this.events = data;
        this.calendarOptions.events = data;
      } catch (e) {
        this.events = [];
        this.calendarOptions.events = [];
      }
    },
    handleDateClick(info) {
      this.newEventDate = info.dateStr;
    },
    async addEvent() {
      if (!this.newEventDate || !this.newEventTitle) {
        alert("날짜와 제목을 입력하세요!");
        return;
      }
      const newEvent = {
        title: this.newEventTitle,
        date: this.newEventDate,
        color: this.getRandomColor()
      };
      try {
        await addSchedule(this.clubId, newEvent);
        await this.loadEvents();
        this.newEventTitle = "";
        this.newEventDate = "";
      } catch (e) {
        alert(e?.message || "일정 추가 실패");
      }
    },
    async removeEvent(eventId) {
      try {
        await deleteSchedule(this.clubId, eventId);
        await this.loadEvents();
      } catch (e) {
        alert(e?.message || "일정 삭제 실패");
      }
    },
    getRandomColor() {
      const colors = ["red", "blue", "green", "purple", "orange"];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }
};
</script>

<style>
.calendar-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.full-calendar {
  width: 100%;
  min-height: 500px;
}

.event-form {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.event-form input {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.event-form button {
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* 📅 일정 목록 스타일 개선 */
.event-list {
  margin-top: 20px;
  padding: 10px;
  width: 100%;
  max-width: 900px;
}

.event-list ul {
  list-style: none;
  padding: 0;
}

.event-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px; /* ✅ 각 일정 간 간격 */
  background: #f9f9f9; /* ✅ 연한 배경 추가 */
  border-left: 5px solid var(--event-color); /* ✅ 좌측 컬러 바 */
  border-radius: 8px; /* ✅ 부드러운 모서리 */
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); /* ✅ 약간의 그림자 효과 */
}

.event-list strong {
  font-size: 16px;
  color: #333;
}

.event-list button {
  background-color: red;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}
</style>
