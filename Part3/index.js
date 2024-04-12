const http= require('http')
const express = require('express')

const cors = require('cors')


let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]
/*//Without express
  const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(notes))
  })

  app.listen(3001);
  console.log("Server running on port 3001");
*/
//-----------------------------------With EXPRESS----------------------------------------------------------------
const app=express();
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)

  console.log('---')
  next()
}
app.use(requestLogger)
app.use(cors())
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/api/notes', (request, response) => {
  response.json(notes)//  response.end(JSON.stringify(notes)) 
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id); //because it's string by defaut
  console.log("Id :",id, typeof id)

  const note = notes.find(note => note.id === id)
  console.log(note)
  if (note) {
    response.json(note)
  } else {
        response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
app.use(express.json())
// instead of parsing  Json.parse (request)
//Without the json-parser, the body property would be undefined. 
//The json-parser takes the JSON data of a request, transforms it into a JavaScript object
// and then attaches it to the body property of the request object before the route handler is called.
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
//This middleware will be used for catching requests made to non-existent routes.
// For these requests, the middleware will return an error message in the JSON format.

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})