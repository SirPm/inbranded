import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/lib/ReactCrop.scss';

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
        console.log('onImageLoaded', image);
        imageRef.current = image;
    }, [])

    const onCropComplete = crop => {
        console.log('onCropComplete', crop);
        setCompletedCrop(crop);
    }

    const onCropChange = crop => {
        setCrop(crop);
    }

    return (
        <div className="App">
            <div>
                <input type="file" accept=".png, .jpeg, .jpg" onChange={onSelectFile} />
            </div>
            <ReactCrop
                src={src}
                crop={crop}
                onImageLoaded={onImageLoaded}
                onComplete={onCropComplete}
                onChange={onCropChange}
            />
            <div>
                <canvas
                    ref={previewCanvasRef}
                    // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                    style={{
                        width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0)
                    }}
                />
            </div>
            <button
                type="button"
                disabled={!completedCrop?.width || !completedCrop?.height}
                onClick={() =>
                    generateDownload(previewCanvasRef.current, completedCrop)
                }
            >
                Download cropped image
            </button>
        </div>
    )
}

export default InputFile;