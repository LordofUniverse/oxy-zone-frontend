import React, { useEffect, useState, useRef } from 'react'
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";

import styled from 'styled-components'

import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

import '../Seller/sellerhome.css'
import './buyerhome.css'

let idnum = 0

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        // Height: 
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

const BuyerHome = () => {
	
    const history = useHistory();
	
	const classes = useStyles();
	
    const [loc, setloc] = useState('');
    const [lis, setlis] = useState([])
    const [loading, setloading] = useState(true)
    const [dropop, setdropop] = useState([['Location', true], ['Address', false], ['Ph No', false], ['Price', false]])
    const [filterop, setfilterop] = useState([['Location', false], ['Address', false], ['Ph No', false], ['Price', false]])
    const [asc, setasc] = useState(true)
    const [searchvalue, setsearchvalue] = useState('')
	const [det, setdet] = useState([])
    const [lis2, setlis2] = useState([])

	let load = true
    let changeme = ''

    const process = (data) => {

        if (!(data.status == 226)) {

            let newlist = []

            for (let i = 0; i < data.data.Data.length; i++) {

                newlist.push([
                    0,
                    data.data.Data[i].location, 
                    data.data.Data[i].addr, 
                    data.data.Data[i].phno, 
                    data.data.Data[i].oxyprice, 
                    data.data.Data[i].foreign_seller_id, 
                    data.data.Data[i].name,
                    data.data.Data[i].email, 
                    data.data.Data[i].desc, 
                    data.data.Data[i].profilephoto
                ])
            }

            setlis(newlist)

        } else {

            if (data.data.Data === 'No data') {
                setloading(false)
                load = false
                
            } else {
                if (data.data.Data === 'Id itself is wrong') {
                    localStorage.removeItem('gid')
                    window.location.reload()
                } else {
                    alert('Some error occured.. try again!')
                }
            }

        }

    }


	useEffect(() => {

        axios.get('http://oxy-zone.herokuapp.com/api/sellers/fulldetails/', )
        .then((data) => process(data))
        .catch((err) => console.log('err:', err))

    }, [])

    const orderlistbydistance = (orderlist) => {

        idnum += 1

        let returnlist = []
        let lastlist = []

        for (let i = 0; i < orderlist.length; i++) {

            i = orderlist[i]

            if(i[0] === 0) {
                lastlist.push(i)

            } else {

                let num = i[0]

                if (returnlist.length === 0) {

                    returnlist = [i]

                } else {

                    for (let j = 0; j < returnlist.length; j++) {
                        
                        if(num === returnlist[j]){
                            returnlist = [returnlist.slice(0, j), num ,returnlist.slice(j, returnlist.length)]

                        } else if(num > returnlist[j]) {

                            if ((returnlist.length-1) === j) {
                                returnlist = [returnlist.slice(0, j+1), num ]
                            }

                        } else {

                            returnlist = [returnlist.slice(0, j), num ,returnlist.slice(j, returnlist.length)]

                        }
                        
                    }
                
                }

            }           

        } 

        returnlist = [...returnlist, ...lastlist]

        return returnlist

    }

    useEffect(() => {

        let returnlist = []
        let endlist = []

        for (let i = 0; i < lis2.length ;i++) {

            if (lis2[i][0] == 0){
                endlist.push(lis2[i])
            } else {
                returnlist.push(lis2[i])
            }
            
        }

        returnlist = returnlist.sort(function(a,b){return a[0] > b[0]})

        returnlist = [...returnlist, ...endlist]

        setlis([...returnlist])

    }, [lis2])


    const handlepromises = (searchvalue) => {

        if (!(searchvalue === '')){

            
            let finlist = []
            let maincoor = []
            let stop = false
            let promise2 = ''
            let promise3 = ''
            let promise4 = ''
            let promise5 = ''
            
            const promise1 = new Promise((resolve, reject) => {
                
                let startreq = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + searchvalue + '.json?access_token=pk.eyJ1IjoibG9yZG9mdW5pdmVyc2UiLCJhIjoiY2tvdGw3ajkwMGNrYTJ4cWp4Mzh5cDBwdyJ9.DeuOLVX7a5ULR1UCGbnHrA&country=IN'
                
                axios.get(startreq)
                .then((da) => {
                    let dd = da.data.features
                    if ((dd.length >= 1)){
                        maincoor = dd[0].center
                    } else {
                        stop = true
                    }
                })
                
            });
            
            let promises = [promise1]
            
            if (!stop) {

                
                let third = false
                let forth = false
                let fifth = false

                let coor3 = ''
                let coor5 = ''
                let coor24 = ''
                
                lis.map((ele) => {

                    let loc = ele[1]
                    let addr = ele[2]
                    
                    promise2 = new Promise((resolve, reject) => {

                        let req = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + loc + '.json?access_token=pk.eyJ1IjoibG9yZG9mdW5pdmVyc2UiLCJhIjoiY2tvdGw3ajkwMGNrYTJ4cWp4Mzh5cDBwdyJ9.DeuOLVX7a5ULR1UCGbnHrA&country=IN'
                        
                        axios.get(req)
                            .then((data) => {
                                let d = data.data.features
                                if ((d.length >= 1)){

                                    coor3 = d[0].center

                                    promise3 = new Promise((resolve, reject) => {
                                        
                                        let newreq = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + coor3[0] + ',' + coor3[1] + ';' + maincoor[0] + ',' + maincoor[1] + '?overview=full&geometries=geojson&access_token=pk.eyJ1IjoibG9yZG9mdW5pdmVyc2UiLCJhIjoiY2tvdGw3ajkwMGNrYTJ4cWp4Mzh5cDBwdyJ9.DeuOLVX7a5ULR1UCGbnHrA'

                                        third = true

                                        axios.get(newreq)
                                        .then((dat) => {

                                            finlist.push([
                                                dat.data.routes[0].distance,
                                                ele[1], 
                                                ele[2], 
                                                ele[3], 
                                                ele[4], 
                                                ele[5], 
                                                ele[6], 
                                                ele[7], 
                                                ele[8],
                                                ele[9]
                                            ])    

                                            setlis2([...finlist])
                                            
                                        })
                                        .catch((err) => {
                                            
                                            promise4 = new Promise((resolve, reject) => {

                                                forth = true

                                                let req = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + addr + '.json?access_token=pk.eyJ1IjoibG9yZG9mdW5pdmVyc2UiLCJhIjoiY2tvdGw3ajkwMGNrYTJ4cWp4Mzh5cDBwdyJ9.DeuOLVX7a5ULR1UCGbnHrA&country=IN'

                                                axios.get(req)
                                                .then((dat) => {
                                                    
                                                    let d = data.data.features
                                                    
                                                    if ((d.length >= 1)){
                                
                                                        coor5 = d[0].center

                                                        promise5 = new Promise((resolve, reject) => {
                                                            
                                                            fifth = true
                                                            
                                                            let newreq = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + coor5[0] + ',' + coor5[1] + ';' + maincoor[0] + ',' + maincoor[1] + '?overview=full&geometries=geojson&access_token=pk.eyJ1IjoibG9yZG9mdW5pdmVyc2UiLCJhIjoiY2tvdGw3ajkwMGNrYTJ4cWp4Mzh5cDBwdyJ9.DeuOLVX7a5ULR1UCGbnHrA'
                                                            
                                                            axios.get(newreq)
                                                            .then((dat) => {

                                                                finlist.push([
                                                                    dat.data.routes[0].distance,
                                                                    ele[1], 
                                                                    ele[2], 
                                                                    ele[3], 
                                                                    ele[4], 
                                                                    ele[5], 
                                                                    ele[6], 
                                                                    ele[7], 
                                                                    ele[8],
                                                                    ele[9]
                                                                ])   

                                                                setlis2([...finlist])

                                                            }).catch((err) => {

                                                                finlist.push([
                                                                    0,
                                                                    ele[1], 
                                                                    ele[2], 
                                                                    ele[3], 
                                                                    ele[4], 
                                                                    ele[5], 
                                                                    ele[6], 
                                                                    ele[7], 
                                                                    ele[8],
                                                                    ele[9]
                                                                ])

                                                                setlis2([...finlist])

                                                            })

                                                        })
                                                    
                                                    } else {
                                                        
                                                        finlist.push([
                                                            0,
                                                            ele[1], 
                                                            ele[2], 
                                                            ele[3], 
                                                            ele[4], 
                                                            ele[5], 
                                                            ele[6], 
                                                            ele[7], 
                                                            ele[8],
                                                            ele[9]
                                                        ])

                                                        setlis2([...finlist])

                                                    }

                                                } 
                                                )
                                                
                                        })
                                        
                                    })
                                    
                                })
                                
                                third ? 
                                    forth ? 
                                        fifth ? 
                                        promises.push(promise2, promise3, promise4, promise5) :
                                        promises.push(promise2, promise3, promise4) : 
                                        promises.push(promise2, promise3) :
                                        promises.push(promise2)
                                        
                                    } else {
                                        
                                        let forth = false
                                        
                                        promise3 = new Promise((resolve, reject) => {
                                    
                                        let req = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + addr + '.json?access_token=pk.eyJ1IjoibG9yZG9mdW5pdmVyc2UiLCJhIjoiY2tvdGw3ajkwMGNrYTJ4cWp4Mzh5cDBwdyJ9.DeuOLVX7a5ULR1UCGbnHrA&country=IN'

                                        axios.get(req)
                                        .then((data) => {
                                            let d = data.data.features
                                            
                                            if ((d.length >= 1)){
                                                
                                                coor24 = d[0].center

                                                forth = true

                                                promise4 = new Promise((resolve, reject) => {

                                                    let newreq = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + coor24[0] + ',' + coor24[1] + ';' + maincoor[0] + ',' + maincoor[1] + '?overview=full&geometries=geojson&access_token=pk.eyJ1IjoibG9yZG9mdW5pdmVyc2UiLCJhIjoiY2tvdGw3ajkwMGNrYTJ4cWp4Mzh5cDBwdyJ9.DeuOLVX7a5ULR1UCGbnHrA'

                                                    axios.get(newreq)
                                                    .then((dat) => {

                                                        finlist.push([
                                                            dat.data.routes[0].distance,
                                                            ele[1], 
                                                            ele[2], 
                                                            ele[3], 
                                                            ele[4], 
                                                            ele[5], 
                                                            ele[6], 
                                                            ele[7], 
                                                            ele[8],
                                                            ele[9]
                                                        ])   
                                                        
                                                        setlis2([...finlist])

                                                    })
                                                    .catch((err) => {          

                                                        finlist.push([
                                                            0,
                                                            ele[1], 
                                                            ele[2], 
                                                            ele[3], 
                                                            ele[4], 
                                                            ele[5], 
                                                            ele[6], 
                                                            ele[7], 
                                                            ele[8],
                                                            ele[9]
                                                        ])

                                                        setlis2([...finlist])

                                                    })

                                                })
                                                
                                            } else {
       
                                                finlist.push([
                                                    0,
                                                    ele[1], 
                                                    ele[2], 
                                                    ele[3], 
                                                    ele[4], 
                                                    ele[5], 
                                                    ele[6], 
                                                    ele[7], 
                                                    ele[8],
                                                    ele[9]
                                                ])

                                                setlis2([...finlist])

                                            }
                                            
                                        })

                                })
                                
                                forth ? 
                                promises.push(promise3, promise4) : 
                                promises.push(promise3)
                                
                            }
                        })
                        
                    })

                })
                
            }

            Promise.all(promises)

        }

    }
    
    const handlesearchclick = (searchvalue) => {

        if (!(searchvalue === '')) {

                let startreq = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + searchvalue + '.json?access_token=pk.eyJ1IjoibG9yZG9mdW5pdmVyc2UiLCJhIjoiY2tvdGw3ajkwMGNrYTJ4cWp4Mzh5cDBwdyJ9.DeuOLVX7a5ULR1UCGbnHrA&country=IN'

                axios.get(startreq)
                .then((da) => {
                    let dd = da.data.features
                    if ((dd.length >= 1)){

                        let maincoor = dd[0].center

                        // console.log("here's ur main:", maincoor)

                        let finlist = []

                        lis.map((ele) => {

                            let addr = ele[2]
                            let loc = ele[1]

                            // let coor = await givecoor(loc)
                            // 

                            let req = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + loc + '.json?access_token=pk.eyJ1IjoibG9yZG9mdW5pdmVyc2UiLCJhIjoiY2tvdGw3ajkwMGNrYTJ4cWp4Mzh5cDBwdyJ9.DeuOLVX7a5ULR1UCGbnHrA'
                
                            // console.log('1: ', req)

                            axios.get(req)
                            .then((data) => {
                                let d = data.data.features
                                if ((d.length >= 1)){

                                    let coor = d[0].center

                                    
                                    let newreq = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + coor[0] + ',' + coor[1] + ';' + maincoor[0] + ',' + maincoor[1] + '?overview=full&geometries=geojson&access_token=pk.eyJ1IjoibG9yZG9mdW5pdmVyc2UiLCJhIjoiY2tvdGw3ajkwMGNrYTJ4cWp4Mzh5cDBwdyJ9.DeuOLVX7a5ULR1UCGbnHrA'
                                                                        
                                    axios.get(newreq)
                                    .then((dat) => {

                                        finlist.push([
                                            dat.data.routes[0].distance,
                                            ele[1], 
                                            ele[2], 
                                            ele[3], 
                                            ele[4], 
                                            ele[5], 
                                            ele[6], 
                                            ele[7], 
                                            ele[8].
                                            ele[9]
                                        ])
                                        
                                        finlist = orderlistbydistance(finlist)
                                        
                                        setlis([...finlist])

                                        
                                    })
                                    .catch((err) => {                                        
                                        //else statement
                                        
                                        let req = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + addr + '.json?access_token=pk.eyJ1IjoibG9yZG9mdW5pdmVyc2UiLCJhIjoiY2tvdGw3ajkwMGNrYTJ4cWp4Mzh5cDBwdyJ9.DeuOLVX7a5ULR1UCGbnHrA'
                                        
                                        axios.get(req)
                                        .then((data) => {
                                            let d = data.data.features

                                            if ((d.length >= 1)){
                                                // console.log('available 2', loc)
                                                // console.log(d[0].center)
                        
                                                let coor = d[0].center

                                                let newreq = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + coor[0] + ',' + coor[1] + ';' + maincoor[0] + ',' + maincoor[1] + '?overview=full&geometries=geojson&access_token=pk.eyJ1IjoibG9yZG9mdW5pdmVyc2UiLCJhIjoiY2tvdGw3ajkwMGNrYTJ4cWp4Mzh5cDBwdyJ9.DeuOLVX7a5ULR1UCGbnHrA'

                                                // console.log('4: ', newreq)

                                                axios.get(newreq)
                                                .then((dat) => {
                                                    // console.log('got:', dat.data.routes[0].distance)

                                                    finlist.push([
                                                        dat.data.routes[0].distance,
                                                        ele[1], 
                                                        ele[2], 
                                                        ele[3], 
                                                        ele[4], 
                                                        ele[5], 
                                                        ele[6], 
                                                        ele[7], 
                                                        ele[8],
                                                        ele[9]
                                                    ])

                                                    finlist = orderlistbydistance(finlist)

                                                    setlis([...finlist])

                                                })
                                                .catch((err) => {                            
                                                    // console.log('its an error')
                                                    
                                                    finlist.push([
                                                        0,
                                                        ele[1], 
                                                        ele[2], 
                                                        ele[3], 
                                                        ele[4], 
                                                        ele[5], 
                                                        ele[6], 
                                                        ele[7], 
                                                        ele[8],
                                                        ele[9]
                                                    ])

                                                    finlist = orderlistbydistance(finlist)

                                                    setlis([...finlist])

                                                })
                        
                                            } else {
                                                // console.log('falied twice')

                                                finlist.push([
                                                    0,
                                                    ele[1], 
                                                    ele[2], 
                                                    ele[3], 
                                                    ele[4], 
                                                    ele[5], 
                                                    ele[6], 
                                                    ele[7], 
                                                    ele[8],
                                                    ele[9]
                                                ])

                                                finlist = orderlistbydistance(finlist)

                                                setlis([...finlist])

                                            }

                                        })

                                        //end

                                    })

                                } else {

                                    // console.log('safe here')
                                
                                    let req = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + addr + '.json?access_token=pk.eyJ1IjoibG9yZG9mdW5pdmVyc2UiLCJhIjoiY2tvdGw3ajkwMGNrYTJ4cWp4Mzh5cDBwdyJ9.DeuOLVX7a5ULR1UCGbnHrA'
                                    
                                    // console.log('3: ', req)

                                    axios.get(req)
                                    .then((data) => {
                                        let d = data.data.features

                                        if ((d.length >= 1)){
                                            // console.log('available 2', loc)
                                            // console.log(d[0].center)
                    
                                            let coor = d[0].center

                                            let newreq = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + coor[0] + ',' + coor[1] + ';' + maincoor[0] + ',' + maincoor[1] + '?overview=full&geometries=geojson&access_token=pk.eyJ1IjoibG9yZG9mdW5pdmVyc2UiLCJhIjoiY2tvdGw3ajkwMGNrYTJ4cWp4Mzh5cDBwdyJ9.DeuOLVX7a5ULR1UCGbnHrA'

                                            // console.log('4: ', newreq)

                                            axios.get(newreq)
                                            .then((dat) => {
                                                // console.log('got:', dat.data.routes[0].distance)

                                                finlist.push([
                                                    dat.data.routes[0].distance,
                                                    ele[1], 
                                                    ele[2], 
                                                    ele[3], 
                                                    ele[4], 
                                                    ele[5], 
                                                    ele[6], 
                                                    ele[7], 
                                                    ele[8],
                                                    ele[9]
                                                ])
                                                
                                                finlist = orderlistbydistance(finlist)

                                                setlis([...finlist])

                                            })
                                            .catch((err) => {                            
                                                // console.log('its an error')

                                                finlist.push([
                                                    0,
                                                    ele[1], 
                                                    ele[2], 
                                                    ele[3], 
                                                    ele[4], 
                                                    ele[5], 
                                                    ele[6], 
                                                    ele[7], 
                                                    ele[8],
                                                    ele[9]
                                                ])
                                                
                                                finlist = orderlistbydistance(finlist)
                                                
                                                setlis([...finlist])

                                            })
                    
                                        } else {
                                            // console.log('failed twice')

                                            finlist = orderlistbydistance(finlist)

                                            finlist.push([
                                                0,
                                                ele[1], 
                                                ele[2], 
                                                ele[3], 
                                                ele[4], 
                                                ele[5], 
                                                ele[6], 
                                                ele[7], 
                                                ele[8],
                                                ele[9]
                                            ])

                                            setlis([...finlist])

                                        }

                                    })
                                
                                }
                            })
                            .then(() => {
                                // console.log('finally', finlist)
                                // setlis(...finlist)
                            })
                            .catch((err) => {console.log(err)})
                            })



                    } else {

                        alert('Please give a proper location')

                    }

                })

                
            
            }

        }

    const handlecardclick = (element) => {

        // name,                 6
        // email,                7
        // desc,                 8
        // profilephoto          9

        let email = element[7]

        history.push('/home/' + email.slice(0, email.length - 10))
        
    }

    return (
        <Full>
          <Styles>
                        <Navbar expand="lg">
                            <Navbar.Brand href="/">Ozone</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="ml-auto">
	    
	    			    <Nav.Item>
                                        <Nav.Link>
                                        <Link to="/map">Map</Link>
                                        </Nav.Link>
                                    </Nav.Item>

                                    <Nav.Item>
                                        <Nav.Link>
                                            <Link to="/vaccinationlist">Vaccination List</Link>
                                        </Nav.Link>
                                    </Nav.Item>

                                    <Nav.Item>
                                        <Nav.Link>
                                        <Link to="/seller">Seller Home Page</Link>
                                        </Nav.Link>
                                    </Nav.Item>

                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                    </Styles >


                    <TopPart>

                        {/* Search input box */}
                        
                        <Search>  

                        <div class="input-group mb-3">
                                
                                <input value={searchvalue}
                                placeholder = 'Type your place name'
                                onChange={(e) => { let t = e.target.value; setsearchvalue(e.target.value)}}
                                type="text" class="form-control" aria-label="Text input with dropdown button" />

                        </div>        

                        </Search>

                        {/* Filter for sort and asc, desc option */}

                        <Filter>

                             <div class="input-group mb-3">

                                <button
                                // onClick = {() => { handlesearchclick(searchvalue) }}
                                onClick = {() => { handlepromises(searchvalue) }}
                                class="btn btn-outline-secondary" type="button" aria-expanded="false"> Search </button>

                            </div> 

			   <div class="input-group mb-3">

                                <button
                                onClick = {() => { 
                                    history.push('/map')
                                    window.location.reload()
                                 }}
                                class="btn btn-outline-secondary" type="button" aria-expanded="false"> Map </button>

                           </div> 

                        </Filter>

                    </TopPart>

                    <Listview>
                        <>

                            
                            {
                                ((lis.length >= 1)) ?

                                <>


                                    <Grid key={changeme} container spacing={3}>

                                        {
                                            lis.map((element, index) => {

                                                // distance,             0  
                                                // location,             1
                                                // addr,                 2
                                                // phno,                 3
                                                // oxyprice,             4
                                                // foreign_seller_id,    5
                                                // name,                 6
                                                // email,                7
                                                // desc,                 8
                                                // profilephoto          9
						    
						    console.log('here comes')
						    console.log("https://oxy-zone.herokuapp.com/media/" + element[9])
                                                    

                                                        return (

                                                            <Grid item xs={11} >
                                                                {console.log('check')}
                                                                <Card className={classes.root} id = 'makeme2' >

                                                                    {/* <CardContent> */}

                                                                    <Topofcard onClick = {() => {handlecardclick(element)}}>

                                                                        <Round>
                                                                            <Roundimg
                                                                            src = { "https://oxy-zone.herokuapp.com/media/" + element[9]}
                                                                            />
                                                                        </ Round>
                                                                        
                                                                        <Name >
                                                                            <P>{element[6]}</P>
                                                                        </ Name>

                                                                    </Topofcard>
                                                                    
                                                                    <HR />
                                                                    
                                                                    <Bottomofcard>

                                                                        <Halfone>

                                                                            <Onehalf>
                                                                                <Element>
                                                                                    Location:
                                                                                </Element>

                                                                                <Element>

                                                                                    Ph No:
                                                                                </Element>

                                                                                <Element>

                                                                                    Price/Container:
                                                                                </Element>
                                                                            </Onehalf>
                                                                            <Twohalf>
                                                                                <Element2>
                                                                                    {element[1]}
                                                                                </Element2>

                                                                                <Element2>

                                                                                    {element[3]}
                                                                                </Element2>

                                                                                <Element2>

                                                                                Rs {element[4]}
                                                                                </Element2>
                                                                            </Twohalf>

                                                                        </Halfone>

                                                                        <Halftwo>
                                                                            <Element3>

                                                                                Address:
                                                                            
                                                                            </Element3>
                                                                            
                                                                            <Element4>

                                                                                {element[2]}

                                                                            </Element4>
                                                                        </Halftwo>

                                                                    </Bottomofcard>

                                                                </Card>
                                                            </Grid>
                                                        )

                                                    


                                                
                                                
                                                

                                            })
                                        }


                                    </Grid>

                                    </>



                                    : loading ?

                                    
                                        //console.log('here load is true')
                                    

                                        <Loadin>


                                            <div class="container2">
                                              <div class="dash uno"></div>
                                              <div class="dash dos"></div>
                                              <div class="dash tres"></div>
                                              <div class="dash cuatro"></div>
                                            </div>


                                        </Loadin>

                                        :

                                        <div class="container2">
                                            <p>
                                                List is currently empty
                                            </p>
                                        </div>


                            }
                        </>
                    </Listview>




			

                 

        </ Full >
    )
}

