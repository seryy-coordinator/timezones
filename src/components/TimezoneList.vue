<template>
  <div class="md:px-20 px-2 pt-6 pb-2 flex flex-col min-h-screen">
    <div class="mb-6 flex flex-wrap items-center justify-center gap-4">
      <img src="@/assets/images/Earth.png" alt="Earth" class="w-12 h-12" />
      <h1 class="font-bold text-3xl uppercase md:mr-auto text-gray-700">
        Timezones helper
      </h1>
      <MySwitch
        v-model="format"
        :options="[
          { label: 'RU', value: 'ru-Ru' },
          { label: 'EN', value: 'en-En' },
        ]"
        label="Format"
      />
      <button
        class="py-1 px-3 border-2 border-blue-400 hover:border-blue-600 text-blue-500 text-sm font-medium rounded-sm flex items-center gap-1"
        @click="searchDisplayed = true"
      >
        <span class="material-icons">add</span>
        Add
      </button>
    </div>
    <draggable
      v-if="timeZones.length"
      :value="timeZones"
      :animation="250"
      tag="div"
      handle=".draggable-elements-handle"
      class="flex gap-8 flex-grow items-start justify-center flex-wrap"
      @input="reorderTimeZones"
    >
      <Timezone
        v-for="clock in timeZones"
        :key="clock.title"
        :value="clock"
        :time="time"
        :time-points="getTimePoints"
        :format="format"
        :sorting="sorting"
        :single="timeZones.length === 1"
        @add-time-point="addTimePoint"
        @update-time-point="updateTimePoint"
        @remove-time-point="removeTimePoint"
        @remove="confirmRemoving"
        @sort="sort"
      />
    </draggable>
    <div v-else class="flex justify-center items-center flex-grow">
      <div class="border border-blue-200 rounded p-8 bg-blue-50 text-center">
        <p>You don't have selected timezones :(</p>
        <p>
          Your current timezone is
          <strong class="text-lg">{{ current }}</strong>
        </p>
        <p class="mb-3">Do you want to <strong>add</strong> it?</p>
        <button
          class="py-1 px-3 bg-blue-400 hover:bg-blue-500 text-white text-sm font-medium rounded-sm"
          @click="addTimezone(current)"
        >
          Yes
        </button>
      </div>
    </div>
    <div
      class="flex flex-wrap items-center justify-center mt-4 gap-x-8 md:gap-y-2 gap-y-5 mx-2"
    >
      <div v-if="getRecommendedTimeZones.length" class="flex gap-4">
        <p class="text-sm font-medium mt-2px">Recommended time zones:</p>
        <div class="flex flex-wrap justify-end gap-x-3">
          <button
            v-for="timeZone in getRecommendedTimeZones"
            :key="timeZone.value"
            class="underline hover:text-blue-600 text-blue-500"
            @click="addTimezone(timeZone.value)"
          >
            {{ timeZone.title }}
          </button>
        </div>
      </div>
      <div v-if="getRecommendedTimePoints.length" class="flex gap-4">
        <p class="text-sm font-medium mt-2px">Recommended time points:</p>
        <div class="flex flex-wrap justify-end gap-x-3">
          <button
            v-for="timePoint in getRecommendedTimePoints"
            :key="timePoint.time"
            class="underline hover:text-blue-600 text-blue-500"
            @click="addTimePoint(timePoint)"
          >
            {{ timePoint.title }}
          </button>
        </div>
      </div>
    </div>
    <ConfirmRemovingModal
      v-if="removed"
      @remove="removeTimezone()"
      @close="removed = null"
    />
    <SelectTimeZoneModal
      v-if="searchDisplayed"
      @select="selectTimezone"
      @close="searchDisplayed = false"
    />
  </div>
</template>

<script>
import moment from "moment-timezone";
import draggable from "vuedraggable";
import ConfirmRemovingModal from "./ConfirmRemovingModal.vue";
import SelectTimeZoneModal from "./SelectTimeZoneModal.vue";
import MySwitch from "./MySwitch.vue";
import Timezone from "./Timezone.vue";
import { refactorTimeZones } from "../api/utils";

const recommendedTimeZones = refactorTimeZones([
  "Asia/Tbilisi",
  "Europe/Minsk",
  "Europe/London",
  "Asia/Ho_Chi_Minh",
  "Asia/Kuala_Lumpur",
  "America/Chicago",
]);

