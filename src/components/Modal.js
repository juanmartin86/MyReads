import React, { Component } from "react"
import PropTypes from "prop-types"

class Modal extends Component {

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    changeModal: PropTypes.func.isRequired,
    modalBook: PropTypes.object.isRequired,
    modalBooksWithRating: PropTypes.array.isRequired,
  }
  
  render() {
    // destructuring
    const { modalBook, modalBooksWithRating, changeModal, isOpen } = this.props
    
    // if the modal is not in isOpen it won't show what's below
    if (isOpen === false) return null
      
    // finding if the book we're showing in the modal is rated
    const bookRated = modalBooksWithRating.find((bookWithRating) => bookWithRating.id === modalBook.id) || "NOT RATED"

    return (
      <div className="modal-window">
        <div className="modal-container">
          <div className="row">
            <h1 className="title">{ modalBook.title }{ modalBook.subtitle && (<span className="subtitle">: { modalBook.subtitle } </span>) } </h1>
          </div>
          <div className="row">
            <div className="left-part">
                <img src={ modalBook.imageLinks.thumbnail } alt={ modalBook.title } />
            </div>
            <div className="right-part">
                <ul className="menu-details">
                  <li>{ modalBook.authors.join(", ") }</li>
                  <li><span>Published by:</span> { modalBook.publisher || "Unknown" }</li>
                  <li><span>Date Published:</span> { modalBook.publishedDate || "Unknown" }</li>
                  <li><span>Language:</span> { modalBook.language || "Unknown" }</li>
                  <li>{ modalBook.pageCount || "Unknown" } pages.</li>
                  <li><span>Internet Rating:</span> { modalBook.averageRating || "Not Rated"} </li>
                  <li><span>My Rating:</span> { bookRated.myRating || "Not Rated"} </li> 
                </ul>
                <span className="description-title">Description:</span>
                <p className="description">{ modalBook.description }</p>
                <a href={ modalBook.previewLink } target="_blank" className="btn-custom">Preview it at Google<i></i></a>
                <button onClick={ changeModal } className="btn-custom btn-close">Close</button>
            </div>
          </div>
        </div>
        <div className="modal-overlay" onClick={ changeModal } />
      </div>
    )
  }
}

export default Modal