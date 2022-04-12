const express = require("express");
const Book = require("../models/book");
const jsonschema = require("jsonschema");
const bookSchemaPost = require("../schemas/bookSchemaPost");
const bookSchemaPut = require("../schemas/bookSchemaPut");
const ExpressError = require("../expressError");

const router = new express.Router();

/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
    const validation = jsonschema.validate(req.body, bookSchemaPost);
    if (!validation.valid) {
      let listOfErrors = validation.errors.map((error) => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }
    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  
 * Add conditional logic that creates a new book if isbn is not in db
*/

router.put("/:isbn", async function (req, res, next) {
  try {
    const validation = jsonschema.validate(req.body, bookSchemaPut);
    if (!validation.valid) {
      let listOfErrors = validation.errors.map((error) => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }
    const book = await Book.update(req.params.isbn, req.body);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:isbn", async function (req, res, next) {
  
})

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
