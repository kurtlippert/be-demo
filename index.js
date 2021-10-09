const express = require('express')
const _ = require('lodash')
const app = express()
const port = 3000
const fs = require("fs")

app.use(express.json())

app.get('/', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    res.end(data)
  })
})

app.get('/users', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    const db = JSON.parse(data)
    const users = _.get(db, 'users', [])
    res.end(JSON.stringify(users))
  })
})

app.get('/users/:id', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    const db = JSON.parse(data)
    const users = _.get(db, 'users', [])
    const user = _.find(users, user => user.id + '' === req.params.id) || {}
    res.end(JSON.stringify(user))
  })
})

app.delete('/users/:id', (req, res) => {
  const userId = req.params.id
  fs.readFile('db.json', 'utf8', (err, data) => {
    const db = JSON.parse(data)
    const users = _.get(db, 'users', [])
    const newDb = {
      ...db,
      users: _.filter(users, user => user.id + '' !== userId)
    }
    fs.writeFile('db.json', JSON.stringify(newDb), err => {
      if (err) {
        res.end(`error writing to db: ${err}`)
      }
      else {
        res.end(JSON.stringify(_.get(newDb, 'users', [])))
      }
    })
  })
})

app.post('/users', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    const db = JSON.parse(data)
    const users = _.get(db, 'users', [])
    const newDb = {
      ...db,
      users: [
        ...users,
        {
          ...req.body,
          id: _.max(_.map(users, user => user.id)) + 1
        }
      ]
    }
    fs.writeFile('db.json', JSON.stringify(newDb), err => {
      if (err) {
        res.end(`error writing to db: ${err}`)
      }
      else {
        res.end(JSON.stringify(_.get(newDb, 'users', [])))
      }
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
