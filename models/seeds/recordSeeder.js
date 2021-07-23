const mongoose = require('mongoose')
const Record = require('../record')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', async () => { // 讓loop跑完所有種子資料再關閉與mongodb的連線，參考: https://zellwk.com/blog/async-await-in-loops/
  console.log('mongodb connected.')
  for (let i = 1, x = 1000; i < 6; i++, x *= 7) {
    const d = new Date() // 記下產生資料當下的時間
    const yearNow = d.getUTCFullYear()
    const monthNow = d.getUTCMonth() + 1
    const dateNow = d.getUTCDate()
    const secondsNow = d.getUTCSeconds()

    await Record.create( // 用 await 確保資料全都寫入mongoDB
      {
      name: `name-${i}`,
      category: `category-${i}`,
      date: `${yearNow} / ${monthNow} / ${dateNow}`,
      amount: x
    })
  }
  console.log('record seed data successfully created!')
  mongoose.disconnect(console.log('mongodb disconnected.')) // 中斷跟mongoDB的連線並產生訊息
})