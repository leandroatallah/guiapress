const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('./User')
const adminAuth = require('../middlewares/adminAuth')

const router  = express.Router()

router.get('/admin/users', adminAuth, (req, res) => {
  if(req.session.user == undefined) {
    res.redirect('/')
  }

  User.findAll().then((users) => {
    res.render('admin/users/index', {
      users
    })
  })
})

router.get('/admin/users/create', adminAuth, (req, res) => {
  res.render('admin/users/create')
})

router.post('/users/create', (req, res) => {
  const {email, password} = req.body

  User.findOne({
    where: { email }
  }).then((user) => {
    if(user == undefined) {
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)

      User.create({
        email,
        password: hash
      }).then(() => {
        res.redirect('/admin/users')
      }).catch(() => {
        res.redirect('/')
      })
    } else {
      res.redirect('/admin/users/create')
    }
  })
})

router.get('/login', (req, res) => {
  res.render('admin/users/login')
})

router.post('/authenticate', (req, res) => {
  const {email, password} = req.body

  User.findOne({
  where: { email }
  }).then((user) => {
    if(user != undefined) {
      const correct = bcrypt.compareSync(password, user.password)

      if(correct) {
        req.session.user = {
          id: user.id,
          email: user.email
        }
        res.redirect('/admin/articles')
      } else {
        req.session.user = undefined
        res.redirect('/login')
      }
    } else {
      req.session.user = undefined
      res.redirect('/login')
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.user = undefined
  res.redirect('/')
})

module.exports = router;
