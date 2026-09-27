import { useState } from "react";

import { useDispatch } from "react-redux";

import { setDeviation } from "../features/deviationSlice";

import { analyzeDeviation } from "../services/api";


function AIAssistant() {

    const dispatch = useDispatch();

    const [text, setText] = useState("");

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");


    const handleAnalyze = async () => {

        if (!text.trim() && !file) {
            setMessage("Please upload a PDF or enter text.");
            return;
        }

        try {

            setLoading(true);
            setMessage("AI is analyzing...");

            const response = await analyzeDeviation({
                text,
                file
            });

            dispatch(
                setDeviation(response.result.result)
            );

            setMessage(
                "✓ Deviation information extracted successfully"
            );

        } catch (error) {

            console.error(error);

            setMessage(
                "AI analysis failed. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="ai-panel">

            <h2>✨ AI Deviation Assistant</h2>

            <p>
                Upload a deviation document or paste
                deviation information.
            </p>


            <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                    setFile(e.target.files[0])
                }
            />


            <div className="or">
                OR
            </div>


            <textarea
                placeholder="Paste deviation details / email..."
                value={text}
                onChange={(e) =>
                    setText(e.target.value)
                }
            />


            <button
                onClick={handleAnalyze}
                disabled={loading}
            >
                {loading
                    ? "Analyzing..."
                    : "Analyze with AI"}
            </button>


            {message && (
                <p className="message">
                    {message}
                </p>
            )}

        </div>
    );
}

export default AIAssistant;