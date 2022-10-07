const express = require('express') // npm install express
const mongoose = require('mongoose')
const app = express()
app.use(express. json())
const port = 3055
//application level middleware
 app.use(function(req, res, next){
    console.log(`${req.method}-${req.url}-${req.ip}-${new Date()}`)
    next() 
 })
// establish connection to database
mongoose.connect('mongodb://localhost:27017/feb2020')
.then(()=>{
    console.log('connected to db')
})
 .catch((err)=>{
     console.log('error connecting to db', err)
 })
// create a task schema
const Schema = mongoose.Schema
const taskSchema = new Schema({
title: {
type: String,
required: [true, 'task should have a title']
},
description: {
type: String
},
completed: {
type: Boolean
},
dueDate: {
type: Date
},
createdAt: {
type: Date,
default:Date.now
}
})

const Task = mongoose.model('Task', taskSchema)

// RequestHandler - app.httpMethod(url, callback)
app.get('/', (req, res) => {
res.send('welcome to the website')
})
//place where error thrown
app.get('/api/error', (req, res)=>{
    throw new Error('not authorized')
})
// tasks api
app.get('/api/tasks', (req,res)=>{
    Task.find()
    .then((tasks)=>{
        res.json(tasks)
    })
    .catch((err)=>{
        res.json(err)
    })
    // throw new Error('not authorized')
})

app.post('/api/tasks', (req, res)=>{
    const body= req.body
    const task= new Task(body)
    task.save()
    .then((tasks)=>{
        res.json(tasks)
    })
    .catch((err)=>{
        res.json(err)
    })
})
app.get('/api/tasks/:id', (req,res)=>{
    const id = req.params.id
    Task.findById()
    .then((task)=>{
        res.json(task)
    })
    .catch((err)=>{
        res.json(err)
    })
})
app.put('/api/tasks/:id', (req,res)=>{
    const id = req.params.id
    const body = req.body
    Task.findByIdAndUpdate(id, body, {new: true, runValidators: true})
    .then((task)=>{
        res.json(task)
    })
    .catch((err)=>{
        res.json(err)
    })
})
app.delete('/api/tasks/:id', (req,res)=>{
    const id = req.params.id
    Task.findByIdAndDelete(id)
    .then((task)=>{
        res.json(task)
    })
    .catch((err)=>{
        res.json(err)
    })
})
//error handling middleware
app.use(function(err, req, res, next){
    console.log('error handling middleware function')
    res.send(err.message)
})
app.listen(port, () => {
console. log('server running on port', port)
})