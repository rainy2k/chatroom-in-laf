import cloud from '@lafjs/cloud'
const db = cloud.database()

exports.main = async function (ctx) {
  const { sender, content } = ctx.body
  const message = {
    sender,
    content,
  }
  const res = await db.collection('chatroom').add(message)
  return res
}