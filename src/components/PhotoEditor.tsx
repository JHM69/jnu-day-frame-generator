import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';
import { Upload, Crop, Frame, Download, Share } from 'lucide-react';

interface PhotoEditorProps {
  selectedFrame: string;
  setSelectedFrame: React.Dispatch<React.SetStateAction<string>>;
}

interface CroppedAreaPixels {
  width: number;
  height: number;
  x: number;
  y: number;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({
  selectedFrame,
  setSelectedFrame,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [framedImage, setFramedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: CroppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: CroppedAreaPixels
  ): Promise<string | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          resolve(null);
          return;
        }
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg');
    });
  };

  const handleCrop = async () => {
    if (image && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      if (croppedImage) {
        setCroppedImage(croppedImage);
        setFramedImage(croppedImage);
      }
    }
  };

  const applyFrame = async (frameUrl: string) => {
    if (croppedImage) {
      try {
        const frame = await createImage(frameUrl);
        const image = await createImage(croppedImage);

        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Unable to get canvas context');
        }

        ctx.drawImage(image, 0, 0);
        ctx.drawImage(frame, 0, 0, image.width, image.height);

        const framedImageUrl = canvas.toDataURL('image/png');
        setFramedImage(framedImageUrl);
        setSelectedFrame(frameUrl);
      } catch (error) {
        console.error('Error applying frame:', error);
      }
    }
  };

  const downloadImage = () => {
    if (framedImage) {
      const link = document.createElement('a');
      link.href = framedImage;
      link.download = 'framed_photo.png';
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Create Your Framed Photo
      </h1>
      {!image && (
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-4" size={48} />
          <p>Drag & drop an image here, or click to select one</p>
        </div>
      )}
      {image && !croppedImage && (
        <div className="w-full">
          <div className="relative h-96 mb-4">
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
          <button
            onClick={handleCrop}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <Crop className="mr-2" size={20} />
            Crop Image
          </button>
        </div>
      )}
      {croppedImage && (
        <div className="w-full">
          <img
            src={framedImage || croppedImage}
            alt="Cropped"
            className="w-full mb-4 rounded-lg"
          />
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => applyFrame('/frame0.png')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center ${
                selectedFrame === '/frame0.png'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <Frame className="mr-2" size={20} />
              Sajid Frame
            </button>
            <button
              onClick={() => applyFrame('/frame1.png')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center ${
                selectedFrame === '/frame1.png'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <Frame className="mr-2" size={20} />
              Classic Frame
            </button>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={downloadImage}
              className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center"
            >
              <Download className="mr-2" size={20} />
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoEditor;
