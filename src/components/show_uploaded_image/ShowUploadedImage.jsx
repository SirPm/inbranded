import React from 'react';

import './show-uploaded-image.scss';

const ShowUploadedImage = ({imageUrl}) => {
    return (
        <div className="show-uploaded-image">
            <img src={imageUrl} alt="uploaded file"/>
        </div>
    )
}

export default ShowUploadedImage;
