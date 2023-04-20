<template>
  <!-- <div>{{ state.hello }}</div> -->
  <b>昵称: </b><input type="text" v-model="state.sender" />
  <button @click="clear">清空</button>
  <p> --------爱情呼叫机-------- </p>
  <p></p>
  <p></p>
  <div>
    <HelloWorld :messages="state.messages" @send-message="sendMessage"/>
    <div>
      <input type="text" v-model="state.newMessage" />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import { Cloud } from "laf-client-sdk"; // 引入
import { reactive, onMounted } from 'vue'
import { ref } from "vue";
// import { watch } from 'vue'

export default {
  components: {
    HelloWorld,
  },
  setup() {
    const cloud = new Cloud({
      baseUrl: "https://mov0of.laf.dev", // 这里的 <AppID> 需要换成自己的 AppID
      getAccessToken: () => '', // 这里先为空
    });

    const state = reactive({
      messages: ref([]),
      sender: '',
      newMessage: '',
      hello: '',
    })

    onMounted(async () => {
      state.sender = "我"
      const res = await cloud.invoke("hello")
      state.messages = res.data
      if(state.messages.length != 0) {
        speak(state.messages[state.messages.length - 1].content)
      }
    })
    const f5 = async () => {
      let len1 = state.messages.length
      console.log("len1: ", len1)
      const res = await cloud.invoke("hello")
      state.messages = res.data
      let len2 = state.messages.length
      console.log("len2: ", len2)
      if(len2 > len1) {
        for(let i=1;i<=len2 - len1;i++) {
          speak(state.messages[state.messages.length - i].content)
        }
      }
    }
    const clear = async () => {
      const res = await cloud.invoke("del")
      state.messages = res.data
    }
    const addMessage = async (sender, content) => {
      const message = {
        id: Date.now(),
        sender,
        content
      }
      state.messages.push(message)
      speak(content)
    }
    const speak = async (text) => {
      const speech = new SpeechSynthesisUtterance()
      speech.text = text
      window.speechSynthesis.speak(speech)
    }
    // 创建WebSocket连接
    const wss = new WebSocket('wss://mov0of.laf.dev/__websocket__');
    wss.onopen = () => {
      console.log("connected");
    };
    wss.onmessage = (res) => {
      console.log("收到了新的信息:")
      console.log(res.data);
      if(res.data == "f5") {
          f5()
        // window.location.reload()
      }
    };
    // sendMessage
    const sendMessage = async () => {
        const message = state.newMessage.trim()
        console.log("mess", message)
        if(!message) return
        addMessage(state.sender, message)
        const msg = {
          id: Date.now(),
          sender: state.sender,
          content: message, 
        }
        await cloud.invoke("add", msg)
        wss.send("newMessage")
        state.newMessage = ''
    }
    return {
      state,
      addMessage,
      speak,
      sendMessage,
      cloud,
      f5,
      clear
    }
  },
}
</script>
