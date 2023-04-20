import cloud from '@lafjs/cloud'

const db = cloud.database()
export async function main(ctx: FunctionContext) {
  // 初始化websocket user Map列表
  // 也可用数据库保存，本示例代码用的Laf云函数的全局缓存
  let wsMap = await cloud.shared.get("wsMap") // 获取wsMap
  if(!wsMap){
    wsMap = new Map()
    await cloud.shared.set("wsMap", wsMap) // 设置wsMap
  }
  // websocket 连接成功
  if (ctx.method === "WebSocket:connection") {
    const userId = generateUserId()
    wsMap = await cloud.shared.get("wsMap") // 获取wsMap
    wsMap.set(userId, ctx.socket);
    await cloud.shared.set("wsMap", wsMap) // 设置wsMap
    ctx.socket.send("连接成功,你的userID是："+userId);
  }
  // websocket 消息事件
  if (ctx.method === "WebSocket:message") {
    const { data } = ctx.params;
    console.log("接收到的信息：",data.toString());
    const userId = getKeyByValue(wsMap, ctx.socket);
    ctx.socket.send("[Server] 服务端已接收到消息事件:\n" + data.toString() + "\n你的userID是: "+userId);
    const str = data.toString()
    if(str.length > 0 && str[0] == 'n' && str[1] == 'e' && str[2] == 'w') {
      setTimeout(function() {
      }, 1000);
        let wsMap = await cloud.shared.get("wsMap")
        wsMap.forEach((value, key) => { 
          if(key != userId) {
            ctx.socket = wsMap.get(key)
            ctx.socket.send("f5");
          }
        }) 
    }
  }
  // websocket 关闭消息
  if (ctx.method === "WebSocket:close") {
    wsMap = await cloud.shared.get("wsMap") // 获取wsMap 
    const userId = getKeyByValue(wsMap, ctx.socket);
    wsMap.delete(userId);
    await cloud.shared.set("wsMap", wsMap) // 设置wsMap
    ctx.socket.send("服务端已接收到关闭事件消息,你的userID是："+userId);
  }
}
// 生成随机用户ID 
function generateUserId() {
  return Math.random().toString(36).substring(2, 15);
}
// 遍历userID
function getKeyByValue(map, value) {
  for (const [key, val] of map.entries()) {
    if (val === value) {
      return key;
    }
  }
}