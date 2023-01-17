/*********************************************************************************
*  BTI425 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Christian Duarte Student ID: 158217208 Date: January 13th 2023
*  Cyclic Link: 
*
********************************************************************************/

const express = require("express");
const path = require("path");
const cors = require("cors");

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
require('dotenv').config();

app.get("/", (req, res) => {
    res.json("API Listening");
});

// Add a new Movie to the collection 
app.post("/api/movies", (req, res) => {
    db.addNewMovie(req.body)
        .then((data) => { res.status(201).json(data) })
        .catch((err) => { res.status(500).json({ error: err }) })
});

// Get movies based on page, perPage, and optional title
app.get("/api/movies", (req, res) => {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
        .then((data) => { res.status(200).json(data) })
        .catch((err) => { res.status(500).json({ error: err }) });
});

// Get movie based on id number
app.get("/api/movies/:_id", (req, res) => {
    db.getMovieById(req.params._id)
        .then((data) => { res.status(200).json(data) })
        .catch((err) => { res.status(500).json({ error: err }) });
});

// Updates a movie based on _id number
app.put("/api/movies/:_id", (req, res) => {
    db.updateMovieById(req.body, req.params._id)
        .then(() => { res.status(200).json({ message: `Updated movie with _id: ${req.params._id}` }) })
        .catch((err) => { res.status(500).json({ error: err }) });
});

// Deletes a movie based on _id number
app.delete("/api/movies/:_id", (req, res) => {
    db.deleteMovieById(req.params._id)
        .then(() => { res.status(204) })
        .catch((err) => { res.status(500).json({ error: err }) });
});

app.use((req, res) => {
    res.status(404).send("Resource not found");
});

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});