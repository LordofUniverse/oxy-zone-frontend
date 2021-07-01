/* eslint-disable no-lone-blocks */
/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';

import { useHistory } from "react-router-dom";

import '../Seller/sellerhome.css'
import SearchTag from '../Seller/SearchTag.js'
import FilterTag from '../Seller/FilterTag';

// import { parse, v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
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

let ascvar = true

const SellerHome = () => {

    const reftext = useRef('');

    const history = useHistory();

    const handleclick = () => {

        localStorage.removeItem('gid')
        window.location.reload()

    }

    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    const [lis, setlis] = useState([])
    const [loading, setloading] = useState(true)
    const [dropop, setdropop] = useState([['Location', true], ['Address', false], ['Ph No', false], ['Price', false]])
    const [filterop, setfilterop] = useState([['Location', false], ['Address', false], ['Ph No', false], ['Price', false]])
    const [update, setupdate] = useState(false)
    const [asc, setasc] = useState(true)
    const [searchvalue, setsearchvalue] = useState('')
    let load = true

    let changeme = ''

    const process = (data) => {

        if (!(data.status == 226)) {

            let newlist = []
            for (let i = 0; i < data.data.Data.length; i++) {
                newlist.push(['noedit', data.data.Data[i].location, data.data.Data[i].addr, data.data.Data[i].phno, data.data.Data[i].oxyprice, data.data.Data[i].foreign_seller])
            }

            setlis(newlist)

        } else {

            if (data.data.Data === 'No data') {
                console.log('NO DATA')
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

    const [det, setdet] = useState([])


    useEffect(() => {

        const val = localStorage.getItem("gid").split(',')

        axios.post('http://oxy-zone.herokuapp.com/api/sellers/details/', {
            id: parseInt(val[0]),
            name: val[1],
            email: val[2],
            password: val[3]
        }).then((data) => process(data))
        .catch((err) => console.log('error:', err))

        //id, name, email, pwd, imgloc, desc
        setdet([val[0], val[1], val[2], val[3], val[4], val[5]])

        //id, name, email, pwd, imgloc, desc, name, email, pwd, imgloc
        //setprof([val[0], val[1], val[2], val[3], val[4], val[5], val[1], val[2], val[3], val[4]]) //here, img and desc is not updated

    }, [])

    const handleplusclick = () => {

        setloading(true)

        let listt = ['newedit', '', '', '', '', parseInt(localStorage.getItem("gid").split(',')[0]), '', '', '', '']

        setlis([listt, ...lis])

    }

    const cancelnewclick = (location, addr, phno, oxyprice, id) => {

        for (let i = 0; i < lis.length; i++) {

            if (lis[i][1] === location && lis[i][2] === addr && lis[i][3] === phno && lis[i][4] === oxyprice && lis[i][5] === id) {


                let listt = [

                    ...lis.slice(0, i),
                    ...lis.slice((i + 1), (lis.length))

                ]


                if (listt === []) {

                    setloading(false)

                }

                setlis(listt)

                break;
            }

        }
    }

    const canceloldclick = (location, addr, phno, oxyprice, id, newlocation, newaddr, newphno, newoxyprice) => {

        for (let i = 0; i < lis.length; i++) {

            if (lis[i][1] === location && lis[i][2] === addr && lis[i][3] === phno && lis[i][4] === oxyprice && lis[i][5] === id, lis[i][6] === newlocation && lis[i][7] === newaddr && lis[i][8] === newphno && lis[i][9] === newoxyprice) {


                let listt = [

                    ...lis.slice(0, i),
                    ['noedit', newlocation, newaddr, newphno, newoxyprice, id],
                    ...lis.slice((i + 1), (lis.length))

                ]

                if (listt === []) {

                    setloading(false)

                }

                setlis(listt)

                break;
            }

        }


    }

    const deleteclick = (location, addr, phno, oxyprice, id, cond) => {

        axios.post('http://oxy-zone.herokuapp.com/api/sellers/delete/', {
            location: location,
            addr: addr,
            phno: phno,
            oxyprice: parseFloat(oxyprice),
            id: id,
        })
            .then((res) => {

                if (res.status === 200) {

                    for (let i = 0; i < lis.length; i++) {

                        if (lis[i][1] === location && lis[i][2] === addr && lis[i][3] === phno && lis[i][4] === oxyprice && lis[i][5] === id) {

                            setlis([
                                ...lis.slice(0, i),
                                ...lis.slice((i + 1), lis.length)
                            ])

                        }

                    }

                } else {
                    alert('Some error occured, please reload the page and try again!')
                }

            })

    }

    const saveclick = (location, addr, phno, oxyprice, id, type, newlocation, newaddr, newphno, newoxyprice) => {

        if (phno.toString().length === 10) {

            if (type === 'oldedit') {

                axios.post('http://oxy-zone.herokuapp.com/api/sellers/save/old/', {
                    location: location,
                    addr: addr,
                    phno: phno,
                    oxyprice: parseFloat(oxyprice),
                    id: id,
                    oldlocation: newlocation,
                    oldaddr: newaddr,
                    oldphno: newphno,
                    oldoxyprice: parseFloat(newoxyprice),
                })
                    .then((res) => {

                        if (res.status === 200) {

                            for (let i = 0; i < lis.length; i++) {

                                if (lis[i][0] === 'oldedit' && lis[i][1] === location && lis[i][2] === addr && lis[i][3] === phno && lis[i][4] === oxyprice && lis[i][5] === id && lis[i][6] === newlocation && lis[i][7] === newaddr && lis[i][8] === newphno && lis[i][9] === newoxyprice) {

                                    setlis([
                                        ...lis.slice(0, i),
                                        ['noedit', location, addr, phno, oxyprice, id],
                                        ...lis.slice((i + 1), lis.length)
                                    ])

                                }

                            }

                        } else {
                            alert('Some error occured, please try reloading the page!')
                        }

                    })
                    .catch((err) => { console.log(err) })

            } else {

                console.log(location, addr, phno, oxyprice, id)

                axios.post('http://oxy-zone.herokuapp.com/api/sellers/save/new/', {
                    location: location,
                    addr: addr,
                    phno: phno,
                    oxyprice: parseFloat(oxyprice),
                    id: id,
                })
                    .then((res) => {
                        
                        if (res.status === 200) {

                            for (let i = 0; i < lis.length; i++) {

                                if (lis[i][0] === 'newedit' && lis[i][1] === location && lis[i][2] === addr && lis[i][3] === phno && lis[i][4] === oxyprice && lis[i][5] === id) {

                                    setlis([
                                        ...lis.slice(0, i),
                                        ['noedit', location, addr, phno, oxyprice, id],
                                        ...lis.slice((i + 1), lis.length)
                                    ])

                                }

                            }

                        } else {
                            alert('Some error occured, please try reloading the page and try again!')
                        }

                    })
                    .catch((err) => { console.log(err) })

            }

        } else {

            alert('10 numbers only')

        }



    }

    // lis => [ 'edit or noedit', 'location', 'addr', 'phno', 'oxyprice', 'id' ]

    const editclick = (location, addr, phno, oxyprice, id) => {

        for (let i = 0; i < lis.length; i++) {
            if (id === lis[i][5] && location === lis[i][1] && addr === lis[i][2] && phno === lis[i][3] && oxyprice === lis[i][4]) {

                let listt = ['oldedit', lis[i][1], lis[i][2], lis[i][3], lis[i][4], id, lis[i][1], lis[i][2], lis[i][3], lis[i][4]]

                let newlist = [...lis.slice(0, i), listt, ...lis.slice((i + 1), (lis.length))]

                setlis(newlist)

            }
        }
    }

    const handleprofile = () => {

        history.push("seller/update");

    }


    const changelis = (exact) => {

        let fin = []
        let rem = []

        for (let i = 0; i < lis.length; i++) {
            if (!(lis[i][0] === 'noedit')) {
                fin.push(lis[i])
            } else {
                rem.push(lis[i])
            }
        }

        if (rem.length >= 1) {

            ascvar ?

                rem.sort(function (a, b) {
                    if (a[exact].toString() > b[exact].toString()) { return 1; }
                    if (a[exact].toString() < b[exact].toString()) { return -1; }
                    return 0;
                }) :

                rem.sort(function (a, b) {
                    if (a[exact].toString() > b[exact].toString()) { return -1; }
                    if (a[exact].toString() < b[exact].toString()) { return 1; }
                    return 0;
                })

        }

        let finlist = [...fin, ...rem]

        setlis([...finlist])

    }



    return (
        <Full>

            {

                <>

                    {/* styles - top black bar */}

                    <Styles>
                        <Navbar expand="lg">
                            <Navbar.Brand href="/">Ozone</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="ml-auto">

                                    <Nav.Item>
                                        <Nav.Link>
                                            <Link to="/vaccinationlist">Vaccination List</Link>
                                        </Nav.Link>
                                    </Nav.Item>

                                    <Nav.Item>
                                        <Nav.Link>
                                            <div onClick={handleprofile} >Update Profile</div>
                                        </Nav.Link>
                                    </Nav.Item>

                                    <Nav.Item>
                                        <Nav.Link>
                                            <div onClick={handleclick} >Log Out</div>
                                        </Nav.Link>
                                    </Nav.Item>

                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                    </Styles >

                    <TopPart>

                        {/* Search input box */}
                        
                        <Search>  

                            <SearchTag dropop = {dropop} setdropop = {setdropop} searchvalue = {searchvalue} setsearchvalue = {setsearchvalue} ascvar = {ascvar} filterop = {filterop} />
        

                        </Search>

                        {/* Filter for sort and asc, desc option */}

                        <Filter>

                            {/* <FilterTag filterop = {filterop} setfilterop = {setfilterop} ascvar = {ascvar} changelis = {changelis} setasc = {setasc} asc = {asc} /> */}

                             <div class="input-group mb-3">


                                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"> Sort </button>


                                <ul class="dropdown-menu">

                                    {
                                        filterop.map((element) => {

                                            if (element[1]) {

                                                return (<li><a class="dropdown-item" onClick={() => {

                                                    let listnw = []

                                                    for (let i = 0; i < filterop.length; i++) {
                                                        listnw.push([filterop[i][0], false])
                                                    }

                                                    setfilterop([
                                                        ...listnw
                                                    ])

                                                }} > {element[0]} <CheckIcon /> </a></li>)

                                            } else {

                                                return (<li><a class="dropdown-item" onClick={() => {

                                                    let listnw = []
                                                    let ob = { 'Location': 1, 'Address': 2, 'Ph No': 3, 'Price': 4 }
                                                    let exact = 1

                                                    for (let i = 0; i < filterop.length; i++) {
                                                        if (!(filterop[i][0] === element[0])) {
                                                            listnw.push([filterop[i][0], false])
                                                        } else {
                                                            listnw.push([element[0], true])
                                                            exact = ob[element[0]]
                                                        }
                                                    }

                                                    setfilterop([
                                                        ...listnw
                                                    ])

                                                    changelis(exact)

                                                }
                                                }
                                                > {element[0]} </a></li>)

                                            } //else

                                        })
                                    }

                                    <li><hr class="dropdown-divider" /></li>

                                    {
                                        asc ? <>
                                            <li><a class="dropdown-item" > asc <CheckIcon /> </a></li>
                                            <li><a class="dropdown-item" onClick={() => {
                                                setasc(false)
                                                ascvar = false

                                                let exact = 0
                                                let done = false

                                                let ob = { 'Location': 1, 'Address': 2, 'Ph No': 3, 'Price': 4 }

                                                for (let i = 0; i < filterop.length; i++) {
                                                    if ((filterop[i][1])) {
                                                        exact = ob[filterop[i][0]]
                                                        done = true
                                                    }
                                                }

                                                if (done) {

                                                    changelis(exact)

                                                }


                                            }} > desc </a></li>
                                        </>
                                            :
                                            <>
                                                <li><a class="dropdown-item" onClick={() => {
                                                    setasc(true)
                                                    ascvar = true

                                                    let exact = 0
                                                    let done = false

                                                    let ob = { 'Location': 1, 'Address': 2, 'Ph No': 3, 'Price': 4 }

                                                    for (let i = 0; i < filterop.length; i++) {
                                                        if (!(filterop[i][1])) {
                                                            exact = ob[filterop[i][0]]
                                                            done = true
                                                        }
                                                    }

                                                    if (done) {

                                                        changelis(exact)

                                                    }

                                                }} > asc </a></li>
                                                <li><a class="dropdown-item" > desc <CheckIcon /> </a></li>
                                            </>

                                    }

                                </ul>
                            </div> 

                        </Filter>

                    </TopPart>

                    <Listview>
                        <>

                            
                            {
                                ((lis.length >= 1)) ?

                                <>

                                <Plus onClick={handleplusclick}>
                                <AddIcon style={{ color: 'white' }} />
                            </Plus>

                                    <Grid key={changeme} container spacing={3}>

                                        {
                                            lis.map((element, index) => {

                                                if (element[0] == 'noedit') {

                                                    let yes = false
                                                    let mode = ''

                                                    // this is comment -> ['noedit', data.data.Data[i].location, data.data.Data[i].addr, data.data.Data[i].phno, data.data.Data[i].oxyprice, data.data.Data[i].foreign_seller]

                                                    if (!(searchvalue === '')) {

                                                        for (let i = 0; i < 4; i++) {
                                                            if (dropop[i][1]) {
                                                                mode = dropop[i][0]
                                                            }
                                                        }

                                                        if (mode === 'Location') {

                                                            if (element[1].includes(searchvalue)) {

                                                                yes = true

                                                            }

                                                        }
                                                        else if (mode === 'Address') {

                                                            if (element[2].includes(searchvalue)) {

                                                                yes = true

                                                            }

                                                        }
                                                        else if (mode === 'Ph No') {

                                                            if (element[3].toString().includes(searchvalue.toString())) {

                                                                yes = true

                                                            }

                                                        }
                                                        else if (mode === 'Price') {

                                                            if (element[4].toString().includes(searchvalue.toString())) {

                                                                yes = true

                                                            }

                                                        }

                                                        if (yes) {

                                                            changeme += 's'

                                                            return (
                                                                <Grid item xs={11} >
                                                                <Card className={classes.root} id='makeme'>

                                                                    <Halfone>

                                                                        <Onehalf>
                                                                            <Element>
                                                                                Location:
                                                                            </Element>

                                                                            <Element>

                                                                                Ph No:
                                                                            </Element>

                                                                            <Element>

                                                                                Price:
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
                                                                    <Iconside>

                                                                        <Button size="small" id='butstart' onClick={() => {

                                                                            editclick(

                                                                                element[1],
                                                                                element[2],
                                                                                element[3],
                                                                                element[4],
                                                                                element[5]

                                                                            )

                                                                        }}
                                                                        >

                                                                            <EditIcon />

                                                                        </Button>

                                                                        <Button size="small" id='butend' onClick={() => {

                                                                            deleteclick(

                                                                                element[1],
                                                                                element[2],
                                                                                element[3],
                                                                                element[4],
                                                                                element[5],

                                                                            )

                                                                        }}
                                                                        >

                                                                            <DeleteIcon style={{ marginLeft: '13px' }} />

                                                                        </Button>


                                                                    </Iconside>

                                                                </Card>
                                                            </Grid>
                                                            )

                                                        } else {

                                                            { console.log('welcome to my website!') }

                                                        }


                                                    } else {

                                                        return (

                                                            <Grid item xs={11} >
                                                                <Card className={classes.root} id='makeme'>

                                                                    <Halfone>

                                                                        <Onehalf>
                                                                            <Element>
                                                                                Location:
                                                                            </Element>

                                                                            <Element>

                                                                                Ph No:
                                                                            </Element>

                                                                            <Element>

                                                                                Price:
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
                                                                    <Iconside>

                                                                        <Button size="small" id='butstart' onClick={() => {

                                                                            editclick(

                                                                                element[1],
                                                                                element[2],
                                                                                element[3],
                                                                                element[4],
                                                                                element[5]

                                                                            )

                                                                        }}
                                                                        >

                                                                            <EditIcon />

                                                                        </Button>

                                                                        <Button size="small" id='butend' onClick={() => {

                                                                            deleteclick(

                                                                                element[1],
                                                                                element[2],
                                                                                element[3],
                                                                                element[4],
                                                                                element[5],

                                                                            )

                                                                        }}
                                                                        >

                                                                            <DeleteIcon style={{ marginLeft: '13px' }} />

                                                                        </Button>


                                                                    </Iconside>

                                                                </Card>
                                                            </Grid>
                                                        )

                                                    }


                                                } else if (element[0] === 'newedit' || element[0] === 'oldedit') {

                                                    return(
                                                     
                                                        <Grid item xs={11} >
                                                                <Card className={classes.root} id='makeme'>

                                                                    <Halfone>

                                                                        <Onehalf>
                                                                            <Element>
                                                                                Location:
                                                                            </Element>

                                                                            <Element>

                                                                                Ph No:
                                                                            </Element>

                                                                            <Element>

                                                                                Price:
                                                                            </Element>
                                                                        </Onehalf>
                                                                        <Twohalf>
                                                                            <Element2>
                                                                            <input
                                                                            style = {{ width: '100%' }}
                                                                        type='text'
                                                                        onChange={(e) => setlis([...lis.slice(0, index), [element[0], e.target.value, element[2], element[3], element[4], element[5], element[6], element[7], element[8], element[9]], ...lis.slice((index + 1), lis.length)])}
                                                                        value={element[1]}
                                                                    />
                                                                            </Element2>

                                                                            <Element2>

                                                                            <input
                                                                            style = {{ width: '100%' }}
                                                                        type='number'
                                                                        value={element[3]}
                                                                        onChange={(e) =>
                                                                            e.target.value.length <= 10 ?
                                                                                setlis([...lis.slice(0, index), [element[0], element[1], element[2], parseInt(e.target.value), element[4], element[5], element[6], element[7], element[8], element[9]], ...lis.slice((index + 1), lis.length)])
                                                                                :
                                                                                console.log('not allowed')
                                                                        }
                                                                    />
                                                                            </Element2>

                                                                            <Element2>

                                                                            Rs <input
                                                                            style = {{ width: '100%' }}
                                                                        type='text'
                                                                        value={(element[4])}
                                                                        onChange={(e) => {

                                                                            console.log('me: ', e.target.value)

                                                                            if (e.target.value === '') {

                                                                                setlis([...lis.slice(0, index), [element[0], element[1], element[2], element[3], (e.target.value), element[5], element[6], element[7], element[8], element[9]], ...lis.slice((index + 1), lis.length)])

                                                                            }
                                                                            else if ((['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'].includes(e.target.value[(e.target.value.length - 1)]))) {

                                                                                if (e.target.value.includes('.')) {

                                                                                    if (e.target.value.split('.').length === 2) {

                                                                                        setlis([...lis.slice(0, index), [element[0], element[1], element[2], element[3], (e.target.value), element[5], element[6], element[7], element[8], element[9]], ...lis.slice((index + 1), lis.length)])

                                                                                    }


                                                                                } else {

                                                                                    setlis([...lis.slice(0, index), [element[0], element[1], element[2], element[3], (e.target.value), element[5], element[6], element[7], element[8], element[9]], ...lis.slice((index + 1), lis.length)])

                                                                                }

                                                                            }
                                                                        }

                                                                        }

                                                                    />
                                                                            </Element2>
                                                                        </Twohalf>

                                                                    </Halfone>
                                                                    <Halftwo>
                                                                        <Element3>

                                                                            Address:
                                                                        
                                                                        </Element3>
                                                                        
                                                                        <Element4>

                                                                        <textarea
                                                                        style = {{ width: '100%' }}
                                                                        type='text'
                                                                        value={element[2]}
                                                                        onChange={(e) =>
                                                                            setlis([...lis.slice(0, index), [element[0], element[1], e.target.value, element[3], element[4], element[5], element[6], element[7], element[8], element[9]], ...lis.slice((index + 1), lis.length)])
                                                                        }
                                                                    />

                                                                        </Element4>
                                                                    </Halftwo>
                                                                    <Iconside>

                                                                    <Button size="small" id='butstart' onClick={() => {

                                                                        if (!(element[1] === '' || element[2] === '' || element[3] === '' || element[4] === '')) {

                                                                            {
                                                                                saveclick(
                                                                                    element[1],
                                                                                    element[2],
                                                                                    element[3],
                                                                                    element[4],
                                                                                    element[5],
                                                                                    element[0],
                                                                                    element[6],
                                                                                    element[7],
                                                                                    element[8],
                                                                                    element[9]
                                                                                )

                                                                            }

                                                                        } else {

                                                                            console.log('fill the values')

                                                                        }

                                                                        }} >
                                                                        <SaveIcon />
                                                                        </Button>

                                                                        <Button
                                                                        size="small"
                                                                        id='butend'
                                                                        onClick={() =>

                                                                            element[0] === 'newedit' ?

                                                                                cancelnewclick(

                                                                                    element[1],
                                                                                    element[2],
                                                                                    element[3],
                                                                                    element[4],
                                                                                    element[5],

                                                                                ) :

                                                                                canceloldclick(

                                                                                    element[1],
                                                                                    element[2],
                                                                                    element[3],
                                                                                    element[4],
                                                                                    element[5],
                                                                                    element[6],
                                                                                    element[7],
                                                                                    element[8],
                                                                                    element[9],

                                                                                )}>


                                                                        <CancelIcon />


                                                                        </Button>

                                                                    </Iconside>

                                                                </Card>
                                                            </Grid>

                                                    )

                                                }

                                            })
                                        }


                                    </Grid>

                                    </>



                                    : loading ?

                                        <Loadin>


                                            <div class="container2">
                                              <div class="dash uno"></div>
                                              <div class="dash dos"></div>
                                              <div class="dash tres"></div>
                                              <div class="dash cuatro"></div>
                                            </div>


                                        </Loadin>

                                        :

                                        <Plus onClick={handleplusclick}>
                                <AddIcon style={{ color: 'white' }} />
                            </Plus>

                            }
                        </>
                    </Listview>

                </>

            }
        </Full >
    )
}

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

scrollable: true;

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
margin-right: 100px;

`

const Filter = styled.div`

width: 200px;

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

margin-left: 60px;
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

width: 61%;
display: flex;
justify-content: space-around;
flex-direction: column;
height : 100%;
margin-left: -80px;

`

const Loadin = styled.div`

height: 100%;
width: 100%
display: flex;
justify-content: center;
align-items: center;

`

export default SellerHome
