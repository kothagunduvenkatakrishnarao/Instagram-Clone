import React from 'react';

const NoPostsFound = (props) => {
    return ( 
        <>
        <div className="loading">
            <i className = "fa fa-frown-o fa-5x" ></i>
        </div>
        <span className="loading">{props.data}</span>
        </>
     );
}
 
export default NoPostsFound;