require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies-data-small.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    console.log('validate bearer token middleware')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }

    // move to the next middleware
    next()
})

function handleGetMovies(req, res) {
    res.send('Hello, Movies!')
}

app.get('/movies', function handleGetMovies(req, res) {
    let response = MOVIES;

    if (req.query.genre) {
        response = MOVIES.filter(movie => movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()))
    }

    if (req.query.country) {
        response = MOVIES.filter(movie => movie.country.toLowerCase().includes(req.query.country.toLowerCase()))
    }
    console.log(req.query.avg_vote)
    if (req.query.avg_vote) {
        response = MOVIES.filter(movie => movie.avg_vote >= req.query.avg_vote)
    }

    res.json(response)
})

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
