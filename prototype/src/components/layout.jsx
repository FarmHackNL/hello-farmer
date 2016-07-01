import React, {PropTypes} from 'react';
import {Navbar, NavbarBrand, Nav, NavItem} from 'react-bootstrap';

class Layout extends React.Component {
  render() {
    return (
      <div style={styles.top}>
        <nav className='navbar navbar-default' style={styles.navbar}>
          <NavbarBrand>Hello Farmer</NavbarBrand>
          <NavbarBrand right><em>Sample data</em></NavbarBrand>
        </nav>
        <div style={styles.content}>
          {this.props.children}
        </div>
      </div>
    );
  }
};

const styles = {
  top: {
    height: '100%',
  },
  navbar: {
    marginBottom: 0,
  },
  content: {
    height: '100%',
  },
};

export default Layout;
