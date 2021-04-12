import React from 'react';

function TheirMessages({user_name, message}) {
    return (
        <div style={{  marginBottom:'10px'}}>
            <span>{ user_name}</span>

            <p>
                {message}
            </p>
        </div>
    );
}

export default TheirMessages;