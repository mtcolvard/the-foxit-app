import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class SearchBar extends React.Component {
  constructor() {
    super()
    this.handleArrowLeftClick = this.handleArrowLeftClick.bind(this)
    this.handleTimesClick = this.handleTimesClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleArrowLeftClick() {
    this.props.onArrowLeft()
  }
  handleTimesClick() {
    this.props.onTimes(this.props.name)
  }
  handleChange(e) {
    this.props.onHandleChange(e)
  }
  handleSubmit(e) {
    e.preventDefault()
    this.props.onHandleSubmit(this.props.name)
  }

  render() {
    return(
      <div className="field has-addons is-marginless" >
        <div className="control">
          <a className="button is-radiusless" onClick={this.handleArrowLeftClick}>
            <span className="icon">
              <FontAwesomeIcon icon="arrow-left" />
            </span>
          </a>
        </div>
        <div className="control is-expanded">
          <form onSubmit={this.handleSubmit}>
            <input
              className="input is-primary"
              type="text"
              placeholder={this.props.placeholder}
              onChange={this.handleChange}
              value={this.props.searchformData}
              name={this.props.name}
            />
          </form>
        </div>
        <div className="control">
          <a className="button is-radiusless" onClick={this.handleTimesClick}>
            <span className="icon">
              <FontAwesomeIcon icon="times" />
            </span>
          </a>
        </div>
      </div>
    )
  }
}

export default SearchBar
