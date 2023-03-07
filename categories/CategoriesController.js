const express = require('express');
const slugify = require('slugify')
const Category = require('../categories/Category')

const router = express.Router();

router.get('/admin/categories/new', (req, res) => {
  res.render('admin/categories/new');
});

router.post('/categories/save', (req, res) => {
  const {title} = req.body
  if(title != undefined) {
    Category.create({
      title,
      slug: slugify(title, { lower: true })
    }).then(() => {res.redirect('/admin/categories')})
  } else {
    res.redirect('/admin/categories/new')
  }
})

router.get('/admin/categories', (req, res) => {
  Category.findAll().then(categories => {
    res.render('admin/categories/index', {
      categories
    });
  })
});

router.post('/categories/delete', (req, res) => {
  const {id} = req.body
  if(id && !isNaN(id)) {
    Category.destroy({
      where: { id }
    }).then(() => {
      res.redirect('/admin/categories')
    })
  } else {
    res.redirect('/admin/categories')
  }
})

router.get('/admin/categories/edit/:id', (req, res) => {
  const {id} = req.params

  if(isNaN(id)) {
    res.redirect('/admin/categories')
  }

  Category.findByPk(id).then((category) => {
    if(category != undefined) {
      res.render('admin/categories/edit', {
        category
      })
    } else {
      throw new Error("Not found")
    }
  }).catch((error) => {
    console.log(error)
    res.redirect('/admin/categories')
  })
})

router.post('/categories/update', (req, res) => {
  const {id, title} = req.body

  Category.update(
    { title, slug: slugify(title, {lower: true}) },
    { where: { id } }
  ).then(() => {
    res.redirect('/admin/categories')
  })
})

module.exports = router;
