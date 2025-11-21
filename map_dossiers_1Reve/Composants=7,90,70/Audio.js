import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

export default function AudioPlayer() {
  const [widthSize, setWidthSize] = useState("50px");
 const [heigthSize, setheigthSize] = useState("40px");
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 800) {
        setWidthSize("35px");
        setheigthSize("34px")// Mobile
      } else {
        setWidthSize("50px"); 
        setheigthSize("40px")// Desktop
      }
    };

    handleResize(); // appel initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ReactPlayer
      url="https://ia801803.us.archive.org/1/items/kai-engel-maree/KaiEngel-Maree.mp3"
      playing
      controls 
      height={heigthSize}
      width={widthSize}
       
      style={{
        borderRadius: ' 50%',
        overflow: 'hidden',
        borderbottom: '1px solid gold',
        borderLeft:'1px solid gold',
        borderRight:'0px',
        cursor: 'pointer',
      }}
    />
  );
}
