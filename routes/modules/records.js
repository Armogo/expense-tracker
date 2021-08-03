const express = require('express')
const router = express.Router()
const moment = require('moment')
const Record = require('../../models/record')
const Category = require('../../models/category')


// 使用者 (老爸) 可以：新增一筆支出
router.get('/new', (req, res) => {
  Category.find()
    .lean()
    .then(category => { res.render('new', { category }) })
    .catch(error => console.log(error))
})

router.post('/', (req, res) => {
  const name = req.body.name
  const date = req.body.date
  const category = req.body.category
  const amount = req.body.amount

  Record.create({ name, date, category, amount })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 使用者 (老爸) 可以：編輯支出的所有屬性 (一次只能編輯一筆)
router.get('/:id/edit', (req, res) => {
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
          res.render('edit', { record, date, category })
        })
    })
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, category, date, amount } = req.body

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
router.delete('/:id', (req, res) => {
  const id = req.params.id

  Record.findById(id)
    .then((record) => {
      record.remove()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router