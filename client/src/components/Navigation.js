import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, SafeAnchor } from 'react-bootstrap';
import { FaGithub } from 'react-icons/fa';

const Navigation = () => {
  return (
    <Navbar collapseOnSelect expand='md' bg='dark' variant='dark'>
      <Navbar.Brand as={Link} to='/'>
        Event Calendar
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Nav className='ml-auto'>
          <Nav.Link
            as={SafeAnchor}
            href='https://github.com/lanningbl/calendar'
            target='_blank'
          >
            <FaGithub />
          </Nav.Link>
          <Nav.Link as={Link} to='/'>
            Calendar
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
