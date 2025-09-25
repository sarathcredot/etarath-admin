import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FormCheck } from "react-bootstrap";
import LightBox from "react-image-lightbox";
import "react-image-lightbox/style.css";

import PtLazyLoad from "./lazyload";

import { getCroppedImageUrl } from "../../utils";
import Dashboard from "../pages/Dashboard/dashboard";
import { generateFilePath } from "src/services/url.service";

export default function MediaThumb(props) {
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
    <div className={`thumbnail ${selected ? "thumbnail-selected" : ""}`}>
      <div className="thumb-preview">
        <div className="centered">
          <Link
            to={`/media/`}
            className="thumb-image"
          >
            <PtLazyLoad
              className="img-fluid"
              // src={ `/mock-server/images/${ getCroppedImageUrl( media.copy_link, 150 ) }` }
              // src={"/assets/images/banner/player.png"}
              src={
                media?.url
                  ? generateFilePath(media?.url)
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
          <div
            className="mg-zoom"
            onClick={openLightBox}
          >
            <i className="fa fa-search"></i>
          </div>
          <div className="mg-toolbar">
            <FormCheck
              className="mg-option checkbox-inline"
              id={`media-${media.id}`}
              custom
              label=""
              checked={selected}
              onChange={(e) => onValueChange(e.target.checked)}
            />

            {/* <div className="mg-group float-right">
                            <Link to={ `/media/${ media.id }` }><i className="fas fa-pencil-alt"></i></Link>
                        </div> */}
          </div>
        </div>
      </div>

      {openLB && (
        <LightBox
          // mainSrc={`/assets/images/banner/player.png`}
          mainSrc={
            media?.url
              ? generateFilePath(media?.url)
              : "/assets/images/banner/player.png"
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
