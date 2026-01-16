


import { Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";

export default function LocationInput({ value, onChange, onBlur, isInvalid , placeholder }) {
    const autoRef = useRef(null);

    const onLoad = (auto) => {
        autoRef.current = auto;
    };

    const onPlaceChanged = () => {
        if (!autoRef.current) return;
        const place = autoRef.current.getPlace();
        if (!place) return;

        const address = place.formatted_address || place.name || "";
        onChange(address);
    };

    return (
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
                type="text"
                className={`form-control ${isInvalid ? "is-invalid" : ""}`}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
            />
        </Autocomplete>
    );
}
