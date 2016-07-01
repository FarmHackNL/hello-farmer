import React, {PropTypes} from 'react';
import {Navbar, NavbarBrand, Nav, NavItem} from 'react-bootstrap';

class Layout extends React.Component {
  render() {
    return (
      <div>
        <Navbar>
          <NavbarBrand>Hello Farmer</NavbarBrand>
        </Navbar>
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }

};

export default Layout;