const recommendedTimePoints = [
  { title: "Start work by Minsk", time: "09:00", timeZone: "Europe/Minsk" },
  { title: "Lunch by Minsk", time: "13:00", timeZone: "Europe/Minsk" },
  { title: "End work by Minsk", time: "18:00", timeZone: "Europe/Minsk" },
];

export default {
  name: "TimezoneList",
  components: {
    draggable,
    ConfirmRemovingModal,
    SelectTimeZoneModal,
    MySwitch,
    Timezone,
  },
  data: () => ({
    timeZones: [],
    timePoints: [],
    current: Intl.DateTimeFormat().resolvedOptions().timeZone,
    time: new Date(),
    format: "ru-Ru",
    removed: null,
    searchDisplayed: false,
    sorting: { timeZone: "" },
  }),
  computed: {
    getTimePoints() {
      if (this.sorting.timeZone) {
        return this.timePoints
          .map((item) => ({
            ...item,
            sort: moment
              .tz(item.time, "HH:mm", item.timeZone)
              .tz(this.sorting.timeZone)
              .format("HH:mm"),
          }))
          .sort(({ sort: a }, { sort: b }) => {
            const result = this.sorting.direction === "asc" ? a > b : a < b;
            return result ? 1 : -1;
          });
      }
      return this.timePoints;
    },
    getRecommendedTimeZones() {
      return recommendedTimeZones.filter(
        ({ value }) => !this.timeZones.includes(value)
      );
    },
    getRecommendedTimePoints() {
      return recommendedTimePoints.filter(
        ({ time, timeZone }) =>
          !this.timePoints.some(
            (item) => item.time === time && item.timeZone === timeZone
          )
      );
    },
  },
  created() {
    this.load();
    this.setTimeByTimer();
  },
  methods: {
    load() {
      const timePoints = JSON.parse(localStorage.getItem("timePoints")) || [];
      this.timePoints = timePoints.sort((a, b) => a - b);
      this.timeZones = JSON.parse(localStorage.getItem("timeZones")) || [];
      this.format = localStorage.getItem("format") || "ru-Ru";
      this.sorting = JSON.parse(localStorage.getItem("sorting")) || {};
    },
    addTimezone(newTimeZone) {
      if (!this.timeZones.includes(newTimeZone)) {
        this.timeZones.push(newTimeZone);
        this.save();
      }
    },
    selectTimezone(value) {
      this.addTimezone(value);
      this.searchDisplayed = false;
    },
    selectFormat(format) {
      this.format = format;
      this.save();
    },
    setTimeByTimer() {
      setTimeout(() => {
        this.time = new Date();
        this.setTimeByTimer();
      }, 1000);
    },
    useRecommended() {
      // ToDo
    },
    reorderTimeZones(list) {
      this.timeZones = list;
      this.save();
    },
    confirmRemoving(item) {
      this.removed = item;
    },
    removeTimezone() {
      this.timeZones = this.timeZones.filter((item) => item !== this.removed);
      this.removed = null;
      this.save();
    },
    addTimePoint(timePoint) {
      this.timePoints.push(timePoint);
      this.save();
    },
    updateTimePoint({ newValue, oldValue }) {
      const index = this.timePoints.findIndex(
        ({ time, timeZone }) =>
          time === oldValue.time && timeZone === oldValue.timeZone
      );
      this.timePoints.splice(index, 1, newValue);
      this.save();
    },
    removeTimePoint(timePoint) {
      this.timePoints = this.timePoints.filter(
        ({ title, timeZone, time }) =>
          timePoint.title !== title ||
          timePoint.timeZone !== timeZone ||
          timePoint.time !== time
      );
      this.save();
    },
    sort(sorting) {
      this.sorting = sorting;
      this.save();
    },
    save() {
      localStorage.setItem("timeZones", JSON.stringify(this.timeZones));
      localStorage.setItem("timePoints", JSON.stringify(this.timePoints));
      localStorage.setItem("format", this.format);
      localStorage.setItem("sorting", JSON.stringify(this.sorting));
    },
  },
};
</script>

<style>
.mt-2px {
  margin-top: 2px;
}
</style>
