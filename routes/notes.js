const express = require('express');
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const Note = require('../modules/Note')
const { body, validationResult } = require('express-validator');

// route : 1 get all the notes using a GET request /api/notes/fetchallnotes

router.get('/fetchallnotes', fetchuser, async (req, res) => {
   try {
    const notes = await Note.find({ user: req.user.id })
    res.json(notes)
   } catch (error) {
    console.error({ error: error.message })
    res.status(500).json("Internal Server Error")
  }
})

// route : 2 add the notes using a POST request /api/notes/addnote

router.post('/addnote', fetchuser,
    body('title', "Plese Enter Valid Name").trim().isLength({ min: 2 }),
    body('description', "Plese Enter Valid Email").trim().isLength({ min: 2 })
    , async (req, res) => {

      try {
        const{title,description} = req.body
        
        const result = validationResult(req);
    // if present the error then send error message and bad request
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const note = new Note({
        title,description,user:req.user.id
    })

    
    const saveNote = await note.save()

    res.send(saveNote)

      }catch (error) {
        console.error({ error: error.message })
        res.status(500).json("Internal Server Error")
      }
    })


// route : 3 ubdate the notes using a PUT request /api/notes/updatenote

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
     const {title,description} = req.body

     const newNote = {}

     if (title) {newNote.title = title} 
     if (description) {newNote.description = description} 

    //  fidn note and update the note

    let note = await Note.findById(req.params.id)
    if(!note){res.status(404).send("Not Found")}

    // if this note own by user then update this note
    if(note.user.toString() !== req.user.id){
      return res.status(401).send("Not Allowed")
    }

    note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json({note})

    } catch (error) {
     console.error({ error: error.message })
     res.status(500).json("Internal Server Error")
   }
 })


// route : 4 delete the notes using a DEKETE request /api/notes/deletenote

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  try {

  //  fidn note and delete the note

  let note = await Note.findById(req.params.id)
  if(!note){res.status(404).send("Not Allowed")}

  // if this note own by user then delete
  if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not Allowed")
  }

  note = await Note.findByIdAndDelete(req.params.id)
  res.json({"Success":"Note has been deleted",note:note})

  } catch (error) {
   console.error({ error: error.message })
   res.status(500).json("Internal Server Error")
 }
})

module.exports = router