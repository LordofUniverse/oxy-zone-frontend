import React, { useEffect, useState } from 'react'
import {
    useHistory,
    useParams
  } from "react-router-dom";

import styled from 'styled-components'

import axios from 'axios'

function Sellerdetails() {

    const history = useHistory()
    const [det, setdet] = useState([])

    let { seller } = useParams();

    useEffect(() => {

        axios.post('http://oxy-zone.herokuapp.com/api/getdetbyemail/', {
            email: seller + '@gmail.com'
        }).then((res) => {
            let dar = res.data.Data

            if (dar === 'Email Wrong'){
                alert('Some error occured')
                history.push('/home')
            } else {

                setdet([dar.name, dar.desc, dar.profilephoto])

            }

        }).catch((err) => {
            console.log('oops:', err)
        })

    }, [])

    return (
        <>
        
            {det ? 
                
                <FullPage>
                    <TopHalf>
                        <Round>
                            <Roundimg src = { det[2] } />
                        </Round>
                        <Name>
                            <P>{ det[0] }</P>
                        </Name>
                        <Email>
                            <p>{ seller + '@gmail.com' }</p>
                        </Email>
                    </TopHalf>
                    <BottomHalf>
                        {
                            det[1] === '' ?
                            console.log('empty') :
                            <>
                                <P3>About me:</P3>
                                <P2>
                                    {det[1]}
                                </P2>
                            </>
                        }
                    </BottomHalf>
                </FullPage>
            
            :
            console.log('loading')
            
            }
    
        </>
    )
}

export default Sellerdetails

const P3 = styled.p`

margin-top: 5px;
margin-left: 10px;

`

const P2 = styled.p`

margin: 15px;
margin-top: 5px;
// border: 1px solid black;
height: 90%;
overflow: scroll;

`


const Round = styled.div`
  height: 430px;
  width: 300px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  max-height: 230px;
  max-width: 230px;
`;

const Roundimg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid black;
  // overflow: hidden;
  object-fit: cover;
`;

const FullPage = styled.div`

height: 100%;
width: 100%

`

const TopHalf = styled.div`

display: flex;
width: 100%;
height: 50%;
flex-direction: column;
align-items: center;
justify-content: center;
// justify-content: space-between;

`

const BottomHalf = styled.div`

display: flex;
width: 100%;
height: 50%;
flex-direction: column;
// justify-content: space-between;

`

const Name = styled.div`

height: 100px;
width: 300px;
display: flex;
justify-content: center;
align-items: center;
font-size: 40px;
font-weight: 600;
margin-top: 6px;

`

const P = styled.p`

&:first-letter {
    text-transform:capitalize;
}

`

const Email = styled.div`

height: 100px;
width: 300px;
display: flex;
justify-content: center;
align-items: center;
font-size: 25px;
font-weight: 400;
opacity: 0.8;

`