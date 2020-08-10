import React from 'react';

const NoPostsFound = (props) => {
    return ( 
        <>
        <div className="loading">
            <i className = "fa fa-frown-o fa-5x" ></i>
        </div>
        <div style={{marginLeft:"22%"}} className="d-sm-none d-xs-block"><span>{props.data}</span></div>
        <div style={{marginLeft:"35%"}} className="d-xs-none d-sm-block d-none"><span>{props.data}</span></div>
        </>
     );
}
 
export default NoPostsFound;