const express = require('express');
const slugify = require('slugify')
const Article = require('./Article')
const Category = require('../categories/Category')

const router = express.Router();

router.get('/admin/articles', (req, res) => {
  Article.findAll({
    include: [{ model: Category }]
  }).then((articles) => {
    res.render('admin/articles/index', {
      articles
    });
  })
});

router.get('/admin/articles/new', (req, res) => {
  Category.findAll().then(categories => {
    res.render('admin/articles/new', {
      categories
    });
  })
});

router.post('/articles/save', (req, res) => {
  const {title, body, category} = req.body

  Article.create({
    title,
    slug: slugify(title, { lower: true }),
    body,
    categoryId: category
  }).then(() => {
    res.redirect('/admin/articles/')
  })
})

router.get('/admin/articles/edit/:id', (req, res) => {
  const {id} = req.params

  Article.findByPk(id).then((article) => {
    if(article) {
      Category.findAll().then((categories) => {
        res.render('admin/articles/edit', {
          article,
          categories
        })
      })
    } else {
      throw new Error()
    }
  }).catch(() => {
    res.redirect('/admin/articles')
  })
})

router.post('/articles/update', (req, res) => {
  const {id, title, body, category} = req.body

  Article.update({
    title,
    slug: slugify(title, { lower: true }),
    body,
    categoryId: category
  }, {
    where: { id }
  }).then(() => {
    res.redirect('/admin/articles/')
  })
})

router.post('/articles/delete', (req, res) => {
  const {id} = req.body
  if(id && !isNaN(id)) {
    Article.destroy({
      where: { id }
    }).then(() => {
      res.redirect('/admin/articles')
    })
  } else {
    res.redirect('/admin/articles')
  }
})

module.exports = router;
