import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ipcRenderer, clipboard, nativeImage } from 'electron';
import { toast } from 'react-toastify';
import Jcrop from 'jcrop';
import 'jcrop/dist/jcrop.css';
import Tesseract from 'tesseract.js';

const MaskComponent = () => {
  const location = useLocation();
  const imgRef = useRef(null);
  const jcropRef = useRef(null);

  useEffect(() => {
    const requestObject = location.state; // Get requestObject from the location state
    const imageUrl = requestObject.imageURL;
    const type = requestObject.type;

    mask(imageUrl, type);
  }, []);

  const mask = (imageURL, type) => {
    const imgElement = imgRef.current;

    imgElement.src = imageURL;
    imgElement.style.display = 'block';

    if (jcropRef.current) {
      jcropRef.current.destroy();
    }

    Jcrop.attach(imgElement, {
      bgColor: 'black',
      bgOpacity: 0.4,
      setSelect: [0, 0, imgElement.width, imgElement.height],
      onSelect: (coords) => cropAndRecognize(coords, imageURL, type),
    }).then((jcropApi) => {
      jcropRef.current = jcropApi;
    });
  };

  const cropAndRecognize = async (coords, imageURL, type) => {
    const croppedImage = await cropImage(coords, imageURL);

    Tesseract.recognize(croppedImage, type, {
      logger: (m) => console.log(m),
    }).then(({ data: { text } }) => {
      clipboard.writeText(text);
      toast('Text copied');
    });
  };

  const cropImage = (coords, imageURL) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = imageURL;

      img.onload = () => {
        canvas.width = coords.w;
        canvas.height = coords.h;
        ctx.drawImage(img, coords.x, coords.y, coords.w, coords.h, 0, 0, coords.w, coords.h);

        canvas.toBlob((blob) => {
          resolve(URL.createObjectURL(blob));
        });
      };
    });
  };

  return (
    <div>
      <img ref={imgRef} style={{ display: 'none' }} />
    </div>
  );
};

export default MaskComponent;