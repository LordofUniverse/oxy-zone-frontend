import { React, useState } from 'react'

import Header from '../Start/Header'

import Sellerlogin from '../Seller/sellerlogin'
import SellerHome from '../Seller/SellerHome'

import BuyerHome from '../Buyer/BuyerHome'
import Sellerdetails from '../Buyer/Sellerdetails'

import Update from '../UpdateProfile/Update'

import Vaccinationlisting from '../Vaccination/vaccinationlist';

import Maptry from '../Map/react_map'

import { Redirect } from 'react-router'

import 'bootstrap/dist/css/bootstrap.min.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


const App = () => {

  const val = localStorage.getItem("gid")

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Header />
        </Route>
        
        <Route exact path="/mapbox"> 
          <Maptry />
        </Route>

        <Route exact path="/home"> 
          <BuyerHome />
        </Route>

        <Route exact path="/home/:seller"> 
          <Sellerdetails />
        </Route>

        <Route exact path="/vaccinationlist">
          <Vaccinationlisting />
        </Route>


        <Route exact path="/seller">

          {val === null ? <Sellerlogin /> : <SellerHome />}

        </Route>

        <Route exact path="/seller/update">

          {val === null ? <Redirect to="/seller" /> : <Update />}
        
        </Route>

 
      </Switch>
    </Router>
  )
}

export default App
