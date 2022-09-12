<template>
  <div
    :class="isLocale ? 'border-blue-300' : 'border-gray-200'"
    class="border-4 border-double rounded bg-gray-50 relative timezone"
  >
    <button class="flex absolute top-0 right-0 text-red-500 hover:text-red-600" @click="$emit('remove', value)">
      <span class="material-icons">delete</span>
    </button>
    <span
      v-if="!single"
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
    <TimePointList
      v-on="$listeners"
      :time-points="timePoints"
      :time-zone="value"
      :sorting="sorting"
      :is-english-format="isEnglishFormat"
    />
  </div>
</template>

<script>
import moment from 'moment-timezone'
import TimePointList from './TimePointList.vue'

export default {
  name: 'TimeZone',
  components: {
    TimePointList,
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
    single: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isEnglishFormat() {
      return this.format === 'en-En'
    },
    isLocale() {
      return this.value === Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    getCity() {
      const index = this.value.indexOf('/') + 1
      return this.value.slice(index).replaceAll('_', ' ')
    },
    getRegion() {
      const index = this.value.indexOf('/')
      return this.value.slice(0, index)
    },
    getTime() {
      const format = this.isEnglishFormat ? 'hh:mm:ss A' : 'HH:mm:ss'
      return moment(this.time, format).tz(this.value).format(format)
    },
    getDate() {
      const format = this.isEnglishFormat ? 'YYYY/MM/DD' : 'DD.MM.YYYY'
      return moment(this.time, format).tz(this.value).format(format)
    },
    getGMT() {
      const format = 'ZZ'
      return moment().tz(this.value).format(format)
    },
  },
}
</script>

<style>
.timezone {
  width: 360px;
}
</style>
