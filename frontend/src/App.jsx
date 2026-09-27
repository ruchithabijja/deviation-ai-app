import AIAssistant from "./components/AIAssistant";
import DeviationForm from "./components/DeviationForm";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <main className="main-layout">
        <DeviationForm />
        <AIAssistant />
      </main>
    </div>
  );
}

export default App;