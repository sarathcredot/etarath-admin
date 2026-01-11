


import React, { useMemo, useRef, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function ZipImageUploadModal({
    show,
    onClose,
    onUpload, // async (zipFile) => Promise<void>
    title = "Upload Images ZIP",
    maxSizeMB = 50,
}) {
    const inputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const fileInfo = useMemo(() => {
        if (!file) return "";
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        return `${file.name} (${sizeMB} MB)`;
    }, [file]);

    const validateAndSetFile = (f) => {
        if (!f) return;

        const name = f.name?.toLowerCase?.() || "";
        const isZip =
            name.endsWith(".zip") ||
            f.type === "application/zip" ||
            f.type === "application/x-zip-compressed" ||
            f.type === "multipart/x-zip"; // some environments

        if (!isZip) {
            toast("Please upload a ZIP file (.zip) containing images", {
                containerId: "default",
                className: "no-icon notification-danger",
            });
            return;
        }

        const maxBytes = maxSizeMB * 1024 * 1024;
        if (f.size > maxBytes) {
            toast(`File too large. Max ${maxSizeMB} MB allowed.`, {
                containerId: "default",
                className: "no-icon notification-danger",
            });
            return;
        }

        setFile(f);
    };

    const reset = () => {
        setFile(null);
        setDragOver(false);
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleClose = () => {
        reset();
        onClose?.();
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);

        const dropped = e.dataTransfer.files?.[0];
        validateAndSetFile(dropped);
    };

    const onDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
    };

    const onDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
    };

    const onPickFile = (e) => {
        const selected = e.target.files?.[0];
        validateAndSetFile(selected);
    };

    const handleUpload = async () => {
        if (!file) {
            toast("Please drop or select a ZIP file first.", {
                containerId: "default",
                className: "no-icon notification-danger",
            });
            return;
        }

        try {
            setUploading(true);
            toast.loading("Uploading zip file...", {
                containerId: "default",
                className: "no-icon notification-warning",
            });
            await onUpload(file);
 
            toast.dismiss()

            toast("ZIP uploaded successfully", {
                containerId: "default",
                className: "no-icon notification-success",
            });
            handleClose();
        } catch (err) {
            toast("Can't upload ZIP. Please try again.", {
                containerId: "default",
                className: "no-icon notification-danger",
            });
        } finally {
            setUploading(false);
             toast.dismiss()
        }
    };

    return (
        <Modal show={show} centered>
            <Modal.Header>
                <Modal.Title style={{ fontSize: "20px" }}>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div
                    onClick={() => inputRef.current?.click()}
                    onDrop={onDrop}
                    onDragEnter={onDragEnter}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    style={{
                        border: `2px dashed ${dragOver ? "#2563eb" : "#cbd5e1"}`,
                        background: dragOver ? "#eff6ff" : "#f8fafc",
                        borderRadius: 12,
                        padding: 22,
                        textAlign: "center",
                        cursor: "pointer",
                        userSelect: "none",
                        transition: "all 0.15s ease",
                    }}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".zip,application/zip,application/x-zip-compressed"
                        onChange={onPickFile}
                        style={{ display: "none" }}
                        disabled={uploading}
                    />

                    {!file ? (
                        <>
                            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                                Drag & drop your ZIP here
                            </div>
                            <div style={{ fontSize: 13, color: "#64748b" }}>
                                or click to browse (max {maxSizeMB}MB)
                            </div>
                            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 10 }}>
                                Upload a <b>.zip</b> file containing images
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>📦 {fileInfo}</div>

                            <div
                                style={{
                                    marginTop: 10,
                                    display: "flex",
                                    gap: 10,
                                    justifyContent: "center",
                                }}
                            >
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        reset();
                                    }}
                                    disabled={uploading}
                                >
                                    Remove
                                </Button>

                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        inputRef.current?.click();
                                    }}
                                    disabled={uploading}
                                >
                                    Replace
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={uploading}>
                    Cancel
                </Button>

                <button
                    className="btn-black"
                    style={{ height: "38px" }}
                    onClick={handleUpload}
                    disabled={uploading || !file}
                >
                    {uploading ? (
                        <>
                            <Spinner animation="border" size="sm" className="mr-2" />
                            Uploading...
                        </>
                    ) : (
                        "Upload ZIP"
                    )}
                </button>
            </Modal.Footer>
        </Modal>
    );
}
