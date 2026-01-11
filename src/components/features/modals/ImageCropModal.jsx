


import React, { useState, useCallback } from "react";
import Modal from "react-modal";
import Cropper from "react-easy-crop";
import { Button } from "react-bootstrap";

Modal.setAppElement("#app");

export default function ImageCropModal({ image, isOpen, onClose, onSave }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const createCroppedImage = async () => {
        const canvas = document.createElement("canvas");
        const img = new Image();
        img.src = image;
        await new Promise((res) => (img.onload = res));

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(
            img,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
        );

        canvas.toBlob((blob) => {
            const file = new File([blob], "logo.jpg", { type: "image/jpeg" });
            onSave(file);
            onClose();
        }, "image/jpeg");
    };

    return (

        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="crop-modal"
            overlayClassName="crop-modal-overlay"
        >
            <div className="crop-modal-header">
                <h5>Crop image</h5>
                <span className="close-btn" onClick={onClose}>×</span>
            </div>

            <div className="crop-modal-body">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>

            <div className="crop-modal-footer">
                {/* <button  onClick={onClose}>Cancel</button> */}
                <button className="btn-black" onClick={createCroppedImage}>Save</button>
            </div>
        </Modal>


    );
}
