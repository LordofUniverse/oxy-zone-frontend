import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import styled from 'styled-components';
// import { Navigation } from '@material-ui/icons';

const Styles = styled.div`

position: sticky;
top: 0;


  .navbar {

    background-color: #222;

  }

  a, .navbar-brand, .navbar-nav .nav-link {

    color: #bbb;

    &:hover {

      color: white;
      text-decoration: none !important;

    }

  }

`;

const NavigationBar = ({ props }) => (
  <Styles>
    <Navbar expand="lg">
      <Navbar.Brand href="/">Ozone</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">

          {
            console.log(props)
          }

          {

            props.map((element) =>

              <Nav.Item>
                <Nav.Link>
                  <Link to= { element[1] } > { element[0] } </Link>
                </Nav.Link>
              </Nav.Item>

            )

          }

          {/* <Nav.Item>
            <Nav.Link>
              <Link to="/">Home</Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>
              <Link to="/seller">Sell Oxygen</Link>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link>
              <Link to="/contact">Contact</Link>
            </Nav.Link>
          </Nav.Item> */}

        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </Styles >
)

export default NavigationBar