<template>
  <div class="flex justify-center items-center flex-grow">
    <div class="border border-blue-200 rounded p-8 bg-blue-50 text-center">
      <p>You don't have selected timezones :(</p>
      <p>
        Your current timezone is
        <strong class="text-lg">{{ current }}</strong>
      </p>
      <p class="mb-3">Do you want to <strong>add</strong> it?</p>
      <button
        class="py-1 px-3 bg-blue-400 hover:bg-blue-500 text-white text-sm font-medium rounded-sm"
        @click="$emit('add-time-zone', current)"
      >
        Yes
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  data: () => ({
    current: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }),
}
</script>

<style></style>
