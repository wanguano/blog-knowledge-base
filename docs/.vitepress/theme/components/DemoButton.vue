<template>
  <button 
    :class="['demo-button', type, size]"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'medium'
  }
})
defineEmits(['click'])
</script>

<style scoped>
.demo-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  outline: none;
  font-family: inherit;
}

.demo-button:active {
  transform: scale(0.95);
}

.primary {
  background-color: var(--vp-c-brand);
  color: white;
}
.primary:hover {
  background-color: var(--vp-c-brand-light);
}

.success {
  background-color: #10b981;
  color: white;
}
.success:hover {
  background-color: #059669;
}

.danger {
  background-color: #ef4444;
  color: white;
}
.danger:hover {
  background-color: #dc2626;
}

.small {
  padding: 4px 10px;
  font-size: 12px;
}
.medium {
  padding: 8px 16px;
  font-size: 14px;
}
.large {
  padding: 12px 24px;
  font-size: 16px;
}
</style>
