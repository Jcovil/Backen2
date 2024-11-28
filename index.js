require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app=express()
const Note = require('./models/note')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const requestLogger=(request, response, next) =>{
    console.log('Method', request.method);
    console.log('Path', request.path);
    console.log('Body', request.body);
    console.log('---');
    next()
}

app.use(requestLogger)

let notes = []

app.get('/', (request, response) => {
    response.send('<h1>API REST FROM NOTES</h1>');
});

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    })
});

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id)
    .then(note => {
        if(note) {
         response.json(note)
        }else {
            response.status(404).end()
        }
    })
    .catch(error => {
        console.log(error)
        response.status(400).send({error:'malformated id'})
    })
});

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(n => n.id !== id);
    response.status(204).end();
});

app.post('/api/notes', (request, response) => {
    const body = request.body;
    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        });
    }
    const note = new Note ({
        content: body.content,
        important: body.important || false
    })
    note.save().then(result => response.json(result))
});

app.put('/api/notes/:id', (request, response) => {
    const body = request.body
    const note = {
        content: body.content,
        important: body.important
    }
    Note.findByIdAndUpdate(request.params.id,note,{new:true})
        .then(result => {
            response.json(result)
        })
        .catch(error => next(error))
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server Express Running On Port ${PORT}`);
});