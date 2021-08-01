// include necessary packages
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const moment = require('moment')
const Record = require('./models/record')
const Category = require('./models/category')

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
  .sort({ date: 'desc' })
  .lean()
  .then(record => {
    let totalAmount = 0

    record.forEach(item => {
      totalAmount += item.amount
    })
    // 轉換Record內的date格式 => YYYY/MM/DD
    record.forEach(item => {
      item.date = moment(item.date).format('YYYY/MM/DD')
    })

    Category.find()
      .lean()
      .then(category => {
        // 把Category內的"icon"值傳入對應的Record，方便render view時取用
        record.forEach(record => { 
          record.icon = category.find(item => item.category === record.category).icon
        })
        res.render('index', { record, category, totalAmount })
      })
      .catch(error => console.log(error))
  })
  .catch(error => console.log(error))  
})

  // 使用者 (老爸) 可以：新增一筆支出
app.get('/expense-tracker/new', (req, res) => {
  Category.find()
    .lean()
    .then(category => {res.render('new', {category})})
    .catch(error => console.log(error))
})

app.post('/expense-tracker', (req, res) => {
  const name = req.body.name
  const date = req.body.date
  const category = req.body.category
  const amount = req.body.amount

  Record.create({name, date, category, amount})
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

  // 使用者 (老爸) 可以：編輯支出的所有屬性 (一次只能編輯一筆)
app.get('/expense-tracker/edit/:id', (req, res) => {
  const id = req.params.id

  Record.findById(id)
    .lean()  
    .then(record => {
      const date = moment(record.date).format('YYYY-MM-DD')
      
      Category.find()
        .lean()
        .then(category => {
          // 比對每個category.category是否等於該record.category，將結果以key-value帶入category，用於edit頁面的<option>
          category.forEach(item => { 
            item.match = item.category === record.category
          })
          res.render('edit', {record, date, category})
        })
    })
    .catch(error => console.log(error))
})

app.post('/expense-tracker/edit/:id', (req, res) => {
  const id = req.params.id
  const {name, category, date, amount} = req.body

  Record.findById(id)
    .then(record => {
      record.name = name
      record.category = category
      record.date = date
      record.amount = amount

      record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

  // 使用者 (老爸) 可以：刪除任何一筆支出 (一次只能刪除一筆)
app.post('/expense-tracker/delete/:id', (req, res) => {
  const id = req.params.id
  
  Record.findById(id)
    .then((record) => {
      record.remove()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})