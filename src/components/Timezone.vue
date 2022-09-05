<template>
  <div
    :class="isLocale ? 'border-blue-300' : 'border-gray-200'"
    class="border-4 border-double rounded bg-gray-50 relative timezone"
  >
    <button
      class="flex absolute top-0 right-0 text-red-500 hover:text-red-600"
      @click="$emit('remove', value)"
    >
      <span class="material-icons">delete</span>
    </button>
    <span
      class="material-icons absolute top-0 left-0 cursor-pointer text-gray-400"
      >drag_indicator</span
    >
    <div class="py-4 px-8 border-b border-gray-200">
      <p class="text-xs uppercase text-gray-600">GMT{{ getGMT }}</p>
      <div class="flex items-end gap-4 justify-between mb-1">
        <h2 class="text-2xl font-bold">{{ getCity }}</h2>
        <p class="text-gray-600">({{ getRegion }})</p>
      </div>
      <div class="text-5xl font-bold">{{ getTime }}</div>
      <div class="flex justify-end text-xs text-gray-600">{{ getDate }}</div>
    </div>
    <div class="p-4 flex flex-col gap-1">
      <div class="flex items-center justify-center">
        <h3 class="text-xl font-bold mb-2">Time points:</h3>
        <button
          class="p-1 bg-blue-400 hover:bg-blue-500 text-white text-sm font-medium rounded-sm flex ml-auto"
          @click="switchAdditional()"
        >
          <span class="material-icons font-size-16">{{
            additionDisplayed ? "remove" : "add"
          }}</span>
        </button>
      </div>
      <ul v-if="timePoints.length" class="p-4">
        <li v-for="timePoint in timePoints" :key="timePoint"></li>
      </ul>
      <div v-if="additionDisplayed" class="flex items-center gap-2">
        <input
          v-model="title"
          type="text"
          maxlength="15"
          placeholder="Type a title"
          class="py-1 px-3 border border-grey-100 rounded-sm w-40"
        />
        <input
          v-model="timePoint"
          type="time"
          placeholder="Type a time"
          class="py-1 px-3 border border-grey-100 rounded-sm"
        />
        <button
          class="py-1 px-2 border-2 border-blue-400 hover:border-blue-600 text-blue-500 text-sm font-medium rounded-sm flex items-center gap-1"
        >
          Add
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";

export default {
  name: "Timezone",
  props: {
    value: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    timePoints: {
      type: Array,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    additionDisplayed: false,
    timePoint: "",
    title: "",
  }),
  computed: {
    isEnglishFormat() {
      return this.format === "en-En";
    },
    isLocale() {
      return this.value === Intl.DateTimeFormat().resolvedOptions().timeZone;
    },
    getCity() {
      const index = this.value.indexOf("/") + 1;
      return this.value.slice(index).replaceAll("_", " ");
    },
    getRegion() {
      const index = this.value.indexOf("/");
      return this.value.slice(0, index);
    },
    getTime() {
      const format = this.isEnglishFormat ? "hh:mm:ss A" : "HH:mm:ss";
      return moment(this.time, format).tz(this.value).format(format);
    },
    getDate() {
      const format = this.isEnglishFormat ? "YYYY/MM/DD" : "DD.MM.YYYY";
      return moment(this.time, format).tz(this.value).format(format);
    },
    getGMT() {
      const format = "ZZ";
      return moment().tz(this.value).format(format);
    },
  },
  methods: {
    switchAdditional() {
      this.additionDisplayed = !this.additionDisplayed;
      this.title = "";
      this.timePoint = "";
    },
    addTimePoint() {
      const timePoint = {
        title: this.title,
        time: this.timePoint, // ToDo
      };
      this.$emit("add-time-point", timePoint);
      this.switchAdditional();
    },
  },
};
</script>

<style>
.font-size-16 {
  font-size: 16px !important;
}
.timezone {
  min-width: 392px;
}
</style>
