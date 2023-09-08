import './App.css';
import QuizzesList from "./components/QuizzesList/QuizzesList";
import {
    BrowserRouter as Router,
    Route,
    Switch
} from "react-router-dom";
import QuizDetails from "./components/QuizDetails/QuizDetails";
import QuizForm from "./components/QuizForm/QuizForm";

function App() {
    return (
        <div className="container my-3">
            <Router>
                <Switch>
                    <Route path="/" exact component={QuizzesList} />
                    <Route path="/quiz/:id" component={QuizDetails} />
                    <Route path="/create" component={() => <QuizForm type="create" />} />
                    <Route path="/edit/:id" component={() => <QuizForm type="edit" />} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
