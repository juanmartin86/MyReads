import React, { Component } from "react"
import PropTypes from "prop-types"

class Bookshelf extends Component {

  static propTypes = {
    filteredBooks: PropTypes.array.isRequired,
    booksWithRating: PropTypes.array.isRequired,
    onUpdateModal: PropTypes.func.isRequired,
    onUpdateShelf: PropTypes.func.isRequired,
    onRatingChange: PropTypes.func.isRequired,
    onGenerateRating: PropTypes.func.isRequired,
    getBookRatingIndex: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      checked: false
    }
  }

  // function that handles when the select all is checked
  handleChecked = (checked) => {
    this.setState({ checked: !checked })
  }

  // function that handles when we change the shelf of the current book or books selected
  handleSelect = (value, bookId) => {
    this.props.onUpdateShelf(value, bookId)
    // if we pass an array of book id's the checked state is reseted to its initial value after the shelf is empty
    // so new items added don't have the state of "checked" as default
    typeof bookId !== "string" && this.setState({ checked: false })
  }

  render() {

    // destructuring
    const { filteredBooks, shelfTitle, shelfNumber, shelfType, onUpdateModal, onRatingChange, booksWithRating, onGenerateRating, getBookRatingIndex} = this.props
    // array of book id's in case we select all and change its shelf
    const bookIdArray = filteredBooks.map((book) => book.id)

    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{ shelfTitle }</h2>
        <div className="bookshelf-books">
          { bookIdArray.length > 0 && (
            <div>
              <input id={ `toggle-all-${shelfNumber}` } type="checkbox" onChange={ () => this.handleChecked(this.state.checked) } />
              <label htmlFor={ `toggle-all-${shelfNumber}` }>Select All</label>
              <select className="toggle-select" defaultValue={ shelfType } onChange={ (event) => this.handleSelect(event.target.value, bookIdArray)  } >
                <option value="none" disabled>Move to...</option>
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
                <option value="none">None</option>
              </select>
            </div>    
            ) }
          <ol className="books-grid">
            { (filteredBooks.length > 0 && filteredBooks.map((book) => (
              <li key={ book.id }>
                <div className="book">
                  <div className="book-top">
                    <input type="checkbox" className="toggle-book" checked={this.state.checked} />
                    <div className="book-overlay">
                      <p className="shelf">Selected</p>
                    </div>
                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                    <div className="book-shelf-changer">
                      <select onChange={ (event) => this.handleSelect(event.target.value, book.id)} defaultValue={ book.shelf } >
                        <option value="none" disabled>Move to...</option>
                        <option value="currentlyReading">Currently Reading</option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                  <div className="book-title">{ book.title }</div>
                  { book.authors.map((author) => (<div className="book-authors" key={ author }>{ author }</div>)) }
                  { (getBookRatingIndex(booksWithRating, book) === -1 && (
                  <ul className="rating-group not-rated">
                    <li>
                      <input type="radio" name={ `rating-${book.id}` } value="1" id={ `rating-${book.id}-1` } onClick={ (event) => onRatingChange(event.target.value, book.id) }/>
                      <label htmlFor={ `rating-${book.id}-1` }></label>
                    </li>
                    <li>
                      <input type="radio" name={ `rating-${book.id}` } value="2" id={ `rating-${book.id}-2` } onClick={ (event) => onRatingChange(event.target.value, book.id) } />
                      <label htmlFor={ `rating-${book.id}-2` }></label>
                    </li>
                    <li>
                      <input type="radio" name={ `rating-${book.id}` } value="3" id={ `rating-${book.id}-3` } onClick={ (event) => onRatingChange(event.target.value, book.id) } />
                      <label htmlFor={ `rating-${book.id}-3` }></label>
                    </li>
                    <li>
                      <input type="radio" name={ `rating-${book.id}` } value="4" id={ `rating-${book.id}-4` } onClick={ (event) => onRatingChange(event.target.value, book.id) } />
                      <label htmlFor={ `rating-${book.id}-4` }></label>
                    </li>
                    <li>
                      <input type="radio" name={ `rating-${book.id}` } value="5" id={ `rating-${book.id}-5` } onClick={ (event) => onRatingChange(event.target.value, book.id) } />
                      <label htmlFor={ `rating-${book.id}-5` }></label>
                    </li>
                  </ul>
                   )) || onGenerateRating(booksWithRating[getBookRatingIndex(booksWithRating, book)]) } 
                  <button className="btn-custom btn-more-info" onClick={() => onUpdateModal(true, book.id) }>More Info</button>
                </div>
              </li>
              )
            )) || (<p>Empty Shelf</p>) }
          </ol>
        </div>
      </div>
    )
  }
}

export default Bookshelf

