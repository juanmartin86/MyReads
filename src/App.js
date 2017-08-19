import React, { Component } from "react"
import { Route } from "react-router-dom"
import ListBooks from "./components/ListBooks.js"
import SearchBooks from "./components/SearchBooks.js"
import Modal from "./components/Modal.js"
import Loading from "./components/Loading.js"
import * as BooksAPI from "./utils/BooksAPI.js"
import "./App.css"

class App extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      books: [],
      booksWithRating: [],
      booksQuery: [],
      query: "",
      isModalOpen: false,
      modalBook: {},
      isLoading: true
    }
  }

  // getting all books available after the component is mounted
  componentDidMount() {
    BooksAPI.getAll()
      .then((books) => this.setState({ books, booksWithRating: JSON.parse(localStorage.getItem("booksWithRating") || "[]") }))
    // after the component is mounted, the loading overlay will hide
    this.updateLoading(false)
  }

  // function that updates the query's state while doing the searching
  updateQuery = async (query) => {
    this.setState({ query })
    query !== "" && await BooksAPI.search(query).then((booksQuery) => this.setState({ booksQuery }) ) 
    query === "" && this.setState({ booksQuery: [] })
  }

  // function that clear the query
  clearQuery = () => {
    this.setState({ booksQuery: [], query: "" })
  }

  // function that updates the shelf the book is in
  updateShelf = async (shelf, id) => {
    // show loading overlay
    this.updateLoading(true, 0)
    // if we pass a regular string with the id, it will make the change only to that particular book
    if (typeof id === "string") {
      const book = this.state.books.find(book => book.id === id) || await BooksAPI.get(id) // the await is used if the book is not in the shelf so we ge it from the BooksAPI
      // if the book is moved to the "none" shelf and it has rating, it'll be removed from the booksWithRatingState using the removeBookRating function
      this.removeBookRating(shelf, id)
      // updating the books from the shelf and the localStorage
      await BooksAPI.update(book, shelf)
      localStorage.setItem("booksWithRating", JSON.stringify(this.state.booksWithRating))
    } else {
      // otherwise it's an array of id's, we grab every book and then loop over each and update its shelf value
      for (const bookId of id) {
        const book = this.state.books.find(book => book.id === bookId) // no need to get the book from BooksAPI because the select all is only funcitonal on the shelf (where the book is already in the state)
        // if the book is moved to the "none" shelf and it has rating, it'll be removed from the booksWithRatingState using the removeBookRating function
        this.removeBookRating(shelf, bookId)
        // updating the books from the shelf and the localStorage
        await BooksAPI.update(book, shelf)
        localStorage.setItem("booksWithRating", JSON.stringify(this.state.booksWithRating))
      }
    }
    // getting all the books from the shelf and updating the state
    await BooksAPI.getAll()
    .then((books) => { this.setState({ books }) })
    // hide loading overlay
    this.updateLoading(false, 0)
  }

  // function that removes the rating from the book if it's moved to the "none" shelf and it has rating
  removeBookRating = (shelfType, bookId) => {
    // if the book is moved to the "none" shelf and it has rating, it'll be removed from the booksWithRatingState
    if (shelfType === "none") {
      const bookIndex = this.state.booksWithRating.findIndex((ratedBook) => ratedBook.id === bookId)
      // if we find that the book is rated, it'll be removed from the state and the localStorage will be updated
      if (bookIndex > -1) {
        this.setState((prevState) => ({ booksWithRating: prevState.booksWithRating.filter((bookWithRating) => bookWithRating.id !== bookId) }))
      }
    }
  }

  // function that closes the modal and resets the modalBook state
  changeModal = () => {
    this.setState(({ isModalOpen: false, modalBook : {} }))
  }
  
  // function that gets the modal state and the bookid
  // so that we can grab the book and show the model via state
  updateModal = async (isModalOpen, bookId) => {
    // sho loading overlay
    this.updateLoading(true, 0)
    // grabing the book object
    const modalBook = await BooksAPI.get(bookId)
    // updating the state of the modal and the modalBookook with the one we just got
    this.setState({ isModalOpen, modalBook })
    // hide loading overlay
    this.updateLoading(false, 0)
  }

  updateRating = (myRating, bookId) => {
    // getting the book from state and cloning it
    const bookFromState = this.state.books.find((book) => book.id === bookId)
    const clonedBook = Object.assign({}, bookFromState);
    // adding the book to a booksWithRating array
    clonedBook.myRating = myRating
    const booksWithRating = [...this.state.booksWithRating]
    // if the book is not in the bookWithRating state, we add it
    if (!this.state.booksWithRating.find((book) => book.id === bookId)) {
      booksWithRating.push(clonedBook)
      //updating the state and localStorage
      this.setState({ booksWithRating })
      localStorage.setItem("booksWithRating", JSON.stringify(booksWithRating))
    }
  }

  // function that shows or hides the loading overlay with 1 second default
  updateLoading = (isLoading, time=1000) => {
    setTimeout(() => { this.setState({ isLoading }) }, time)
  }

  // function that generates the stars for the books that have myRating
  generateRating = (bookWithRating) => {
    const starsArray = []
    // filling the stars
    for (let i = 0; i < 5; i++) {
      i < bookWithRating.myRating ? starsArray.push(true) : starsArray.push(false)
    }
    // returning the JSX
    return (
      <ul className="rating-group">
        { starsArray.map((star, index) => star ? (<li key={`${bookWithRating.id}-${index}`} className="star"></li>) : (<li key={`${bookWithRating.id}-${index}`} className="no-star"></li>) ) }
      </ul>
    )
  }
  
  // function that checks if the book has rating, if so, it returns its index from the array from the state
  bookRatingIndex = (booksWithRating, currentBook) => booksWithRating.findIndex((bookWithIndex) => bookWithIndex.id === currentBook.id)

  render() {

    return (
      <div className="app">
        <Loading isLoading={ this.state.isLoading } />
        <Modal
          isOpen={ this.state.isModalOpen }
          changeModal={ this.changeModal }
          modalBook={ this.state.modalBook }
          modalBooksWithRating={ this.state.booksWithRating } />
        <Route exact path="/search" render={ () => 
          <SearchBooks 
            onQuery={ this.updateQuery }
            onUpdateShelf={ this.updateShelf }
            query={ this.state.query }
            booksQuery={ this.state.booksQuery }
            onClearQuery={ this.clearQuery }
            books={ this.state.books }
            booksWithRating={ this.state.booksWithRating }
            onUpdateModal={ this.updateModal }
            onGenerateRating={ this.generateRating }
            getBookRatingIndex={ this.bookRatingIndex }
             /> }
        />
        <Route exact path="/" render={() => 
          <ListBooks 
            books={ this.state.books }
            booksWithRating={ this.state.booksWithRating }
            onUpdateShelf={ this.updateShelf }
            onUpdateModal={ this.updateModal }
            onRatingChange={ this.updateRating }
            onGenerateRating={ this.generateRating }
            getBookRatingIndex={ this.bookRatingIndex }
             />} />
      </div>
    )
  }
}

export default App
