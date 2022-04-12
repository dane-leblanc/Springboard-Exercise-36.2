process.env.Node_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

let testBook_isbn;

beforeEach(async () => {
  let result = await db.query(
    `INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year)
            VALUES(
                '8275309',
                'https://amazon.com/jenny',
                'Jenny',
                'English',
                45,
                'publish publishing',
                'I got it',
                2020)
            RETURNING isbn`
  );
  testBook_isbn = result.rows[0];
});

describe("Get /books", function () {
  test("Get all books", async function () {
    const resp = await request(app).get("/books");
    const books = resp.body.books;
    expect(books).toHaveLength(1);
    expect(books[0]).toHaveProperty("isbn");
    expect(books[0]).toHaveProperty("author");
  });
});

describe("Get /books/:isbn", function () {
  test("Get one book", async function () {
    const resp = await request(app).get(`/books/${testBook_isbn}`);
    expect(resp.body.book).toHaveProperty("isbn");
    expect(resp.body.book.isbn).toBe(testBook_isbn);
  });
});

afterEach(async function () {
  await db.query("DELETE FROM BOOKS");
});

afterAll(async function () {
  await db.end();
});
