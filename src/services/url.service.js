export const url = process.env.REACT_APP_BACKEND_URL;
export const media_url = process.env.REACT_APP_BACKEND_MEDIA_URL;
export const frontendUrl = process.env.REACT_APP_FRONTEND_URL
  ? process.env.REACT_APP_FRONTEND_URL
  : "http://localhost:3000/";


  export const generateFilePath = (fileName) => {
    if (typeof fileName == "undefined" || fileName == null) {
      // return logo
    }
  
    if (typeof fileName != "string") {
      return fileName;
    }
  
    if (fileName.startsWith("http")) {
      return fileName;
    }
  
    return `${media_url}${fileName}`;
  };