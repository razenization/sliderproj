import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { PictureList } from "./components/PictureList/PictureList";
import { useHttp } from "./hooks/http.hook";
import { SliderContext } from "./context/SliderContext";
import { Slider } from "./components/Slider/Slider";

function App() {
  const [images, setImages] = useState([]);
  const [sliderInit, setSliderInit] = useState(null);
  const { request } = useHttp();

  const loadImages = useCallback(async () => {
    try {
      const data = await request("/api/gallery/loadImages", "GET", null);
      setImages(data.images);
    } catch (e) {}
  }, [request]);

  const addPic = async (uploadImg, uploadImgUrl = null) => {
    if (uploadImg) {
      try {
        const formData = new FormData();
        formData.append("image", uploadImg);
        const response = await request("/api/gallery/uploadImage", "POST", {
          formData,
        });
        loadImages();
        console.log(response);
      } catch (e) {}
    }
    if (uploadImgUrl) {
      try {
        const response = await request("/api/gallery/uploadImageUrl", "POST", {
          uploadImgUrl,
        });
        loadImages();
        console.log(response);
      } catch (e) {}
    }
  };

  const removePic = async (imageSrc) => {
    try {
      const response = await request("/api/gallery/removeImage", "POST", {
        imageSrc,
      });
      loadImages();
      console.log(response);
    } catch (e) {}
  };

  const onSliderInit = async (initImg) => {
    try {
      setSliderInit(initImg);
    } catch (e) {}
  };

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  return (
    <SliderContext.Provider value={{ onSliderInit }}>
      <div className="App container">
        <h1>A slider made with React and NodeJS Express</h1>
        <Slider images={images} initImg={sliderInit} setInit={setSliderInit} />
        <PictureList images={images} onAdd={addPic} onRemove={removePic} />
      </div>
    </SliderContext.Provider>
  );
}

export default App;
