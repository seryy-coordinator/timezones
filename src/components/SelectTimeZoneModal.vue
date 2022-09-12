<template>
  <BaseModal v-on="$listeners">
    <div class="px-10 w-[500px]">
      <h2 class="my-4 font-bold text-3xl">Enter and select the time zone you are looking for</h2>
      <div class="relative">
        <input
          v-model="searchText"
          type="text"
          class="py-1 px-3 border border-grey-100 rounded-sm w-full"
          @input="selected = null"
        />
        <div
          v-if="resultsDisplayed"
          class="absolute top-full left-0 right-0 flex flex-col gap-1 py-2 bg-white dropdown overflow-y-auto shadow-lg shadow-blue-500/50"
        >
          <div
            v-for="item in getFiltered"
            :key="item.value"
            class="cursor-pointer hover:bg-gray-100 py-1 px-4"
            @click="select(item)"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
      <div class="flex items-center justify-center gap-2 my-6">
        <button
          :disabled="!selected"
          class="py-1 px-3 bg-blue-400 hover:bg-blue-500 text-white text-sm font-medium rounded-sm"
          @click="$emit('select', selected.value)"
        >
          Select
        </button>
        <button
          class="py-1 px-3 border-2 border-blue-400 hover:border-blue-600 text-blue-500 text-sm font-medium rounded-sm"
          @click="$emit('close')"
        >
          Cancel
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script>
import moment from 'moment-timezone'
import BaseModal from './base/BaseModal.vue'
import { refactorTimeZones } from '../api/utils'

const timeZones = refactorTimeZones(moment.tz.names())

export default {
  name: 'SelectTimeZoneModal',
  components: {
    BaseModal,
  },
  data: () => ({
    searchText: '',
    selected: null,
    timeZones,
  }),
  computed: {
    getFiltered() {
      if (this.searchText) {
        const searchText = this.searchText.toLowerCase()
        return this.timeZones.filter((timeZone) => timeZone.title.toLowerCase().includes(searchText))
      }
      return ''
    },
    resultsDisplayed() {
      return this.getFiltered.length && (!this.selected || this.searchText !== this.selected.title)
    },
  },
  methods: {
    select(item) {
      this.searchText = item.title
      this.selected = item
    },
  },
}
</script>

<style>
.dropdown {
  max-height: 200px;
}
</style>
