// include necessary packages
const express = require('express')
const exphbs = require('express-handlebars')

const app = express()
const port = 3000

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')


// routes
  // 使用者 (老爸) 可以：在首頁一次瀏覽所有支出的清單
  // 使用者 (老爸) 可以：在首頁看到所有支出清單的總金額
  // 使用者 (老爸) 可以：在首頁可以根據支出「類別」篩選支出；總金額的計算只會包括被篩選出來的支出總和。
app.get('/', (req, res) => {
  res.render('index')
})

  // 使用者 (老爸) 可以：新增一筆支出
app.get('/expense-tracker/new', (req, res) => {
  res.render('new')
})

app.post('/expense-tracker/:id', (req, res) => {
  res.redirect('/')
})

  // 使用者 (老爸) 可以：編輯支出的所有屬性 (一次只能編輯一筆)
app.get('expense-tracker/:id', (req, res) => {
  res.render('edit')
}) 

app.post('expense-tracker/:id', (req, res) => {
  res.redirect('/')
})

  // 使用者 (老爸) 可以：刪除任何一筆支出 (一次只能刪除一筆)
app.post('', (req, res) => {
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})