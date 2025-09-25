import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FormCheck } from "react-bootstrap";
import LightBox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { generateFilePath } from "src/services/url.service";
import PtLazyLoad from "./lazyload";

export default function TemplateThumb(props) {
  const { media, selected = false, onChange } = props;
  const [openLB, setOpenLB] = useState(false);

  function onValueChange(value) {
    onChange && onChange(value);
  }

  function openLightBox() {
    setOpenLB(true);
  }

  function closeLightBox() {
    setOpenLB(false);
  }

  return (
    // <React.Fragment >
    //     <div dangerouslySetInnerHTML={{__html}}></div>

    // </React.Fragment>
    <div
      className={`thumbnail overflow-hidden ${
        selected ? "thumbnail-selected" : ""
      }`}
    >
      <div className="thumb-preview overflow-hidden">
        <div className="centered ">
          <Link to={`/media/`} className="thumb-image">
            {/* <iframe
              src={
                media?.templateFileUrl
                  ? generateFilePath(media?.templateFileUrl)
                  : "/assets/template.html"
              }
              frameBorder="0"
              className="w-100 h-100 overflow-hidden"
            ></iframe> */}
            <PtLazyLoad
              className="img-fluid"
              // src={ `/mock-server/images/${ getCroppedImageUrl( media.copy_link, 150 ) }` }
              // src={"/assets/images/banner/player.png"}
              src={
                media?.thumbnail
                  ? generateFilePath(media?.thumbnail)
                  : "/assets/images/banner/player.png"
              }
              alt="media"
              width={150}
              height={150}
              label=""
            />
          </Link>
        </div>

        <div className="mg-thumb-options">
          <div className="mg-zoom" onClick={openLightBox}>
            <i className="fa fa-search"></i>
          </div>
          <div className="mg-toolbar">
            <FormCheck
              className="mg-option checkbox-inline"
              id={`media-${media?.id}`}
              custom
              label=""
              checked={selected}
              onChange={(e) => onValueChange(e.target.checked)}
            />
          </div>
        </div>
      </div>

      {openLB && (
        <LightBox
          mainSrc={
            media?.thumbnail
              ? generateFilePath(media?.thumbnail)
              : "/assets/template.html"
          }
          reactModalStyle={{
            overlay: {
              zIndex: "9999",
            },
          }}
          onCloseRequest={closeLightBox}
          imageCrossOrigin="anonymous"
        />
      )}
    </div>
  );
}
