import { useState } from "react";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    setDeviation
} from "../features/deviationSlice";

import {
    analyzeDeviation,
    chatUpdateDeviation
} from "../services/api";


function AIAssistant() {

    const dispatch = useDispatch();

    const deviation = useSelector(
        (state) => state.deviation
    );

    const [text, setText] = useState("");

    const [file, setFile] = useState(null);

    const [message, setMessage] = useState("");

    const [chatMessage, setChatMessage] = useState("");

    const [chatHistory, setChatHistory] = useState([]);

    const [loading, setLoading] = useState(false);

    const [chatLoading, setChatLoading] = useState(false);


    const handleAnalyze = async () => {

        if (!text.trim() && !file) {

            setMessage(
                "Please upload a PDF or paste deviation details."
            );

            return;
        }

        try {

            setLoading(true);

            setMessage(
                "AI is analyzing..."
            );

            const response =
                await analyzeDeviation({
                    text,
                    file
                });

            dispatch(
                setDeviation(
                    response.result.result
                )
            );

            setMessage(
                "✓ Deviation parsed successfully."
            );

            setChatHistory((prev) => [
                ...prev,
                {
                    type: "ai",
                    message:
                        "Deviation parsed successfully. I've populated the form with the extracted information."
                }
            ]);

        } catch (error) {

            console.error(error);

            setMessage(
                "AI analysis failed."
            );

        } finally {

            setLoading(false);
        }
    };


    // -------------------------
    // Chat Update
    // -------------------------

    const handleChat = async () => {

        if (!chatMessage.trim()) {
            return;
        }

        const userMessage = chatMessage;

        setChatMessage("");

        setChatHistory((prev) => [
            ...prev,
            {
                type: "user",
                message: userMessage
            }
        ]);

        try {

            setChatLoading(true);

            const response =
                await chatUpdateDeviation(
                    userMessage,
                    deviation
                );

            dispatch(
                setDeviation(
                    response.updated_form
                )
            );

            setChatHistory((prev) => [
                ...prev,
                {
                    type: "ai",
                    message: response.message
                }
            ]);

        } catch (error) {

            console.error(error);

            setChatHistory((prev) => [
                ...prev,
                {
                    type: "ai",
                    message:
                        "Sorry, I couldn't update the form."
                }
            ]);

        } finally {

            setChatLoading(false);
        }
    };


    const handleKeyDown = (e) => {

        if (e.key === "Enter" && !e.shiftKey) {

            e.preventDefault();

            handleChat();
        }
    };


    return (

        <div className="ai-panel">

            <div className="ai-header">

                <div>

                    <h2>
                        ✨ AIVOA Copilot
                    </h2>

                    <p>
                        AI Deviation Assistant
                    </p>

                </div>

                <span className="online-dot">
                    ●
                </span>

            </div>


            {/* Upload Area */}

            <div className="upload-box">

                <div className="upload-icon">
                    📄
                </div>

                <strong>
                    Upload deviation document
                </strong>

                <p>
                    PDF files supported
                </p>

                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                        setFile(
                            e.target.files[0]
                        )
                    }
                />

            </div>


            <div className="or">
                OR
            </div>


            <textarea
                className="source-text"
                placeholder="Paste deviation details / email..."
                value={text}
                onChange={(e) =>
                    setText(e.target.value)
                }
            />


            <button
                className="analyze-button"
                onClick={handleAnalyze}
                disabled={loading}
            >

                {loading
                    ? "Analyzing..."
                    : "✨ Analyze with AI"}

            </button>


            {message && (
                <div className="status-message">
                    {message}
                </div>
            )}


            {/* Chat */}

            <div className="chat-section">

                <div className="chat-title">

                    <span>
                        AI Copilot
                    </span>

                    <small>
                        Edit the form using chat
                    </small>

                </div>


                <div className="chat-messages">

                    {chatHistory.map(
                        (item, index) => (

                            <div
                                key={index}
                                className={
                                    item.type === "user"
                                        ? "chat-row user-row"
                                        : "chat-row ai-row"
                                }
                            >

                                {item.type === "ai" && (
                                    <div className="ai-avatar">
                                        ✓
                                    </div>
                                )}

                                <div
                                    className={
                                        item.type === "user"
                                            ? "chat-bubble user-bubble"
                                            : "chat-bubble ai-bubble"
                                    }
                                >
                                    {item.message}
                                </div>

                            </div>

                        )
                    )}

                    {chatLoading && (

                        <div className="chat-row ai-row">

                            <div className="ai-avatar">
                                ✓
                            </div>

                            <div className="chat-bubble ai-bubble">
                                Updating the form...
                            </div>

                        </div>

                    )}

                </div>


                <div className="chat-input-container">

                    <textarea
                        value={chatMessage}
                        onChange={(e) =>
                            setChatMessage(
                                e.target.value
                            )
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message or ask me to update the form..."
                    />

                    <button
                        onClick={handleChat}
                        disabled={chatLoading}
                    >
                        ➤
                    </button>

                </div>


                <div className="powered">
                    POWERED BY LANGGRAPH
                </div>

            </div>

        </div>
    );
}

export default AIAssistant;