import cloud from '@lafjs/cloud'

const db = cloud.database()
export async function main(ctx: FunctionContext) {
  const messages = await db.collection('chatroom').get()
  return messages
}