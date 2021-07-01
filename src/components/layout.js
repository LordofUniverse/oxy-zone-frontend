import React from 'react';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';

const Styles = styled.div`
.container{
  margin-top:55px;
}
.card{
  left: 6rem;
  margin: 1rem;

}
.row-cols-md-4{
  padding: 0.5rem
  
}
`;

export const Layout = (props) => (
  <Styles>
  <Container as="div"  >
    
    {props.children}
  </Container>
  </Styles>
) 