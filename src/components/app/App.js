import { Component } from 'react';
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";

import decoration from '../../resources/img/vision.png';

class App extends Component {

    //чтобы передать инфо(id) из CharList в CharInfo нужен промежуточны компонент(App) 
    state = {
        selectedChar: null   //данных пока нет
    }

    //метод, ктр будет изменять сос-ние state через аргумент( получив id из CharList)
    onCharSelected =(id) => {
        this.setState({
            selectedChar: id
        })
    }

    render(){
        return (
            <div className="app">
                <AppHeader/>
                <main>
                    <RandomChar/>
                    <div className="char__content">
                        <CharList onCharSelected={this.onCharSelected} />
                        <CharInfo charId={this.state.selectedChar}/>
                    </div>
                    <img className="bg-decoration" src={decoration} alt="vision"/>
                </main>
            </div>
        )
    }
}

export default App;