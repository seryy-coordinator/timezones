<template>
  <div class="flex flex-wrap items-center justify-center mt-4 gap-x-8 md:gap-y-2 gap-y-5 mx-2">
    <div v-if="getRecommendedTimeZones.length" class="flex gap-4">
      <p class="text-sm font-medium mt-2px">Recommended time zones:</p>
      <div class="flex flex-wrap justify-end gap-x-3">
        <button
          v-for="timeZone in getRecommendedTimeZones"
          :key="timeZone.value"
          class="underline hover:text-blue-600 text-blue-500"
          @click="$emit('add-time-zone', timeZone.value)"
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
          @click="$emit('add-time-point', timePoint)"
        >
          {{ timePoint.title }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { refactorTimeZones } from '../api/utils'

const recommendedTimeZones = refactorTimeZones([
  'Asia/Tbilisi',
  'Europe/Minsk',
  'Europe/London',
  'Asia/Ho_Chi_Minh',
  'Asia/Kuala_Lumpur',
  'America/Chicago',
])

const recommendedTimePoints = [
  { title: 'Start work by Minsk', time: '09:00', timeZone: 'Europe/Minsk' },
  { title: 'Lunch by Minsk', time: '13:00', timeZone: 'Europe/Minsk' },
  { title: 'End work by Minsk', time: '18:00', timeZone: 'Europe/Minsk' },
]

export default {
  name: 'Recommendations',
  props: {
    timeZones: {
      type: Array,
      required: true,
    },
    timePoints: {
      type: Array,
      required: true,
    },
  },
  computed: {
    getRecommendedTimeZones() {
      return recommendedTimeZones.filter(({ value }) => !this.timeZones.includes(value))
    },
    getRecommendedTimePoints() {
      return recommendedTimePoints.filter(
        ({ time, timeZone }) => !this.timePoints.some((item) => item.time === time && item.timeZone === timeZone)
      )
    },
  },
}
</script>

<style>
.mt-2px {
  margin-top: 2px;
}
</style>
