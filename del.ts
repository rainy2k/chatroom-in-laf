import cloud from '@lafjs/cloud'

const db = cloud.database()
export async function main(ctx: FunctionContext) {
  for(var i=1;i<=100;i++) {
    const msg = await db.collection('chatroom').remove()
  }
}