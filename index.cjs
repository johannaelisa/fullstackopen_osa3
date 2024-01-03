require('dotenv').config()
const express = require('express')
const app = express()

const morgan = require('morgan')

const cors = require('cors')
app.use(cors())

const Person = require('./models/person.cjs')

app.use(express.static('build'))
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
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person
  .find({})
  .then(persons => {
    response.json(persons);
  })
  console.log("Täällä ollaan")
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

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error))
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person
  .findByIdAndDelete(request.params.id)
  .then(() => {
    response.status(204).end();
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (body.name === 'a new name...') {
    return response.status(400).json({ error: 'Name is missing' });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson.save()
  .then(savedPerson => {
    response.json(savedPerson);
  })
  .catch(error => next(error))
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  Person.findByIdAndUpdate(request.params.id, { name: body.name, number: body.number }, { new: true, runValidators: true, context: 'query'  })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.use(morgan('combined', {
  skip: function (req, res) { return res.statusCode < 400 }
}))

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})