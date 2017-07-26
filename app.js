const express = require("express")
const methodOverride = require("method-override")
const app = express()
const bodyParser = require("body-parser")
const expressSanitizer = require("express-sanitizer")
const mongoose = require("mongoose")
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer())
app.use(methodOverride("_method"))

//Mongoose set up 

const mongoDB = 'mongodb://localhost/blogs_app'
mongoose.connect(mongoDB)

let BlogSchema = new mongoose.Schema({
  title: String,
  image: String,
  post: String, 
  date: {type: Date, default: Date.now},
})

let Blog = mongoose.model('Blog', BlogSchema)

//RESTFUL Routes

app.get("/", (req, res) => {
  res.redirect("/blogs")
})


//Index Route
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, data) => {
    if(err) {
      console.log("there was an error, here is the error: ", err)
    } else {
      res.render("index", {blogs: data})
    }
  })
})

//New Route
app.get('/blogs/new', (req, res) => {
  res.render("new")
})

//Create Route
app.post('/blogs', (req, res) => {
  req.body.blog.post = req.sanitize(req.body.blog.post)
  Blog.create({
    title: req.body.blog.title,
    image: req.body.blog.image,
    post: req.body.blog.post,
  }, (err, data) => {
    if(err) {
      console.log("There was an error! Here is the error: ", err)
    } else {
      res.redirect('/blogs')
    }
  })
})

//Show Route
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if(err) {
      res.redirect('/blogs')
    } else {
      res.render('show', {blog: blog})
    }
  })
})

//Edit Route
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if(err) {
      res.redirect('/blogs')
    } else {
      res.render('edit', {blog: blog})
    }
  })
})

//Update Route
app.put('/blogs/:id', (req, res) => {
    req.body.blog.post = req.sanitize(req.body.blog.post)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
      if(err) {
        res.redirect('/blogs')
      } else {
        res.redirect('/blogs/'+req.params.id)
      }
    })
})

//Destroy Route
app.delete('/blogs/:id', (req,res) => {
  Blog.findByIdAndRemove(req.params.id, (err, destroyedBlog) => {
    if(err) {
      alert('There was an error, redirectiong to blogs.')
      res.redirect('/blogs')
    } else (
      res.redirect('/blogs')
    )
  })
})


app.listen(port, () => {
  console.log(`listening on port ${port}!`)
})