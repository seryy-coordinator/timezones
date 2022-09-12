<template>
  <div class="md:px-20 px-2 pt-6 pb-2 flex flex-col min-h-screen">
    <div class="mb-6 flex flex-wrap items-center justify-center gap-4">
      <img src="@/assets/images/Earth.png" alt="Earth" class="w-12 h-12" />
      <h1 class="font-bold text-3xl uppercase md:mr-auto text-gray-700">Timezones helper</h1>
      <BaseSwitch
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
      <TimeZone
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
    <NotFound v-else @add-time-zone="addTimeZone" />
    <Recommendations
      :time-zones="timeZones"
      :time-points="timePoints"
      @add-time-zone="addTimeZone"
      @add-time-point="addTimePoint"
    />
    <ConfirmRemovingModal v-if="removed" @remove="removeTimezone()" @close="removed = null" />
    <SelectTimeZoneModal v-if="searchDisplayed" @select="selectTimezone" @close="searchDisplayed = false" />
  </div>
</template>

<script>
import moment from 'moment-timezone'
import draggable from 'vuedraggable'
import BaseSwitch from './base/BaseSwitch.vue'
import ConfirmRemovingModal from './ConfirmRemovingModal.vue'
import NotFound from './NotFound.vue'
import Recommendations from './Recommendations.vue'
import SelectTimeZoneModal from './SelectTimeZoneModal.vue'
import TimeZone from './TimeZone.vue'

export default {
  name: 'TimeZoneList',
  components: {
    draggable,
    BaseSwitch,
    ConfirmRemovingModal,
    NotFound,
    Recommendations,
    SelectTimeZoneModal,
    TimeZone,
  },
  data: () => ({
    timeZones: [],
    timePoints: [],
    time: new Date(),
    format: 'ru-Ru',
    removed: null,
    searchDisplayed: false,
    sorting: { timeZone: '' },
  }),
  computed: {
    getTimePoints() {
      if (this.sorting.timeZone) {
        return this.timePoints
          .map((item) => ({
            ...item,
            sort: moment.tz(item.time, 'HH:mm', item.timeZone).tz(this.sorting.timeZone).format('HH:mm'),
          }))
          .sort(({ sort: a }, { sort: b }) => {
            const result = this.sorting.direction === 'asc' ? a > b : a < b
            return result ? 1 : -1
          })
      }
      return this.timePoints
    },
  },
  created() {
    this.load()
    this.setTimeByTimer()
  },
  methods: {
    load() {
      const timePoints = JSON.parse(localStorage.getItem('timePoints')) || []
      this.timePoints = timePoints.sort((a, b) => a - b)
      this.timeZones = JSON.parse(localStorage.getItem('timeZones')) || []
      this.format = localStorage.getItem('format') || 'ru-Ru'
      this.sorting = JSON.parse(localStorage.getItem('sorting')) || {}
    },
    addTimeZone(newTimeZone) {
      if (!this.timeZones.includes(newTimeZone)) {
        this.timeZones.push(newTimeZone)
        this.save()
      }
    },
    selectTimezone(value) {
      this.addTimeZone(value)
      this.searchDisplayed = false
    },
    selectFormat(format) {
      this.format = format
      this.save()
    },
    setTimeByTimer() {
      setTimeout(() => {
        this.time = new Date()
        this.setTimeByTimer()
      }, 1000)
    },
    reorderTimeZones(list) {
      this.timeZones = list
      this.save()
    },
    confirmRemoving(item) {
      this.removed = item
    },
    removeTimezone() {
      this.timeZones = this.timeZones.filter((item) => item !== this.removed)
      this.removed = null
      this.save()
    },
    addTimePoint(timePoint) {
      this.timePoints.push(timePoint)
      this.save()
    },
    updateTimePoint({ newValue, oldValue }) {
      const index = this.timePoints.findIndex(
        ({ time, timeZone }) => time === oldValue.time && timeZone === oldValue.timeZone
      )
      this.timePoints.splice(index, 1, newValue)
      this.save()
    },
    removeTimePoint(timePoint) {
      this.timePoints = this.timePoints.filter(
        ({ title, timeZone, time }) =>
          timePoint.title !== title || timePoint.timeZone !== timeZone || timePoint.time !== time
      )
      this.save()
    },
    sort(sorting) {
      this.sorting = sorting
      this.save()
    },
    save() {
      localStorage.setItem('timeZones', JSON.stringify(this.timeZones))
      localStorage.setItem('timePoints', JSON.stringify(this.timePoints))
      localStorage.setItem('format', this.format)
      localStorage.setItem('sorting', JSON.stringify(this.sorting))
    },
  },
}
</script>

<style></style>
