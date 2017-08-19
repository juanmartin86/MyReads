import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

class SearchBooks extends Component {

  static propTypes = {
    onQuery: PropTypes.func.isRequired,
    onUpdateShelf: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    booksQuery: PropTypes.oneOfType([
      PropTypes.array.isRequired,
      PropTypes.object.isRequired
    ]),
    books: PropTypes.array.isRequired,
    booksWithRating: PropTypes.array.isRequired,
    onUpdateModal: PropTypes.func.isRequired,
    onGenerateRating: PropTypes.func.isRequired,
    getBookRatingIndex: PropTypes.func.isRequired,
    onClearQuery: PropTypes.func.isRequired
  }

  // utility function that finds if the book we're searching matches the one we have in the bookshelf
  // if so, returns the shelf it belongs to
  findBook = (booksOnShelf, currentBook) => {
    const bookFromShelf = booksOnShelf.find((book) => book.id === currentBook.id)
    return bookFromShelf && bookFromShelf.shelf
  }

  render() {

    // destructuring
    const { booksQuery, query, onQuery, books, booksWithRating, onUpdateShelf, onUpdateModal, onGenerateRating, getBookRatingIndex, onClearQuery } = this.props
    
    return (
      <div className="search-books">
        <div className="search-books-bar">
        <Link className="close-search" to="/"><i className="icon-left-big"></i><span>Back</span></Link>
        <div className="search-books-input-wrapper">
          <input type="text" placeholder="Search by title or author"
            value={ query }
            onChange={ (event) => onQuery(event.target.value) }
          />
        </div>
        </div>
        <div className="search-books-results">
          <p style={ {textAlign: "center"} }>Showing: {booksQuery.length || "0" } results { booksQuery.length > 0 && (<button className="btn-custom" onClick={ onClearQuery }>Clear Results</button>) }</p>
          <ol className="books-grid">
            { booksQuery && booksQuery.length > 0 && booksQuery.map((book) => (
              <li key={ book.id }>
                <div className="book">
                  <div className="book-top">
                    { book.imageLinks && (<div className="book-cover" style={ { width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` } }></div>) }
                    { this.findBook(books, book) && (
                    <div className="book-overlay">
                      {<p className="shelf">{ this.findBook(books, book).split(/(?=[A-Z])/).join(" ") }</p>}
                    </div>
                    ) }
                    <div className="book-shelf-changer">
                      <select onChange={ (event) => onUpdateShelf(event.target.value, book.id) } defaultValue={ this.findBook(books, book) || "none" } >
                        <option value="none" disabled>Move to...</option>
                        <option value="currentlyReading">Currently Reading</option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                  <div className="book-title">{ book.title }</div>
                  <div className="book-authors">{ book.authors }</div>
                </div>
                { getBookRatingIndex(booksWithRating, book) > -1 && onGenerateRating(booksWithRating[getBookRatingIndex(booksWithRating, book)]) }
                <button className="btn-custom btn-more-info" onClick={() => onUpdateModal(true, book.id) }>More Info</button>
              </li>
              )
            )}
          </ol>
        </div>
      </div>
    )
  }
}

export default SearchBooks