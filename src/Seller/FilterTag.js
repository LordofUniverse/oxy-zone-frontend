/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import CheckIcon from '@material-ui/icons/Check';

function FilterTag({ filterop, setfilterop, ascvar, changelis, setasc, asc }) {
  return (
  
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
  
    )
}

export default FilterTag;
