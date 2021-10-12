import express, { Application, Request, Response } from "express"
import fs from 'fs'
import _ from 'lodash'

const app: Application = express()
const port = 3000

// Body parsing Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
          id: _.max(_.map(users, user => user.id)) + 1 || 1
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

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`)
  })
} catch (error: any) {
  console.error(`Error occured: ${error.message}`)
}
