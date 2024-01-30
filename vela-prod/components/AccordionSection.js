import React, { Component } from "react";
import PropTypes from "prop-types";

class AccordionSection extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Object).isRequired,
    isOpen: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  onClick = () => {
    this.props.onClick(this.props.label);
  };

  render() {
    const {
      onClick,
      props: { isOpen, label },
    } = this;

    return (
      <div className="accordion-item">
        <div
          className="accordion-header"
          onClick={onClick}
          style={{ cursor: "pointer" }}
        >
          {label}
          <div style={{ float: "right" }}>
            {!isOpen && <i className="fas fa-chevron-down"></i>}
            {isOpen && <i className="fas fa-chevron-up"></i>}
          </div>
        </div>
        {isOpen && <div className="accordion-body">{this.props.children}</div>}
      </div>
    );
  }
}

export default AccordionSection;
