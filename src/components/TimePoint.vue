<template>
  <li :class="{ 'text-gray-900': isLocal }" class="flex items-center gap-1">
    <div class="w-32 text-xs italic">{{ timePoint.title }}</div>
    <div class="font-medium text-lg">{{ value }}</div>
    <span class="material-icons ml-auto font-size-16 cursor-pointer text-gray-500 hover:text-gray-700" @click="edit()"
      >edit</span
    >
    <span
      class="material-icons font-size-16 cursor-pointer text-red-300 hover:text-red-400"
      @click="$emit('remove-time-point', timePoint)"
      >delete</span
    >
  </li>
</template>

<script>
import moment from 'moment-timezone'

export default {
  name: 'TimePoint',
  props: {
    timePoint: {
      type: Object,
      required: true,
    },
    timeZone: {
      type: String,
      required: true,
    },
    isEnglishFormat: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    value() {
      const format = this.isEnglishFormat ? 'hh:mm A' : 'HH:mm'
      return moment.tz(this.timePoint.time, 'HH:mm', this.timePoint.timeZone).tz(this.timeZone).format(format)
    },
    isLocal() {
      return this.timePoint.timeZone === this.timeZone
    },
  },
  methods: {
    edit() {
      this.$emit('edit-time-point', { ...this.timePoint, value: this.value })
    },
  },
}
</script>

<style>
.font-size-16 {
  font-size: 16px !important;
}
</style>
