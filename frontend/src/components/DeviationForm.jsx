import { useDispatch, useSelector } from "react-redux";

import {
    updateField
} from "../features/deviationSlice";

import {
    saveDeviation
} from "../services/api";


function DeviationForm() {

    const dispatch = useDispatch();

    const deviation = useSelector(
        (state) => state.deviation
    );

    console.log("deviation", deviation)
    const handleChange = (field, value) => {

        dispatch(
            updateField({
                field,
                value
            })
        );
    };


    const handleSave = async () => {

        try {

            const response = await saveDeviation(
                deviation
            );

            console.log(
                "Saved deviation:",
                response
            );

            alert(
                "Deviation saved successfully!"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Failed to save deviation."
            );
        }
    };


    return (
        <div className="form-panel">

            <h2>Log Deviation</h2>


            <div className="grid">

                <div>
                    <label>Site / Plant</label>

                    <input
                        value={deviation.site || ""}
                        onChange={(e) =>
                            handleChange(
                                "site",
                                e.target.value
                            )
                        }
                    />
                </div>


                <div>
                    <label>Date of Occurrence</label>

                    <input
                        type="date"
                        value={
                            deviation.date_of_occurrence || ""
                        }
                        onChange={(e) =>
                            handleChange(
                                "date_of_occurrence",
                                e.target.value
                            )
                        }
                    />
                </div>

            </div>


            <label>
                Title / Short Description
            </label>

            <input
                value={deviation.title || ""}
                onChange={(e) =>
                    handleChange(
                        "title",
                        e.target.value
                    )
                }
            />


            <div className="grid">

                <div>

                    <label>Source</label>

                    <input
                        value={deviation.source || ""}
                        onChange={(e) =>
                            handleChange(
                                "source",
                                e.target.value
                            )
                        }
                    />

                </div>


                <div>

                    <label>Batch / Lot Number</label>

                    <input
                        value={
                            deviation.batch_lot_number || ""
                        }
                        onChange={(e) =>
                            handleChange(
                                "batch_lot_number",
                                e.target.value
                            )
                        }
                    />

                </div>

            </div>


            <label>
                Related Product / Material
            </label>

            <input
                value={
                    deviation.related_product || ""
                }
                onChange={(e) =>
                    handleChange(
                        "related_product",
                        e.target.value
                    )
                }
            />


            <label>
                Detailed Description
            </label>

            <textarea
                value={
                    deviation.detailed_description || ""
                }
                onChange={(e) =>
                    handleChange(
                        "detailed_description",
                        e.target.value
                    )
                }
            />


            <div className="grid">

                <div>

                    <label>
                        Initial Impact
                    </label>

                    <textarea
                        value={
                            deviation.initial_impact || ""
                        }
                        onChange={(e) =>
                            handleChange(
                                "initial_impact",
                                e.target.value
                            )
                        }
                    />

                </div>


                <div>

                    <label>
                        Initial Severity
                    </label>

                    <select
                        value={
                            deviation.initial_severity || ""
                        }
                        onChange={(e) =>
                            handleChange(
                                "initial_severity",
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Select severity
                        </option>

                        <option value="Low">
                            Low
                        </option>

                        <option value="Minor">
                            Minor
                        </option>

                        <option value="Major">
                            Major
                        </option>

                        <option value="Critical">
                            Critical
                        </option>

                    </select>

                </div>

            </div>


            <label>
                Severity Reason
            </label>

            <textarea
                value={
                    deviation.severity_reason || ""
                }
                onChange={(e) =>
                    handleChange(
                        "severity_reason",
                        e.target.value
                    )
                }
            />


            <button
                className="save-button"
                onClick={handleSave}
            >
                Save Deviation
            </button>

        </div>
    );
}


export default DeviationForm;