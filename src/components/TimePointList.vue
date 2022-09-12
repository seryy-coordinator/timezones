<template>
  <div class="p-4 flex flex-col gap-1">
    <div class="flex items-center justify-center gap-2">
      <h3 class="text-xl font-bold mb-2">Time points:</h3>
      <BaseSwitch
        :value="sorting.timeZone === timeZone ? sorting.direction : ''"
        :options="[
          { image: 'sort_numeric_ascending.svg', value: 'asc' },
          { image: 'sort_numeric_descending.svg', value: 'desk' },
        ]"
        class="ml-auto"
        @input="$emit('sort', { timeZone, direction: $event })"
      />
      <button
        class="p-1 border-2 border-blue-400 hover:border-blue-600 text-blue-500 text-sm font-medium rounded-sm flex items-center gap-1"
        @click="switchAdditional()"
      >
        <span class="material-icons font-size-16">{{ addition ? 'remove' : 'add' }}</span>
      </button>
    </div>
    <ul v-if="getTimePoints.length" class="px-1 text-gray-600">
      <TimePoint
        v-for="(item, index) in getTimePoints"
        v-on="$listeners"
        :key="index"
        :time-point="item"
        :time-zone="timeZone"
        @edit-time-point="editTimePoint"
      />
    </ul>
    <div v-if="addition || editing" class="flex items-center gap-1">
      <input
        v-model="title"
        type="text"
        maxlength="20"
        placeholder="Type a title"
        class="py-1 px-3 border border-grey-100 rounded-sm w-28"
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
        {{ addition ? 'Add' : 'Save' }}
      </button>
      <button class="flex" @click="cancel()">
        <span class="material-icons flex">close</span>
      </button>
    </div>
  </div>
</template>

<script>
import BaseSwitch from './base/BaseSwitch.vue'
import TimePoint from './TimePoint.vue'

export default {
  name: 'TimePointList',
  components: {
    BaseSwitch,
    TimePoint,
  },
  props: {
    timePoints: {
      type: Array,
      required: true,
    },
    timeZone: {
      type: String,
      required: true,
    },
    sorting: {
      type: Object,
      required: true,
    },
    isEnglishFormat: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    addition: false,
    editing: false,
    selected: null,
    timePoint: '',
    title: '',
  }),
  computed: {
    getTimePoints() {
      return this.timePoints.filter(({ time }) => time !== this.selected?.time)
    },
  },
  methods: {
    switchAdditional() {
      this.selected = null
      this.addition = !this.addition
      this.title = ''
      this.timePoint = ''
    },
    addTimePoint() {
      const timePoint = {
        title: this.title,
        time: this.timePoint,
        timeZone: this.timeZone,
      }
      this.$emit('add-time-point', timePoint)
      this.switchAdditional()
    },
    updateTimePoint() {
      const timePoint = {
        title: this.title,
        time: this.timePoint,
        timeZone: this.timeZone,
      }
      this.$emit('update-time-point', {
        newValue: timePoint,
        oldValue: this.selected,
      })
      this.cancel()
    },
    editTimePoint(item) {
      this.title = item.title
      this.timePoint = item.value
      this.editing = true
      this.selected = item
    },
    deleteTimePoint(item) {
      this.$emit('remove-time-point', item)
    },
    cancel() {
      this.selected = null
      this.editing = false
      this.addition = false
      this.title = ''
      this.timePoint = ''
    },
  },
}
</script>

<style>
.font-size-16 {
  font-size: 16px !important;
}
</style>
