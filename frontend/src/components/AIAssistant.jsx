import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDeviation } from "../features/deviationSlice";
import {
  analyzeDeviation,
  chatUpdateDeviation
} from "../services/api";
import {
  FlaskConical,
  Paperclip,
  Check,
  Zap,
  FileText,
  X,
  Upload,
  Sparkles
} from "lucide-react";

function AIAssistant() {
  const dispatch = useDispatch();

  const deviation = useSelector((state) => state.deviation);

  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const fileInputRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatLoading]);

  // -------------------------
  // Analyze Deviation Logic (Preserved 100%)
  // -------------------------
  const handleAnalyze = async () => {
    if (!text.trim() && !file) {
      setMessage("Please upload a PDF or paste deviation details.");
      return;
    }

    try {
      setLoading(true);
      setMessage("AI is analyzing...");

      const response = await analyzeDeviation({
        text,
        file
      });

      dispatch(setDeviation(response.result.result));

      setMessage("✓ Deviation parsed successfully.");

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
      setMessage("AI analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Chat Update Logic (Preserved 100%)
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

      const response = await chatUpdateDeviation(userMessage, deviation);

      dispatch(setDeviation(response.updated_form));

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
          message: "Sorry, I couldn't update the form."
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

  const isBusy = loading || chatLoading;

  return (
    <div className="ai-panel">
      {/* Header matching Screenshot with Pulse indicator */}
      <div className="ai-header">
        <div className="ai-header-left">
          <div className="ai-icon-circle">
            <FlaskConical size={20} className="ai-flask-icon" />
          </div>
          <div>
            <h2 className="ai-title">AIVOA Copilot</h2>
            <p className="ai-subtitle">Drop complaint files or paste text below.</p>
          </div>
        </div>

        {/* Pulse like thing for chat */}
        <div className="ai-header-right">
          <div
            className={`pulse-container ${isBusy ? "pulse-busy" : ""}`}
            title={isBusy ? "Processing..." : "Copilot Online"}
          >
            <span className="pulse-ring-outer"></span>
            <span className="pulse-ring-inner"></span>
            <span className="pulse-core-dot"></span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ai-body-scroll">
        {/* Upload & Initial Analysis Section */}
        <div className="ai-extract-card">
          <div className="upload-box" onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0] || null)}
            />
            {file ? (
              <div className="file-selected-badge">
                <FileText size={20} className="file-badge-icon" />
                <span className="file-badge-name">{file.name}</span>
                <button
                  type="button"
                  className="file-clear-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <Upload size={24} className="upload-icon-svg" />
                <div className="upload-text-group">
                  <strong>Upload deviation document</strong>
                  <span>PDF files supported (click or drop)</span>
                </div>
              </div>
            )}
          </div>

          <div className="or-divider">
            <span>OR PASTE RAW TEXT</span>
          </div>

          <textarea
            className="source-text"
            placeholder="Paste deviation details / email from customer..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-sm" style={{ marginRight: "8px" }}></span>
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles size={16} style={{ marginRight: "8px" }} />
                Analyze with AI
              </>
            )}
          </button>

          {message && (
            <div
              className={`status-message ${
                message.includes("failed") ? "status-failed" : "status-success"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div className="chat-section">
          <div className="chat-title">
            <span>AI Copilot</span>
            <small>Edit the form using conversational instructions</small>
          </div>

          <div className="chat-messages">
            {/* Initial Welcome message matching screenshot */}
            <div className="chat-row ai-row">
              <div className="ai-avatar">
                <Zap size={14} />
              </div>
              <div className="chat-bubble ai-bubble welcome-bubble">
                Ready to process new complaints. You can paste the raw email from the customer, or upload a PDF of the complaint report. I will extract the data and run the initial risk assessment.
              </div>
            </div>

            {/* Dynamic chat history */}
            {chatHistory.map((item, index) => (
              <div
                key={index}
                className={item.type === "user" ? "chat-row user-row" : "chat-row ai-row"}
              >
                {item.type === "ai" && (
                  <div className="ai-avatar">
                    <Zap size={14} />
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
            ))}

            {/* Thinking / Updating state */}
            {chatLoading && (
              <div className="chat-row ai-row">
                <div className="ai-avatar avatar-pulsing">
                  <Sparkles size={14} />
                </div>
                <div className="chat-bubble ai-bubble thinking-bubble">
                  <span className="thinking-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                  <span style={{ marginLeft: "8px" }}>Updating the form...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>
        </div>
      </div>

      {/* Fixed Chat Input Area matching Screenshot */}
      <div className="chat-input-sticky-footer">
        <div className="chat-input-container">
          <button
            type="button"
            className="chat-attachment-btn"
            title="Attach file"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip size={18} />
          </button>

          <textarea
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message or paste a complaint..."
            rows={1}
          />

          <button
            type="button"
            className="chat-send-btn"
            onClick={handleChat}
            disabled={chatLoading || !chatMessage.trim()}
            title="Send"
          >
            <Check size={18} strokeWidth={2.6} />
          </button>
        </div>

        <div className="powered">POWERED BY LANGGRAPH</div>
      </div>
    </div>
  );
}

export default AIAssistant;