export default BuyerHome


const Full = styled.div`

height: 100%;

`

const Bottom = styled.div`

display: flex;
width: 100%;
flex-direction: row;
justify-content: space-between;

`

const Logout = styled.div`

position: absolute;
top: 10px;
right: 10px;

`



const Plus = styled.div`

position: sticky;
background-color: #1685F1;
width: 40px;
height: 40px;
border-radius: 50%;
top: 100px;
// right: 50px;
left: 95%;
display: flex;
justify-content: center;
align-items: center;
cursor: pointer;

$hover: {
    cursor: pointer;
}

`


const Title = styled.div`

width: 100%;
height: 150px;
display: flex;
justify-content: center;
align-items: center;
font-size: 60px;

`

const Listview = styled.div`

// overflow: scroll; 

`

const Hr = styled.hr`

margin: 0;
padding: 0;

`

const Styles = styled.div`

position: sticky;
top: 0;
z-index: 10;

.navbar {

    background-color: #222;

}

a, .navbar-brand, .navbar-nav .nav-link {

    color: #bbb !important;

    &:hover {

        color: white !important;
        text-decoration: none !important;
    
    }
}

`

const Name = styled.div`

display: flex;
justify-content: center;
align-items: center;
margin-left: 25px;

`

const P = styled.p`

height: 50px;
font-size: 30px;

    &:first-letter {
        text-transform:capitalize;
    }

`

