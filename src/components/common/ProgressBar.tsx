


import React from "react";

type Props = {
    progress: number; // already in %
    width?: number | string;
    height?: number | string;
};

const getColorByProgress = (progress: number): string => {
    if (progress >= 80) return "#2ecc71"; // 🟢 green
    if (progress >= 50) return "#f39c12"; // 🟠 orange
    return "#e74c3c"; // 🔴 red
};

const ProgressBar: React.FC<Props> = ({
    progress,
    width = 300,
    height = 28,
}) => {
    const safeProgress = Math.min(Math.max(progress, 0), 100);
    const barColor = getColorByProgress(safeProgress);

    return (
        <div style={{ ...styles.container, width, height }}>
            <div
                style={{
                    ...styles.fill,
                    width: `${safeProgress}%`,
                    backgroundColor: barColor,
                }}
            />
            <span style={styles.textOverlay}>{safeProgress}%</span>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        position: "relative",
        border: "2px solid #000",
        borderRadius: 20,
        backgroundColor: "#fff",
        overflow: "hidden",
    },
    fill: {
        height: "100%",
        borderRadius: "18px 0 0 18px",
        transition: "width 0.6s ease-in-out, background-color 0.3s ease",
    },
    textOverlay: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontWeight: 700,
        color: "#000",
        pointerEvents: "none",
        fontSize: 14,
    },
};

export default ProgressBar;
