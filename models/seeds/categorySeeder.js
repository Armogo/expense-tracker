const mongoose = require('mongoose')
const Category = require('../category')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', async () => { // 讓loop跑完所有種子資料再關閉與mongodb的連線，參考: https://zellwk.com/blog/async-await-in-loops/
  const category = [
    ['家居物業', 'fas fa-home'], 
    ['交通出行', 'fas fa-shuttle-van'], 
    ['休閒娛樂', 'fas fa-grin-beam'], 
    ['餐飲食品', 'fas fa-utensils'],
    ['其他', 'fas fa-pen']
  ]

  console.log('mongodb connected.')
  
  for (let i = 0; i < category.length; i++) {
    await Category.create({ category: category[i][0], icon: category[i][1] }) // 用 await 確保資料全都寫入mongoDB
  }
  
  console.log('category seed data successfully created!')
  mongoose.disconnect(console.log('mongodb disconnected.')) // 中斷跟mongoDB的連線並產生訊息
})

