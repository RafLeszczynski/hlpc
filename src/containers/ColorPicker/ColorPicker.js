import React from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';
import './ColorPicker.css';

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayColorPicker: false,
      color: props.value
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleColorSelection = this.handleColorSelection.bind(this);
  }

  /**
    Toggles color picker display
   */
  handleClick() {
    this.setState({ displayColorPicker: true });
  }

  /**
   * Closes color picker
   */
  handleClose() {
    this.setState({ displayColorPicker: false });
    this.handleColorSelection();
  }

  /**
   * Handles color change
   * @param {Object} color
   */
  handleColorChange(color) {
    this.setState({ color: color.hex });
  }

  /**
   * Handles color selection
   */
  handleColorSelection() {
    const { color } = this.state;
    const { id, handleChange } = this.props;

    if (this.props.value !== color) {
      handleChange({
        // in order to reuse the handleChange method
        // I decided to create interface matching the one for event object
        target: { name: id, value: color }
      });
    }
  }

  /**
   * Renders swatch UI widget
   * @returns {XML}
   */
  rednderSwatch() {
    return (
      <div className="color-picker-swatch" role="button" tabIndex={0} onClick={this.handleClick}>
        <div className="color-picker-color" style={{ backgroundColor: this.state.color }} />
      </div>
    );
  }

  /**
   * Renders color picker UI widget and hidden overlay to trigger widget closing
   * @returns {XML}
   */
  renderColorPicker() {
    return (
      <div className="color-picker-popover">
        <div className="color-picker-cover" role="presentation" onClick={this.handleClose} />
        <ChromePicker color={this.state.color} onChange={this.handleColorChange} />
      </div>
    );
  }

  render() {
    return (
      <div className="color-picker">
        <strong className="color-black">{this.props.label}</strong>
        { this.rednderSwatch() }
        { this.state.displayColorPicker ? this.renderColorPicker() : null }
      </div>
    );
  }
}

ColorPicker.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ColorPicker;
