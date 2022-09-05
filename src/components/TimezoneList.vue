<template>
  <div class="px-20 py-10 flex flex-col min-h-screen">
    <div class="mb-6 flex items-center gap-4">
      <h1 class="font-bold text-3xl uppercase mr-auto">Timezones helper</h1>
      <div class="flex items-center">
        <div class="mr-1 font-medium text-sm">Format:</div>
        <div
          :class="
            format === 'ru-Ru'
              ? 'bg-blue-400 text-white'
              : 'bg-gray-400 opacity-20'
          "
          class="flex p-1 cursor-pointer font-bold"
          @click="selectFormat('ru-Ru')"
        >
          RU
        </div>
        <div
          :class="
            format === 'en-En'
              ? 'bg-blue-400 text-white'
              : 'bg-gray-400 opacity-20'
          "
          class="flex p-1 cursor-pointer font-bold"
          @click="selectFormat('en-En')"
        >
          EN
        </div>
      </div>
      <button
        class="py-1 px-3 border-2 border-blue-400 hover:border-blue-600 text-blue-500 text-sm font-medium rounded-sm flex items-center gap-1"
        @click="searchDisplayed = true"
      >
        <span class="material-icons">add</span>
        Add
      </button>
    </div>
    <div
      v-if="selected.length"
      class="flex gap-8 flex-grow items-start flex-wrap"
    >
      <Timezone
        v-for="clock in selected"
        :key="clock.title"
        :value="clock"
        :time="time"
        :time-points="timePoints"
        :format="format"
        @remove="confirmRemoving"
      />
    </div>
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
import ConfirmRemovingModal from "./ConfirmRemovingModal.vue";
import SelectTimeZoneModal from "./SelectTimeZoneModal.vue";
import Timezone from "./Timezone.vue";

export default {
  name: "TimezoneList",
  components: {
    ConfirmRemovingModal,
    SelectTimeZoneModal,
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
  }),
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
    },
    addTimezone(newTimeZone) {
      this.selected.push(newTimeZone);
      this.save();
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
    reorderTimeZones() {
      // ToDo
    },
    confirmRemoving(item) {
      this.removed = item;
    },
    removeTimezone() {
      this.selected = this.selected.filter((item) => item !== this.removed);
      this.removed = null;
      this.save();
    },
    save() {
      localStorage.setItem("timeZones", JSON.stringify(this.selected));
      localStorage.setItem("timePoints", JSON.stringify(this.timePoints));
      localStorage.setItem("format", this.format);
    },
  },
};
</script>

<style></style>
