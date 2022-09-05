<template>
  <Modal v-on="$listeners">
    <div class="px-10">
      <h2 class="my-4 font-bold text-3xl">Are you sure?</h2>
      <div class="flex items-center justify-center gap-2 mb-4">
        <button
          class="py-1 px-3 bg-blue-400 hover:bg-blue-500 text-white text-sm font-medium rounded-sm"
          @click="$emit('remove')"
        >
          Yes
        </button>
        <button
          class="py-1 px-3 border-2 border-blue-400 hover:border-blue-600 text-blue-500 text-sm font-medium rounded-sm"
          @click="$emit('close')"
        >
          Cancel
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "./Modal.vue";

export default {
  name: "ConfirmRemovingModal",
  components: {
    Modal,
  },
};
</script>
