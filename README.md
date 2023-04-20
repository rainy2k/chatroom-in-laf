# chatvue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


```ts
import cloud from '@lafjs/cloud'

const db = cloud.database()
export async function main(ctx: FunctionContext) {
  // 从前端传来的数据中提取 content（待办事项内容）
  const { sender, content } = ctx.body
  // 创建一个新的待办事项对象，包含 content 和 completed（是否完成）两个属性
  const message = {
    sender,
    content
  }
  // 调用云数据库的 add() 方法将新的待办事项添加到 "todos" 集合中
  const res = await db.collection('chatroom').add(message)
  // 将添加操作的结果返回给前端
  return res
}
```

```ts
import cloud from '@lafjs/cloud'

const db = cloud.database()
export async function main(ctx: FunctionContext) {
  const messages = await db.collection('chatroom').get()
  // 将查询到的待办事项数据返回给前端
  return messages
}

```