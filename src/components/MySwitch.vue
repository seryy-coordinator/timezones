<template>
  <div class="flex items-center gap1">
    <div v-if="label" class="mr-1 font-medium text-sm">{{ label }}:</div>
    <span v-if="icon" class="mr-1 material-icons">{{ icon }}</span>
    <div
      v-for="option in options"
      :key="option.value"
      :class="
        value === option.value
          ? 'bg-blue-400 text-white'
          : 'bg-gray-400 opacity-20'
      "
      class="flex p-1 cursor-pointer font-bold"
      @click="moduleValue = option.value"
    >
      <span v-if="option.label"> {{ option.label }}</span>
      <span v-if="option.icon" class="material-icons font-size-16">{{
        option.icon
      }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "MySwitch",
  props: {
    value: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    icon: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
  },
  computed: {
    moduleValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
};
</script>

<style>
.gap1 {
  gap: 1px;
}
</style>
