// // built-in web server module
// const http = require("http")

// // create new web server, event handler is registered to the server
// const app = http.createServer((req, res) => {
    //     res.writeHead(200, { "Content-Type": 'application/json' })
    //     res.end(JSON.stringify(notes))
    // })

const express = require("express")
const cors = require("cors")
const Note = require("./models/note")
const app = express()
require('dotenv').config()

app.use(cors())
app.use(express.json())

// static middleware to make express show static content
app.use(express.static('dist'))

let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    },
    {
        id: "4",
        content: "Test",
        important: true
    },
]

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
// console.log(...notes)

// route event handler function
app.get('/', (req, res) => {
    res.send("<h1>Hello World</h1>")
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
    const id = req.params.id
    // console.log(id)
    Note.findById(id)
        .then(note => {
            if (!note) {
                return res.status(404).json({ message: "Note not found" })
            }
            res.json(note)
        })
        .catch(err => next(err))
            // if (err.name === 'CastError') {
            //     return res.status(404).json({ message: "Invalid ID format" })
            // }
            // res.status(500).json({ message: "An error occurred", error: err.message });
            // res.status(400).send({ error: 'malformatted id' })
})

// const generatedId = () => {
//     const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0
//     return String(maxId + 1)
// }

app.post('/api/notes', (req, res, next) => {
    const body = req.body
    
    // if (!body.content) {
    //     return res.status(400).json({
    //         error: 'content mising'
    //     })
    // }

    const note = new Note({
        // id: generatedId(),
        content: body.content,
        important: body.important || false
    })
    // notes = notes.concat(newNote)
    // res.status(201).json(newNote)
    note.save()
        .then(savedNotes => {
            res.json(savedNotes)
        })
        .catch(error => next(error))
})

app.delete('/api/notes/:id', (req, res, next) => {
    const id = req.params.id
    Note.findByIdAndDelete(id)
        .then(note => {
            if (!note) {
                return res.status(400).json({ message: "note not found!" })
            }
            res.status(204).end()
        })
        .catch(err => next(err))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findById(request.params.id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content
      note.important = important

      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))
})

// error middleware should place after the routes
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})