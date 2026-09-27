import AIAssistant from "./components/AIAssistant";
import DeviationForm from "./components/DeviationForm";


function App() {

    return (

        <div>

            <header>

                <h1>
                    AIVOA.AI
                </h1>

                <p>
                    AI-Powered Deviation Management
                </p>

            </header>


            <main>

                <DeviationForm />

                <AIAssistant />

            </main>

        </div>
    );
}


export default App;