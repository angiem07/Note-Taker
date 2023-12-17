const express = require('express');
const path = require('path');
const fs = require('fs');
const { promises: fsPromises } = require('fs');

const app = express();

const PORT = process.env.PORT || 3001;
const dbFilePath = path.join(__dirname, "db/db.json");

// helper fuction to read data from the file asynchronously
const readData = async () => {
  try {
    return await fsPromises.readFile(dbFilePath, "utf8");
  } catch (err) {
    console.log("Error reading data:");
    console.log(err);
    throw err;
  }
};

// helper function to write data to the file asynchronously
const writeData = async (data) => {
  try {
    await fsPromises.writeFile(dbFilePath, data, "utf8");
  } catch (err) {
    console.log("Error writing data:");
    console.log(err);
    throw err;
  }
};


// middleware and static file setup
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));


// API endpoint to get notes
app.get("/api/notes", async (req, res) => {
  try {
    createNoteData = await readData();
    console.log("Hello from the SERVER!");
    createNoteData = JSON.parse(createNoteData);
  } catch (err) {
    console.log("\n error (catch err app.get):");
    console.log(err);
  }
  res.json(createNoteData);
});


// API endpoint to add a new note
app.post("/api/notes", async (req, res) => {
  try {
    createNoteData = await readData();
    console.log(createNoteData);
    createNoteData = JSON.parse(createNoteData);
    req.body.id = createNoteData.length;
    createNoteData.push(req.body);
    createNoteData = JSON.stringify(createNoteData);
    await writeData(createNoteData);
  
    res.json(JSON.parse(createNoteData));
  } catch (err) {
    console.error(err);
  }
});


// API endpoint to delete a note
app.delete("/api/notes/:id", async (req, res) => {
  try {
    createNoteData = await readData();
    createNoteData = JSON.parse(createNoteData);
    createNoteData = createNoteData.filter((note) => note.id != req.params.id);
    createNoteData = JSON.stringify(createNoteData);
  
    await writeData(createNoteData);
  
    res.send(JSON.parse(createNoteData));
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


// display note.html page when the "Get Started" button is clicked
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});


// default route to home
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});


// additional API endpoint to serve the db.json file
app.get("/api/notes", (req, res) => {
  return res.sendFile(path.join(__dirname, "db/db.json"));
});


// start the server
app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT}`)
);
