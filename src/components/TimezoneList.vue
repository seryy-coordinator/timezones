<template>
  <div class="px-20 py-6 flex flex-col min-h-screen">
    <div class="mb-6 flex items-center gap-4">
      <h1 class="font-bold text-3xl uppercase mr-auto text-gray-700">
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
      v-if="selected.length"
      :value="selected"
      :animation="250"
      tag="div"
      handle=".draggable-elements-handle"
      class="flex gap-8 flex-grow items-start flex-wrap"
      @input="reorderTimeZones"
    >
      <Timezone
        v-for="clock in selected"
        :key="clock.title"
        :value="clock"
        :time="time"
        :time-points="getTimePoints"
        :format="format"
        :sorting="sorting"
        @add-time-point="addTimePoint"
        @remove-time-point="removeTimePoint"
        @remove="confirmRemoving"
        @sort="sort"
      />
    </draggable>
    <div v-else class="flex justify-center items-center flex-grow">
      <div class="border border-blue-200 rounded p-8 bg-blue-50 text-center">
        <p>We do not have selected timezones :(</p>
        <p>
          Our current timezone is <strong class="text-lg">{{ current }}</strong>
        </p>
        <p class="mb-6">Do you want to <strong>select</strong> it?</p>
        <button
          class="py-1 px-3 bg-blue-400 hover:bg-blue-500 text-white text-sm font-medium rounded-sm"
          @click="addTimezone(current)"
        >
          Yes
        </button>
      </div>
    </div>
    <div class="flex items-center justify-center p-1">
      <button
        class="hover:text-blue-600 text-blue-500 underline"
        @click="useRecommended()"
      >
        Use recommend settings
      </button>
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
    selected: [],
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
  },
  created() {
    this.load();
    this.setTimeByTimer();
  },
  methods: {
    load() {
      const timePoints = JSON.parse(localStorage.getItem("timePoints")) || [];
      this.timePoints = timePoints.sort((a, b) => a - b);
      this.selected = JSON.parse(localStorage.getItem("timeZones")) || [];
      this.format = localStorage.getItem("format") || "ru-Ru";
      this.sorting = JSON.parse(localStorage.getItem("sorting")) || {};
    },
    addTimezone(newTimeZone) {
      if (!this.selected.includes(newTimeZone)) {
        this.selected.push(newTimeZone);
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
      this.selected = list;
      this.save();
    },
    confirmRemoving(item) {
      this.removed = item;
    },
    removeTimezone() {
      this.selected = this.selected.filter((item) => item !== this.removed);
      this.removed = null;
      this.save();
    },
    addTimePoint(timePoint) {
      this.timePoints.push(timePoint);
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
      localStorage.setItem("timeZones", JSON.stringify(this.selected));
      localStorage.setItem("timePoints", JSON.stringify(this.timePoints));
      localStorage.setItem("format", this.format);
      localStorage.setItem("sorting", JSON.stringify(this.sorting));
    },
  },
};
</script>

<style></style>
