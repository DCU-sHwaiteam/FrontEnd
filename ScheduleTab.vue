<template>
  <div class="calendar-container">
    <FullCalendar
      class="full-calendar"
      :options="calendarOptions"
      @dateClick="handleDateClick"
    />
    <div class="event-list">
      <h3>📅 이벤트 목록</h3>
      <ul>
        <li v-for="event in events" :key="event.id" :style="{ borderLeft: `5px solid ${event.color}` }">
          <strong>{{ event.date }}</strong> - {{ event.title }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";

export default {
  components: { FullCalendar },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin],
        initialView: "dayGridMonth",
        height: "auto", // ✅ 캘린더 높이를 자동으로 조절
        events: [
          { id: 1, title: "정시모집 합격자 발표 및 등록", date: "2025-02-07", color: "purple" },
          { id: 2, title: "2025-1학기 수강신청", date: "2025-02-17", color: "red" },
          { id: 3, title: "2025-1학기 등록", date: "2025-02-20", color: "blue" },
          { id: 4, title: "추가모집 원서접수 및 합격자 발표, 등록", date: "2025-02-21", color: "lightblue" },
          { id: 5, title: "전기 학위수여식", date: "2025-02-21", color: "purple" }
        ]
      }
    };
  },
  methods: {
    handleDateClick(info) {
      alert(`날짜 선택됨: ${info.dateStr}`);
    }
  }
};
</script>

<style>
.calendar-container {
  width: 100%;
  max-width: 900px; /* ✅ 캘린더 최대 크기 지정 */
  margin: 0 auto;
  padding: 20px;
}

.full-calendar {
  width: 100%; /* ✅ 캘린더가 화면에 꽉 차도록 설정 */
  min-height: 500px;
}

.event-list {
  margin-top: 20px;
  padding: 10px;
  width: 100%;
  max-width: 900px;
}
</style>
