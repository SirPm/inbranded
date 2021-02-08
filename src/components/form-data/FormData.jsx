import React from 'react';

import './form-data.scss';

const FormData = ({ formData, setFormData }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    const convertToJson = (e) => {
        e.preventDefault();
    
        // Convert Object to JSON
        let jsonObject = JSON.stringify(formData);
    
        let exportedFileName = 'imageDetails.json' || 'export.json';
    
        let blob = new Blob([jsonObject], { type: 'text/json;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, exportedFileName);
        } else {
            let link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        
    }

    const importJson = (e) => {
        e.preventDefault();

        let files = document.getElementById('selectFiles').files;
        // console.log(files);
        if (files.length <= 0) {
        return false;
        }
        
        let fr = new FileReader();
        
        fr.onload = function(e) { 
            // console.log(e);
            let imageData = JSON.parse(e.target.result);
            setFormData({
                height: imageData.height,
                width: imageData.width,
                xAxis: imageData.xAxis,
                yAxis: imageData.yAxis,
                degree: imageData.degree
            });
        }
        
        fr.readAsText(files.item(0));
    }

    return (
        <div className="form-data">
            <form action="">
                <div className="form-input-div">
                    <label htmlFor="">Image Height</label>
                    <input name="height" onChange={ handleChange } value={formData.height} type="number"/>
                </div>
                <div className="form-input-div">
                    <label htmlFor="">Image Width</label>
                    <input name="width" onChange={ handleChange } value={formData.width} type="number"/>
                </div>
                <div className="form-input-div">
                    <label htmlFor="">Image X-Axis Position</label>
                    <input name="xAxis" onChange={ handleChange } value={formData.xAxis} type="number"/>
                </div>
                <div className="form-input-div">
                    <label htmlFor="">Image Y-Axis Position</label>
                    <input name="yAxis" onChange={ handleChange } value={formData.yAxis} type="number"/>
                </div>
                <div className="form-input-div">
                    <label htmlFor="">Image Rotation Degree</label>
                    <input name="degree" onChange={ handleChange } value={formData.degree} type="number"/>
                </div>
                <div className="import-export">
                    <button id="export" onClick={ convertToJson }>Export To Json</button>
                    <div className="import-div">                        
                        <div className="file">
                            <input type="file" id="selectFiles" accept=".json" />
                            <button id="import" onClick={ importJson }>Import Json</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default FormData;
