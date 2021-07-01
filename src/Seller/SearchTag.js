/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

function SearchTag({ dropop, setdropop, searchvalue, setsearchvalue, ascvar, filterop }) {
    return (
        <div class="input-group mb-3">
                                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"> {dropop[0][0]} </button>
                                <ul class="dropdown-menu">

                                    {
                                        dropop.slice(1, dropop.length).map((element) => {

                                            return (
                                                <li><a class="dropdown-item" onClick={() => {

                                                    let nwlist = []

                                                    for (let i = 0; i < filterop.length; i++) {
                                                        if (!(filterop[i][0] === element[0])) {
                                                            nwlist.push([filterop[i][0], false])
                                                        }
                                                    }

                                                    setdropop([
                                                        [element[0], true],
                                                        ...nwlist,
                                                    ])

                                                }
                                                } >
                                                    {element[0]}
                                                </a></li>
                                            )

                                        })
                                    }

                                </ul>
                                <input value={searchvalue} onChange={(e) => {

                                    let t = e.target.value

                                    setsearchvalue(e.target.value)

                                }} type="text" class="form-control" aria-label="Text input with dropdown button" />
                            </div>
    )
}

export default SearchTag
