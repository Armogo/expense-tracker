const mongoose = require('mongoose')
const Category = require('../category')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', async () => { // 讓loop跑完所有種子資料再關閉與mongodb的連線，參考: https://zellwk.com/blog/async-await-in-loops/
  const arr = ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他']
  
  console.log('mongodb connected.')
  for (let i = 0; i < arr.length; i++) {
    await Category.create({ category: arr[i] }) // 用 await 確保資料全都寫入mongoDB
  }
  
  console.log('category seed data successfully created!')
  mongoose.disconnect(console.log('mongodb disconnected.')) // 中斷跟mongoDB的連線並產生訊息
})

