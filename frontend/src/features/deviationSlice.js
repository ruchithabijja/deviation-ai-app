import { createSlice } from "@reduxjs/toolkit";

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
            return {
                ...state,
                ...action.payload
            };
        },
        updateField: (state, action) => {
            const { field, value } = action.payload;

            state[field] = value;
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