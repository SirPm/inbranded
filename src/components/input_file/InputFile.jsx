import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/lib/ReactCrop.scss';
import FormData from '../form-data/FormData';

import './input-file.scss';

const generateDownload = (canvas, crop) => {
    if (!crop || !canvas) {
      return;
    }
  
    canvas.toBlob(
      (blob) => {
        const previewUrl = window.URL.createObjectURL(blob);
  
        const anchor = document.createElement('a');
        anchor.download = 'cropPreview.png';
        anchor.href = URL.createObjectURL(blob);
        anchor.click();
  
        window.URL.revokeObjectURL(previewUrl);
      },
      'image/png',
      1
    );
}

const InputFile = () => {
    
    const imageRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [ src, setSrc ] = useState(null);
    const [ crop, setCrop ] = useState({
        x: 10,
        y: 10,
        width: 80,
        height: 80,
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [rotateDeg, setRotateDeg] = useState(0);

    useEffect( () => {
        if(!completedCrop || !imageRef.current || !previewCanvasRef.current) {
            return;
        }

        const image = imageRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
    }, [completedCrop]);

    const onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader()
            reader.addEventListener('load', () => setSrc(reader.result), false )
            reader.readAsDataURL(e.target.files[0])
        }
    }

    const onImageLoaded = useCallback((image) => {
        // console.log('onImageLoaded', image);
        imageRef.current = image;
    }, []);
    
    const [ formData, setFormData ] = useState({
        height: '',
        width: '',
        xAxis: '',
        yAxis: '',
        degree: ''
    });

    const onCropComplete = crop => {
        // console.log('onCropComplete', crop);
        setCompletedCrop(crop);
        setFormData({
            height: crop.height,
            width: crop.width,
            xAxis: crop.x,
            yAxis: crop.y,
            degree: ''
        })
    }

    const onCropChange = crop => {
        setCrop(crop);
    }

    useEffect(() => {
        // console.log(rotateDeg, 'state');
        const image = document.getElementById('image');
        if(rotateDeg > 359 || rotateDeg < -359) {
            setRotateDeg(0)
        }
        image.style.transform = `rotate(${rotateDeg}deg)`;
    }, [rotateDeg]);

    const handleChange = (e) => {
        setRotateDeg(e.target.value);
        setFormData({
            ...formData,
            degree: e.target.value
        })
    }

    const rotateRight = () => {
        if(!completedCrop?.width || !completedCrop?.height) {
            // No image selected yet
        } else {
            setRotateDeg(rotateDeg + 5 );
            setFormData({
                ...formData,
                degree: rotateDeg + 5
            })
        }
        // console.log(rotateDeg);
    }

    const rotateLeft = () => {
        if(!completedCrop?.width || !completedCrop?.height) {
            // No image selected yet
        } else {
            setRotateDeg(rotateDeg - 5 );
            setFormData({
                ...formData,
                degree: rotateDeg - 5
            })
        }
        // console.log(rotateDeg);
    }

    return (
        <div className="input-file">
            <div className="select-picture">
                <label id="inputFileLabel" htmlFor="inputFile">Select a Picture</label>
                <input type="file" accept=".png, .jpeg, .jpg" id="inputFile" onChange={onSelectFile} />
            </div>
            <div className='image-and-edit-options'>
                <ReactCrop
                    src={src}
                    crop={crop}
                    onImageLoaded={onImageLoaded}
                    onComplete={onCropComplete}
                    onChange={onCropChange}
                    className="react-crop"
                />
                <div className="other-edit-options">
                    <div className="input-div">
                        <label htmlFor="number">Input the degree you want to rotate by here</label>
                        <input type="number" id="number" disabled={!completedCrop?.width || !completedCrop?.height} value={rotateDeg} onChange={handleChange}/>
                    </div>
                    <div className={` ${!completedCrop?.width || !completedCrop?.height ? 'hide' : 'rotate-btn'}`}>
                        <i 
                            className={` ${ !completedCrop?.width || !completedCrop?.height ? 'not-allowed' : 'rotate-icon-left' } fa fa-rotate-left`} 
                            onClick={rotateLeft}
                        ></i>
                        <i 
                            className={` ${ !completedCrop?.width || !completedCrop?.height ? 'not-allowed' : 'rotate-icon-right' } fa fa-rotate-right`}
                            onClick={rotateRight}
                        ></i>
                    </div>
                </div>
            </div>
            <div className="canvas-div">
                <canvas
                    ref={previewCanvasRef}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    id="image"
                />
            </div>
            <div className={`${!completedCrop?.width || !completedCrop?.height ? 'hide' : 'form-and-button'}`}>
                <button
                    type="button"
                    disabled={!completedCrop?.width || !completedCrop?.height}
                    onClick={() =>
                        generateDownload(previewCanvasRef.current, completedCrop)
                    }
                    className="download-btn"
                >
                    Download cropped image
                </button>
                <FormData formData={formData} setFormData={setFormData} />
            </div>
        </div>
    )
}

export default InputFile;