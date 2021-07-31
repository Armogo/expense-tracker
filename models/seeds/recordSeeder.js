const mongoose = require('mongoose')
const Record = require('../record')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', async () => { // 讓loop跑完所有種子資料再關閉與mongodb的連線，參考: https://zellwk.com/blog/async-await-in-loops/
  const recordData = [
    ['午餐', '餐飲食品', '2019-04-23', 60],
    ['晚餐', '餐飲食品', '2019-04-23', 60],
    ['捷運', '交通出行', '2019-04-23',  120],
    ['電影：驚奇隊長', '休閒娛樂', '2019-04-23', 220],
    ['租金', '家居物業', '2019-04-01', 25000]
  ]

  console.log('mongodb connected.')

  for (let i = 0; i < recordData.length; i++) {
    await Record.create( // 用 await 確保資料全都寫入mongoDB
    {
      name: recordData[i][0],
      category: recordData[i][1],
      date: recordData[i][2],
      amount: recordData[i][3]
    })
  }
  console.log('record seed data successfully created!')
  mongoose.disconnect(console.log('mongodb disconnected.')) // 中斷跟mongoDB的連線並產生訊息
})