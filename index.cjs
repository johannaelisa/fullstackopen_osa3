const express = require('express')

const morgan = require('morgan')

const app = express()

const cors = require('cors') //Lisätty
app.use(cors()) //Lisätty

morgan.token('post', function (req, res) { 
  if (req.method === 'POST') {
    return JSON.stringify({ name: req.body.name, number: req.body.number });
  }
  return '';
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms  - :post'))

app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(requestLogger)

let persons = [
    {
        "name": "Aarto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/', (request, response) => {
response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    const scope = persons.length
    const now = new Date()
    response.send(`Phonebook has info for ${scope} people<br><br> ${now}`);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})




app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    });
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: `${body.name} is already in the phonebook` 
    });
  }

  const generateId = () => Math.floor(Math.random() * 999);

  const newId = generateId()

  const person = {
    name: body.name,
    number: body.number,
    id: newId,
  }

  persons = persons.concat(person)

  response.json(person)
})
app.use(morgan('combined', {
  skip: function (req, res) { return res.statusCode < 400 }
}))

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})