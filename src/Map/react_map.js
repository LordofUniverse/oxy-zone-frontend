import React from 'react'
import './react_map.css'

document.getElementById('root').style['height'] = window.innerHeight + 'px'

function Mapbox() {

    return (
        <div id='map' style = {{ width: '100%', height: '100%' }}></div>
    );
}

export default Mapbox