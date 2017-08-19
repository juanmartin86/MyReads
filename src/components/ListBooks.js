import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import Bookshelf from "./Bookshelf.js"

class ListBooks extends Component {

  static propTypes = {
    books: PropTypes.array.isRequired,
    booksWithRating: PropTypes.array.isRequired,
    onUpdateShelf: PropTypes.func.isRequired,
    onUpdateModal: PropTypes.func.isRequired,
    onGenerateRating: PropTypes.func.isRequired,
    onRatingChange: PropTypes.func.isRequired,
    getBookRatingIndex: PropTypes.func.isRequired
  }

  // function to filter the books based on the shelf key
  filterBooks = (shelfType) => this.props.books.filter((book) => book.shelf === shelfType)
  
  render() {

    // destructuring
    const { onUpdateShelf, onUpdateModal, onRatingChange, booksWithRating, onGenerateRating, getBookRatingIndex } = this.props

    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <Bookshelf shelfTitle="Currently Reading" shelfNumber="1" shelfType="currentlyReading" filteredBooks={ this.filterBooks("currentlyReading") } onUpdateShelf={ onUpdateShelf } onUpdateModal={ onUpdateModal } onRatingChange={ onRatingChange } booksWithRating={ booksWithRating } onGenerateRating={ onGenerateRating } getBookRatingIndex={ getBookRatingIndex } />
            <Bookshelf shelfTitle="Want To Read" shelfNumber="2" shelfType="wantToRead" filteredBooks={ this.filterBooks("wantToRead") } onUpdateShelf={ onUpdateShelf } onUpdateModal={ onUpdateModal } onRatingChange={ onRatingChange } booksWithRating={ booksWithRating } onGenerateRating={ onGenerateRating } getBookRatingIndex={ getBookRatingIndex } />
            <Bookshelf shelfTitle="Read" shelfNumber="3" shelfType="read" filteredBooks={ this.filterBooks("read") } onUpdateShelf={ onUpdateShelf } onUpdateModal={ onUpdateModal } onRatingChange={ onRatingChange } booksWithRating={ booksWithRating } onGenerateRating={ onGenerateRating } getBookRatingIndex={ getBookRatingIndex } />
          </div>
        </div>
        <div className="open-search">
          <Link to="/search">Add a book</Link>
        </div>
      </div>
    )
  }
}

export default ListBooks