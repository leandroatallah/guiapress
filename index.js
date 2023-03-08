require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UsersController')

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/User')

const app = new express();

// View engine
app.set('view engine', 'ejs');

// Static
app.use(express.static('public'));

// Body parser
app.use(bodyParser.urlencoded({extends: false}));
app.use(bodyParser.json());

// Database
connection
  .authenticate()
  .then(() => {
    console.log('Conexão feita com sucesso.');
  })
  .catch((error) => {
    console.log(error);
  });

app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);

app.get('/', (req, res) => {
  Article.findAll({
    order: [['id', 'desc']],
    limit: 4
  }).then((articles) => {
    Category.findAll({
      order: [['title', 'asc']]
    }).then((categories) => {
      res.render('index', {
        articles,
        categories
      });
    })
  })
});

app.get('/:slug', (req, res) => {
  const {slug} = req.params
  Article.findOne({
    where: {
      slug
    }
  }).then((article) => {
    if(article) {
      Category.findAll({
        order: [['title', 'asc']]
      }).then((categories) => {
        res.render('article', {
          article,
          categories
        })
      });

    } else {
      throw new Error()
    }
  }).catch(() => {
    res.redirect('/')
  })
})

app.get("/category/:slug", (req, res) => {
  const {slug} = req.params
  Category.findOne({
    where: {
      slug
    },
    include: [{model: Article}]
  }).then((category) => {
    if(category) {
      Category.findAll().then((categories) => {
        res.render('index', {
          articles: category.articles,
          categories
        })
      })
    } else {
      throw new Error()
    }
  }).catch(() => {
    res.redirect('/')
  })
})

app.listen(8080, () => {
  console.log('Servidor está rodando.');
});
