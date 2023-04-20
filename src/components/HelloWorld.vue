<template>
  <div>
    <div v-for="message in messages" :key="message.id">
      <span>{{ message.sender }}:</span>
      <span>{{ message.content }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    messages: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      newMessage: ''
    }
  },
  methods: {
    sendMessage() {
      this.$emit('send-message', this.newMessage)
      this.newMessage = ''
    }
  }
}
</script>
