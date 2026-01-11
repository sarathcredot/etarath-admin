import React, { useMemo, useRef, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function CsvImportDropModal({
    show,
    onClose,
    onImport, // async (file) => Promise<void>
    title = "Import CSV",
    maxSizeMB = 10,
}) {
    const inputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);
    const [file, setFile] = useState(null);
    const [importing, setImporting] = useState(false);

    const fileInfo = useMemo(() => {
        if (!file) return "";
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        return `${file.name} (${sizeMB} MB)`;
    }, [file]);

    const validateAndSetFile = (f) => {
        if (!f) return;

        const isCsv =
            f.type === "text/csv" ||
            f.name.toLowerCase().endsWith(".csv") ||
            f.type === "application/vnd.ms-excel"; // some browsers use this for csv

        if (!isCsv) {
            toast("Please upload a CSV file (.csv)", {
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
        setImporting(false);
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

    const handleImport = async () => {
        if (!file) {
            toast("Please drop or select a CSV file first.", {
                containerId: "default",
                className: "no-icon notification-danger",
            });
            return;
        }

        try {
            toast.loading("Uploading CSV file...", {
                containerId: "default",
                className: "no-icon notification-warning",
            });
            setImporting(true);
            await onImport(file);
            toast.dismiss()
            toast("CSV imported successfully", {
                containerId: "default",
                className: "no-icon notification-success",
            });
            handleClose();
        } catch (err) {
            toast("Can't import CSV. Please check the file and try again.", {
                containerId: "default",
                className: "no-icon notification-danger",
            });
        } finally {
            setImporting(false);
             toast.dismiss()
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header >
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
                        border: `2px dashed ${dragOver ? "#16a34a" : "#cbd5e1"}`,
                        background: dragOver ? "#f0fdf4" : "#f8fafc",
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
                        accept=".csv,text/csv"
                        onChange={onPickFile}
                        style={{ display: "none" }}
                        disabled={importing}
                    />

                    {!file ? (
                        <>
                            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>
                                Drag & drop your CSV here
                            </div>
                            <div style={{ fontSize: 13, color: "#64748b" }}>
                                or click to browse (max {maxSizeMB}MB)
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>
                                ✅ {fileInfo}
                            </div>
                            <div style={{ marginTop: 10, display: "flex", gap: 10, justifyContent: "center" }}>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        reset();
                                    }}
                                    disabled={importing}
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
                                    disabled={importing}
                                >
                                    Replace
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={importing}>
                    Cancel
                </Button>

                <Button
                    variant="success"
                    onClick={handleImport}
                    disabled={importing || !file}
                >
                    {importing ? (
                        <>
                            <Spinner animation="border" size="sm" className="mr-2" />
                            Importing...
                        </>
                    ) : (
                        "Import CSV"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
