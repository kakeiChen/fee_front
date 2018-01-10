import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../../styles/core.scss';
import './CoreLayout.scss';

class CoreLayout extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default connect()(CoreLayout);
