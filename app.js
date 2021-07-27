// include necessary packages
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Record = require('./models/record')
const Category = require('./models/category')
const { urlencoded } = require('express')

// variables
const app = express()
const port = 3000

// mongodb connection
mongoose.connect('mongodb://localhost/expense-tracker', {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})


// view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(express.urlencoded({extended: true}))

// routes
  // 使用者 (老爸) 可以：在首頁一次瀏覽所有支出的清單
  // 使用者 (老爸) 可以：在首頁看到所有支出清單的總金額
  // 使用者 (老爸) 可以：在首頁可以根據支出「類別」篩選支出；總金額的計算只會包括被篩選出來的支出總和。
app.get('/', (req, res) => {
  Record.find()
  .lean()
  .then(record => {
    let totalAmount = 0

    record.forEach(item => {
      totalAmount += item.amount
    })

    Category.find()
      .lean()
      .then(category => {
        res.render('index', { record, category, totalAmount })
      })
  })  
})

  // 使用者 (老爸) 可以：新增一筆支出
app.get('/expense-tracker/new', (req, res) => {
  Category.find()
    .lean()
    .then(category => {
      res.render('new', {category})
    })
})

app.post('/expense-tracker', (req, res) => {
  const name = req.body.name
  const date = req.body.date
  const category = req.body.category
  const amount = req.body.amount

  Record.create({name, date, category, amount})
    .then(() => res.redirect('/'))
})

  // 使用者 (老爸) 可以：編輯支出的所有屬性 (一次只能編輯一筆)
app.get('/expense-tracker/edit', (req, res) => {
  res.render('edit')
})

app.post('/expense-tracker/edit', (req, res) => {
  res.redirect('/')
})

  // 使用者 (老爸) 可以：刪除任何一筆支出 (一次只能刪除一筆)
app.post('', (req, res) => {
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})