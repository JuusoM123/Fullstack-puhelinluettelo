const express = require('express')
const morgan = require('morgan')
const app = express()

const cors = require('cors')
app.use(express.static('dist'))
app.use(cors())

app.use(express.json())
app.use(morgan('tiny'))
let persons = [
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})


app.get("/info", (request, response) => {
    const now = new Date;

    response.send(`Phonebook has info for ${persons.length} people\n ${now}`)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({
            error: 'Name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'Number missing'
        })
    }
    const nameExists = persons.some(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }
    const newId = Math.floor(Math.random() * 1000000);

    const person = {
        number: body.number,
        name: body.name,
        id: newId,
    }

    persons = persons.concat(person)

    response.json(person)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})