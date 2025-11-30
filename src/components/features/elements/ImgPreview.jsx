import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ImgPreview = ({ file,objectFit="fill" }) => {
  return (
    <>
      <div
        className=" w-100 h-100 "
      >
        <div className="dz-image h-100 w-100" >
          <LazyLoadImage
            src={file?.copy_link ? file?.copy_link : file ? file: ""}
            alt="previw"
            width={"100%"}
            height={"100%"}
            style={{ minHeight: "100%", minWidth: "100%", objectFit: objectFit }}
            // crossOrigin="anonymous"
          />
        </div>
      </div>
    </>
  );
};

export default ImgPreview;
