// // built-in web server module
// const http = require("http")

// // create new web server, event handler is registered to the server
// const app = http.createServer((req, res) => {
    //     res.writeHead(200, { "Content-Type": 'application/json' })
    //     res.end(JSON.stringify(notes))
    // })

const express = require("express")
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())

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

// console.log(...notes)

// route event handler function
app.get('/', (req, res) => {
    res.send("<h1>Hello World</h1>")
})

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    const note = notes.find(note => note.id === id)
    if (note) {
        res.json(note)
    } else {
        // end is method for responding without sending any data
        res.status(400).json({
            messages: "id is not found!",
        })
    }
})

const generatedId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0
    return String(maxId + 1)
}

app.post('/api/notes', (req, res) => {
    const body = req.body
    
    if (!body.content) {
        return res.status(400).json({
            error: 'content mising'
        })
    }

    const newNote = {
        id: generatedId(),
        content: body.content,
        important: body.important || false
    }
    notes = notes.concat(newNote)
    res.status(201).json(newNote)
})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    const note = notes.find(note => note.id === id)
    if (note) {
        notes = notes.filter(note => note.id !== id)
        // console.log(notes)
        res.status(204).end()
    } else {
        res.status(400).json({
            messages: "id is not found!",
        })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})