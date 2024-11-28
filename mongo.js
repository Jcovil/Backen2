const mongoose = require('mongoose')

if (process.argv.length<3){
  console.log('Agrega el password como arreglo');
  process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://Jc4rlos:${password}@cluster0.hhh4g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
})

const Note = mongoose.model(`Note`,noteSchema)

const note = new Note({
    content: 'JS is very easy',
    important: true
})

note.save().then(result => {
    console.log('note saved in mongoDB')
    mongoose.connection.close()
})
