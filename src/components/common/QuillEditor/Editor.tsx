"use client";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// import "../app/globals.css"; // Add this CSS file for custom styles.
import { useEffect, useState } from "react";

const modules = {
  toolbar: [
    // First Row: Basic text styling
    [{ color: [] }, "bold", "italic", "underline"], // Text color and background color
    ["link", "blockquote", "code-block", "image"], // Blockquote and Code block

    // Second Row: Links, Images, and Videos
    // [ , "video"], // Link, Image, and Video

    // Third Row: Lists and Indents
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ], // Ordered and Bullet Lists
    // [], // Indent and Outdent

    // Fourth Row: Text Alignment
    [
      { align: "" },
      { align: "center" },
      { align: "right" },
      { align: "justify" },
    ],

    // Fifth Row: Clear formatting
    // ["clean"], // Clear formatting
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "color",
  "background",
  "align",
  "code-block",
];

const Editor = ({
  placeholder,
  className,
  value,
  setValue,
  handleChange,
  error,
  ref,
}: any) => {
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    setIsEmpty(value.trim() === "");
  }, [value]);

  return (
      <ReactQuill
        className={`custom-editor ${className} ${isEmpty ? "empty" : ""}`}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        theme="snow"
        value={value}
        onChange={(content) => {
          handleChange && handleChange({ target: { value: content } });
          setValue(content);
          setIsEmpty(content.trim() === "");
        }}
      />
  );
};

export default Editor;
