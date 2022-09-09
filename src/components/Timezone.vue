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
      class="draggable-elements-handle material-icons absolute top-0 left-0 cursor-pointer text-gray-400"
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
      <div class="flex items-center justify-center gap-2">
        <h3 class="text-xl font-bold mb-2">Time points:</h3>
        <MySwitch
          :value="sorting.timeZone === value ? sorting.direction : ''"
          :options="[
            { icon: 'south', value: 'asc' },
            { icon: 'north', value: 'desk' },
          ]"
          icon="sort_by_alpha"
          class="ml-auto"
          @input="$emit('sort', { timeZone: value, direction: $event })"
        />
        <button
          class="p-1 border-2 border-blue-400 hover:border-blue-600 text-blue-500 text-sm font-medium rounded-sm flex items-center gap-1"
          @click="switchAdditional()"
        >
          <span class="material-icons font-size-16">{{
            addition ? "remove" : "add"
          }}</span>
        </button>
      </div>
      <ul v-if="getTimePoints.length" class="px-1 text-gray-600">
        <li
          v-for="(item, index) in getTimePoints"
          :key="index"
          :class="{ 'text-gray-900': item.isLocal }"
          class="flex items-center gap-1"
        >
          <div class="w-32 text-xs italic">{{ item.title }}</div>
          <div class="font-medium text-lg">{{ item.value }}</div>
          <span
            class="material-icons ml-auto font-size-16 cursor-pointer text-gray-500 hover:text-gray-700"
            @click="editTimePoint(item)"
            >edit</span
          >
          <span
            class="material-icons font-size-16 cursor-pointer text-red-300 hover:text-red-400"
            @click="deleteTimePoint(item)"
            >delete</span
          >
        </li>
      </ul>
      <div v-if="addition || editing" class="flex items-center gap-1">
        <input
          v-model="title"
          type="text"
          maxlength="20"
          placeholder="Type a title"
          class="py-1 px-3 border border-grey-100 rounded-sm w-32"
        />
        <input
          v-model="timePoint"
          type="time"
          placeholder="Type a time"
          class="py-1 px-3 border border-grey-100 rounded-sm"
        />
        <button
          class="py-1 px-2 border-2 border-blue-400 hover:border-blue-600 text-blue-500 text-sm font-medium rounded-sm flex items-center gap-1 ml-auto"
          @click="addition ? addTimePoint() : updateTimePoint()"
        >
          {{ addition ? "Add" : "Save" }}
        </button>
        <button class="flex" @click="cancel()">
          <span class="material-icons flex">close</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment-timezone";
import MySwitch from "./MySwitch.vue";

export default {
  name: "Timezone",
  components: {
    MySwitch,
  },
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
    sorting: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    addition: false,
    editing: false,
    selected: null,
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
    getTimePoints() {
      const format = this.isEnglishFormat ? "hh:mm A" : "HH:mm";
      return this.timePoints
        .filter(({ time }) => time !== this.selected?.time)
        .map((item) => {
          const value = moment
            .tz(item.time, "HH:mm", item.timeZone)
            .tz(this.value)
            .format(format);
          return {
            ...item,
            value,
            isLocal: item.timeZone === this.value,
          };
        });
    },
  },
  methods: {
    switchAdditional() {
      this.selected = null;
      this.addition = !this.addition;
      this.title = "";
      this.timePoint = "";
    },
    addTimePoint() {
      const timePoint = {
        title: this.title,
        time: this.timePoint,
        timeZone: this.value,
      };
      this.$emit("add-time-point", timePoint);
      this.switchAdditional();
    },
    updateTimePoint() {
      const timePoint = {
        title: this.title,
        time: this.timePoint,
        timeZone: this.value,
      };
      this.$emit("update-time-point", {
        newValue: timePoint,
        oldValue: this.selected,
      });
      this.cancel();
    },
    editTimePoint(item) {
      this.title = item.title;
      this.timePoint = item.value;
      this.editing = true;
      this.selected = item;
    },
    deleteTimePoint(item) {
      this.$emit("remove-time-point", item);
    },
    cancel() {
      this.selected = null;
      this.editing = false;
      this.addition = false;
      this.title = "";
      this.timePoint = "";
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
