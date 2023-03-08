const express = require('express');
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')
const Article = require('./Article')
const Category = require('../categories/Category')

const router = express.Router();

router.get('/admin/articles', adminAuth, (req, res) => {
  Article.findAll({
    include: [{ model: Category }]
  }).then((articles) => {
    res.render('admin/articles/index', {
      articles
    });
  })
});

router.get('/admin/articles/new', adminAuth, (req, res) => {
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

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
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

router.get('/articles/page/:page', (req, res) => {
  const page = parseInt(req.params.page)
  const limit = 4
  const offset = limit * page - limit

  Article.findAndCountAll({
    limit,
    offset,
    order: [['id', 'desc']],
  }).then((articles) => {
    const next = !  (offset + limit >= articles.count)
    const result = {
      articles,
      next,
      page,
    }

    Category.findAll().then((categories) => {
      res.render('admin/articles/page', {
        result,
        categories
      })
    })
  })
})

module.exports = router;
