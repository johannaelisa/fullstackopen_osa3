require('dotenv').config()
const express = require('express')
const app = express()

const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.cjs')
app.use(cors())
app.use(express.static('dist'))

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

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person
  .find({})
  .then(persons => {
    response.json(persons);
  })
})

app.get('/api/info', (request, response) => {
  Person
    .find({})
    .then(persons => {
      const scope = persons.length;
      const now = new Date();
      const info = `Phonebook has info for ${scope} people<br><br>${now}`;
      response.json({ info });
    })
});



app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  Person
    .findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => {
      console.error('Virhe tietoja haettaessa:', error.message);
      response.status(500).json({ error: 'Internal Server Error' });
    });
});



app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  Person
  .findByIdAndRemove(id)
  .then(() => {
    response.status(204).end();
  })
})


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    });
  }

  Person
  .findOne({ name: body.name })
  .then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({ 
        error: `${body.name} is already in the phonebook` 
      });
    } else {
      const newPerson = new Person({
        name: body.name,
        number: body.number,
      });

      newPerson.save()
      .then(savedPerson => {
        response.json(savedPerson);
      })
    }
  })
})



app.use(morgan('combined', {
  skip: function (req, res) { return res.statusCode < 400 }
}))

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})