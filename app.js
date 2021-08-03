// include necessary packages
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const routes = require('./routes')
require('./config/mongoose')


// variables
const app = express()
const port = 3000

// view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(methodOverride('_method'))

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(express.urlencoded({extended: true}))
app.use(routes)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})