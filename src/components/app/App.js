import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ComicsPage, MainPage, SingleComicPage } from '../pages';
import Spinner from '../spinner/Spinner';

import AppHeader from "../appHeader/AppHeader";

const Page404 = lazy( () => import('../pages/404')); //Page404 - будет "ленивым" компонентом, подгружаться по требованию

const App = () => {
    
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}> 
                        <Switch>
                            <Route exact path='/'>
                                <MainPage/>
                            </Route>
                            <Route exact path='/comics'>
                            <ComicsPage/>
                            </Route>
                            <Route exact path='/comics/:comicId'>
                                <SingleComicPage/>
                            </Route>
                            <Route path='*'>
                                <Page404/>
                            </Route>
                        </Switch>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
    
}

//Suspense в паре с lazy создает "ленивый" компонент, fallback - будет загружать спиннер, пока ленивый комп. подгружается

export default App;