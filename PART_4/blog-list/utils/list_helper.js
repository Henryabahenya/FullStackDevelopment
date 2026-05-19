const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  const favorite = blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max, blogs[0])
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}


const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  
  const authorCounts = _.countBy(blogs, 'author')

 
  const authorArray = _.map(authorCounts, (blogsCount, authorName) => ({
    author: authorName,
    blogs: blogsCount
  }))

  return _.maxBy(authorArray, 'blogs')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}