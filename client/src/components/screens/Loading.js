import React from 'react';

const Loading = () => {
    return (
        <> 
        <div className="spinner-border loading" style={{width: "3rem",height: "3rem"}} role="status">    
        </div>
        <span className="loading">Loading...</span>
        </>
     );
}
 
export default Loading;