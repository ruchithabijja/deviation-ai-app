import { createSlice } from "@reduxjs/toolkit";

const normalizeDate = (val) => {
    if (!val) return "";
    const str = String(val).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

    // Handle DD/MM/YYYY or DD-MM-YYYY
    const ddmmyyyy = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (ddmmyyyy) {
        const [, d, m, y] = ddmmyyyy;
        return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }

    const parsed = new Date(str);
    if (isNaN(parsed.getTime())) return str;
    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, "0");
    const dd = String(parsed.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const initialState = {
    site: "",
    date_of_occurrence: "",
    title: "",
    source: "",
    related_product: "",
    batch_lot_number: "",
    detailed_description: "",
    initial_impact: "",
    initial_severity: "",
    severity_reason: ""
};

const deviationSlice = createSlice({
    name: "deviation",
    initialState: initialState,
    reducers: {
        setDeviation: (state, action) => {
            const payload = { ...action.payload };
            if (payload.date_of_occurrence) {
                payload.date_of_occurrence = normalizeDate(payload.date_of_occurrence);
            }
            return {
                ...state,
                ...payload
            };
        },
        updateField: (state, action) => {
            const { field, value } = action.payload;
            if (field === "date_of_occurrence") {
                state[field] = normalizeDate(value);
            } else {
                state[field] = value;
            }
        },
        clearDeviation: () => {
            return initialState;
        }
    }
});

export const {
    setDeviation,
    updateField,
    clearDeviation
} = deviationSlice.actions;

export default deviationSlice.reducer;