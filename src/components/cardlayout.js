import React from 'react';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
export const Clayout = (props) => (
  <Container  >
    <Row md={4}>
    {props.children}
    
  </Row>
  </Container>
)