const Round = styled.div`
  height: 75px;
  width: 75px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  margin-top: 10px;

  &: hover {
    cursor: pointer;
  }
`;

const Roundimg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid black;
  // overflow: hidden;
  object-fit: cover;
`;

const HR = styled.hr`

padding: 0;
margin: 0;
opacity: 0.2;
margin-left: 50px;

`

const Topofcard = styled.div`

display: flex;
flex-direction: row;
width: 100%;
height: 75px;

  &:hover{
    cursor: pointer;
  }

`

const Bottomofcard = styled.div`

display: flex;
height: 150px;
flex-direction: row;
width; 100%;
padding: 20px;

`

const TopPart = styled.div`

display: flex;
flex-direction: row;
margin-top: 50px;
margin-bottom: 0px;
margin-left: 100px;
z-index: -10;

`

const Search = styled.div`

width: 70%;
margin-right: 50px;

`

const Filter = styled.div`

display: flex;
width: 200px;
flex-direction: row;
justify-content: space-between;

`

const Halfone = styled.div`

height: 100%;
width: 55%;
display: flex;
flex-direction: row;
//justify-content: space-around;

`

const Halftwo = styled.div`

height: 100%;
width: 45%;
display: flex;
flex-direction: column;
padding-left: 2%;

`

const Iconside = styled.div`

height: 100%;
width: 8%;
display: flex;
flex-direction: column;
justify-content: space-between;
padding-top: 10px;
padding-bottom: 10px;

`

const Element = styled.div`

margin-left: 10px;
// margin-top: 8px;
display: flex;
flex-direction: row;
font-weight: 500;
font-size: 18px;

`

const Element2 = styled.div`

margin-left: 60px;
// margin-top: 8px;
display: flex;
flex-direction: row;
overflow: hidden;

`

const Element3 = styled.div`

// margin-top: 8px;
display: flex;
flex-direction: row;
font-weight: 500;
font-size: 18px;
margin-top: 10px;

`

const Element4 = styled.div`

margin-left: 20px;
// margin-top: 8px;
display: flex;
flex-direction: row;
//break-after: always;
word-wrap: anywhere;
height: 110px;
overflow: auto;

`

const Onehalf = styled.div`

width: 54%;
display: flex;
justify-content: space-around;
flex-direction: column;
height : 100%;

`

const Twohalf = styled.div`

width: 66%;
display: flex;
justify-content: space-around;
flex-direction: column;
height : 100%;
margin-left: -35px;

`

const Loadin = styled.div`

height: 100%;
width: 100%
display: flex;
justify-content: center;
align-items: center;

`

