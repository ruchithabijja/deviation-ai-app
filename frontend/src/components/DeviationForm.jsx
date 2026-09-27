import { useDispatch, useSelector } from "react-redux";
import { updateField } from "../features/deviationSlice";
import { saveDeviation } from "../services/api";
import { ChevronDown, Save } from "lucide-react";

const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  const str = String(dateStr).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;

  const ddmmyyyy = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (ddmmyyyy) {
    const [, d, m, y] = ddmmyyyy;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  const parsed = new Date(str);
  if (isNaN(parsed.getTime())) return "";
  const yyyy = parsed.getFullYear();
  const mm = String(parsed.getMonth() + 1).padStart(2, "0");
  const dd = String(parsed.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getSeverityColor = (sev, impact) => {
  const s = (sev || "").toLowerCase();
  const imp = (impact || "").toLowerCase();

  if (s.includes("critical") || s.includes("high")) return "red";
  if (s.includes("major") || s.includes("medium") || s.includes("minor")) return "yellow";
  if (s.includes("low")) return "green";

  if (imp.includes("critical") || imp.includes("high risk") || imp.includes("recall") || imp.includes("patient risk")) return "red";
  if (imp.includes("major") || imp.includes("moderate") || imp.includes("potential")) return "yellow";
  if (imp.includes("no impact") || imp.includes("low") || imp.includes("negligible") || imp.includes("minimal")) return "green";

  return "neutral";
};

function DeviationForm() {
  const dispatch = useDispatch();

  const deviation = useSelector((state) => state.deviation);
  const colorState = getSeverityColor(deviation.initial_severity, deviation.initial_impact);

  console.log("deviation", deviation);

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
      const response = await saveDeviation(deviation);
      console.log("Saved deviation:", response);
      alert("Deviation saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save deviation.");
    }
  };

  return (
    <div className="form-panel">
      {/* Header matching Screenshot */}
      <div className="form-header-row">
        <div className="form-header-info">
          <h1 className="form-main-title">Log Customer Complaint</h1>
        </div>
        <div className="form-header-badge-wrapper">
          <span className="badge-pending-triage">Draft</span>
        </div>
      </div>

      {/* 1. PRODUCT & BATCH IDENTIFICATION */}
      <section className="form-section">
        <h3 className="section-title">1. PRODUCT & BATCH IDENTIFICATION</h3>
        <div className="two-col-grid">
          <div className="form-group">
            <label className="field-label">Product Name (API/FDF)</label>
            <input
              className="modern-input"
              placeholder="Awaiting AI extraction..."
              value={deviation.related_product || ""}
              onChange={(e) => handleChange("related_product", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="field-label">Batch / Lot Number</label>
            <input
              className="modern-input"
              placeholder="Awaiting AI extraction..."
              value={deviation.batch_lot_number || ""}
              onChange={(e) => handleChange("batch_lot_number", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 2. FACILITY & MATERIAL IMPACT */}
      <section className="form-section">
        <h3 className="section-title">2. FACILITY & MATERIAL IMPACT</h3>
        <div className="two-col-grid">
          <div className="form-group">
            <label className="field-label">Originating Site Block</label>
            <input
              className="modern-input"
              placeholder="Awaiting AI classification..."
              value={deviation.site || ""}
              onChange={(e) => handleChange("site", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="field-label">Impacted Non-Product Materials (NPM)</label>
            <input
              className="modern-input"
              placeholder="e.g., Primary packaging..."
              value={deviation.source || ""}
              onChange={(e) => handleChange("source", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 3. DEFECT ANALYSIS */}
      <section className="form-section">
        <h3 className="section-title">3. DEFECT ANALYSIS</h3>
        <div className="form-group">
          <label className="field-label">Structured Defect Summary</label>
          <textarea
            className="modern-textarea defect-textarea"
            placeholder="AI will synthesize the complaint into a formal QMS description..."
            value={deviation.detailed_description || ""}
            onChange={(e) => handleChange("detailed_description", e.target.value)}
          />
        </div>
      </section>

      {/* 4. INCIDENT CLASSIFICATION & SEVERITY ASSESSMENT */}
      <section className="form-section">
        <h3 className="section-title">4. INCIDENT CLASSIFICATION & SEVERITY ASSESSMENT</h3>

        <div className="two-col-grid" style={{ marginBottom: "16px" }}>
          <div className="form-group">
            <label className="field-label">Title / Short Description</label>
            <input
              className="modern-input"
              placeholder="Title or summary..."
              value={deviation.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="field-label">Date of Occurrence</label>
            <input
              type="date"
              className="modern-input"
              value={formatDateForInput(deviation.date_of_occurrence)}
              onChange={(e) => handleChange("date_of_occurrence", e.target.value)}
            />
          </div>
        </div>

        <div className="two-col-grid" style={{ marginBottom: "16px" }}>
          {/* Initial Impact */}
          <div className="form-group">
            <div className="field-label-row">
              <label className="field-label">Initial Impact</label>
              {colorState !== "neutral" && (
                <span className={`impact-badge impact-${colorState}`}>
                  {colorState === "red" && "High Impact"}
                  {colorState === "yellow" && "Moderate Impact"}
                  {colorState === "green" && "Low Impact"}
                </span>
              )}
            </div>
            <textarea
              className={`modern-textarea impact-textarea impact-border-${colorState}`}
              placeholder="Initial impact..."
              value={deviation.initial_impact || ""}
              onChange={(e) => handleChange("initial_impact", e.target.value)}
            />
          </div>

          {/* Initial Severity */}
          <div className="form-group">
            <div className="field-label-row">
              <label className="field-label">Initial Severity</label>
              {deviation.initial_severity && (
                <span className={`severity-active-badge severity-badge-${colorState}`}>
                  {deviation.initial_severity}
                </span>
              )}
            </div>

            {/* Severity Pill Selector Buttons */}
            <div className="severity-pill-group">
              <button
                type="button"
                className={`severity-btn sev-green ${
                  (deviation.initial_severity || "").toLowerCase() === "low" ? "selected" : ""
                }`}
                onClick={() => handleChange("initial_severity", "Low")}
              >
                <span className="sev-dot sev-dot-green"></span>
                Low
              </button>

              <button
                type="button"
                className={`severity-btn sev-yellow ${
                  (deviation.initial_severity || "").toLowerCase() === "minor" ? "selected" : ""
                }`}
                onClick={() => handleChange("initial_severity", "Minor")}
              >
                <span className="sev-dot sev-dot-yellow"></span>
                Minor
              </button>

              <button
                type="button"
                className={`severity-btn sev-yellow ${
                  (deviation.initial_severity || "").toLowerCase() === "major" ? "selected" : ""
                }`}
                onClick={() => handleChange("initial_severity", "Major")}
              >
                <span className="sev-dot sev-dot-yellow"></span>
                Major
              </button>

              <button
                type="button"
                className={`severity-btn sev-red ${
                  (deviation.initial_severity || "").toLowerCase() === "critical" ? "selected" : ""
                }`}
                onClick={() => handleChange("initial_severity", "Critical")}
              >
                <span className="sev-dot sev-dot-red"></span>
                Critical
              </button>
            </div>

            <div className="select-wrapper">
              <select
                className={`modern-select select-border-${colorState}`}
                value={deviation.initial_severity || ""}
                onChange={(e) => handleChange("initial_severity", e.target.value)}
              >
                <option value="">Select severity</option>
                <option value="Low">Low (Low Risk)</option>
                <option value="Minor">Minor (Contained)</option>
                <option value="Major">Major (Substantial)</option>
                <option value="Critical">Critical (High Risk)</option>
              </select>
              <ChevronDown size={16} className="select-chevron" />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="field-label">Severity Reason</label>
          <textarea
            className="modern-textarea"
            placeholder="Severity reason..."
            value={deviation.severity_reason || ""}
            onChange={(e) => handleChange("severity_reason", e.target.value)}
          />
        </div>
      </section>

      {/* Save Button */}
      <button className="save-button" onClick={handleSave}>
        <Save size={16} style={{ marginRight: "8px" }} />
        Save Deviation
      </button>
    </div>
  );
}

export default DeviationForm;