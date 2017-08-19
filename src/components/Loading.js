import React, { Component } from "react"
import PropTyes from "prop-types"

class Loading extends Component {

  static propTypes = {
    isLoading: PropTyes.bool.isRequired
  }

  render() {

    const { isLoading } = this.props

    if (isLoading === false) return null

    return (
      <div className="loading-container">
        <div className="sk-folding-cube">
          <div className="sk-cube1 sk-cube"></div>
          <div className="sk-cube2 sk-cube"></div>
          <div className="sk-cube4 sk-cube"></div>
          <div className="sk-cube3 sk-cube"></div>
        </div>
       <div className="modal-overlay" />
      </div>
    )
  }
}

export default Loading