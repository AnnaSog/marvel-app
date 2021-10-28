import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import ComicsPage from '../pages/ComicsPage';

import AppHeader from "../appHeader/AppHeader";


const App = () => {
    
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Switch>
                        <Route exact path='/'>
                            <MainPage/>
                        </Route>
                        <Route exact path='/comics'>
                           <ComicsPage/>
                        </Route>
                    </Switch>
                </main>
            </div>
        </Router>
    )
    
}

export default App;