import React, { useState } from 'react';
import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import axios from "axios";
import Button from 'react-bootstrap/Button';

import NavigationBar from '../components/Navigation';
import { Form } from 'react-bootstrap';
import {Layout} from '../components/layout'
import Card from 'react-bootstrap/Card';
import img from '../components/cardimg.svg';
import {Clayout} from '../components/cardlayout'

import './vacc.css'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Vaccinationlisting = () => {

  const history = useHistory();
  const [pincode,setpincode]=useState('')
  const [centerdata,setcenterdata]=useState([])
  const [date,setdate]=useState('')
  
  const notify = (text) => {
    toast.error(text)
  };
 
  const handleClick =(event) =>{
  
    event.preventDefault();

    var today = new Date()
    let curdate = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
    
    setdate(curdate)

    let url="https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode="+pincode+"&date="+curdate
          
    axios.get(url)
    .then((res)=>{
      if (res.data.sessions.length === 0){
        notify('We did not get any result. Please try a new pin code')
      }
      setcenterdata(res.data.sessions)
    })
    
  }


return(
  <>

  <NavigationBar props = {[['Home', '/'], ['Sell Oxygen', '/seller'], ['Contact', '/contact'] ]} />

  <ToastContainer />
  
  <Layout>
  <h1>Search vaccination centers</h1>
  <Form>
    <Form.Group controlId="State">
      <Form.Label class="fhead">Enter Pin Code</Form.Label>
      <Form.Control type ="number" placeholder="Pin Code" value={pincode} onChange={(e)=> setpincode(e.target.value)} >
     
           
      </Form.Control>
    </Form.Group>


    <Button variant="primary" type="submit" block onClick={(e)=> handleClick(e)} >
      Search
    </Button>
  </Form>
  
 <Clayout>    
      
      { centerdata.map((center,index)=>
  
  <Card key={index}>
    <Card.Img variant="top" src={img}/>
    <Card.ImgOverlay>
    <Card.Title className="text-white" >{center.name}</Card.Title>
    </Card.ImgOverlay>
    <Card.Body>
      
      <Card.Text>
        <strong>Vaccine:</strong>  {center.vaccine}
        <br/>
        <strong>Address: </strong> {center.address}<br/>
        <strong>District: </strong>{center.district_name}<br/>
        <strong>State:</strong> {center.state_name}<br/>
        <strong>Available 1st dose:  </strong>{center.available_capacity_dose1}<br/>
        <strong>Available 2nd dose:</strong> {center.available_capacity_dose2}
      </Card.Text>
    </Card.Body>
    <Card.Footer>
      <small className="text-muted">Last updated 3 mins ago</small>
    </Card.Footer>
  </Card>
 
      )
  }
  
 </Clayout>

</Layout>

  
 </>
)


}


export default Vaccinationlisting
