const express = require('express')
const router = express.Router()
const moment = require('moment')
const Record = require('../../models/record')
const Category = require('../../models/category')


// routes
  // 使用者 (老爸) 可以：在首頁一次瀏覽所有支出的清單
  // 使用者 (老爸) 可以：在首頁看到所有支出清單的總金額
  // 使用者 (老爸) 可以：在首頁可以根據支出「類別」篩選支出；總金額的計算只會包括被篩選出來的支出總和。
router.get('/', (req, res) => {
  Record.find()
    .sort({ date: 'desc' })
    .lean()
    .then(record => {

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
          // 首頁的category filter
          const categoryFilter = req.query.categoryFilter

          if (categoryFilter && categoryFilter !== "類別") {
            const filteredRecord = record.filter(item => item.category === categoryFilter)

            // user選擇任一category後，把該category傳入index.handlebars，讓category filter停留在當前的category
            category.forEach(item => {
              item.match = item.category === categoryFilter
            })
            // 根據篩選結果，顯示對應的總金額
            let totalAmount = 0

            filteredRecord.forEach(item => {
              totalAmount += item.amount
            })
            return res.render('index', { record: filteredRecord, category, totalAmount })

          } else {
            // 根據篩選結果，顯示對應的總金額
            let totalAmount = 0

            record.forEach(item => {
              totalAmount += item.amount
            })
            return res.render('index', { record, category, totalAmount })
          }
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

module.exports = router