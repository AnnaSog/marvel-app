import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component{

    state = {
        charList: [],
        loading: true,      //загружается что-то
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount(){
        this.marvelService.getAllCharacters()     //сетевой запрос, вызываем один из его нужных методов
            .then(this.onCharListLoaded) //после получения данных сработает этот метод
            .catch(this.onError) 
    }

    onCharListLoaded = (charList) => {    // char - придут трансформированные данные с сервера 
        this.setState({
            charList: charList,            //и изменять сос-ние  
            loading: false         //после загрузки данных спиннер исчезнет 
        })
    }

    onError = () => {
        this.setState({
            loading: false,         //после загрузки данных спиннер исчезнет
            error: true
        })
    }


    renderItems(arr) {      //arr - из сервиса придет массив данных
        const items =  arr.map((item) => {  //полученный [] переберем на item с созданием нового  - каждый эл. и порядковый номер c 0 до 9
            const {id, name, thumbnail} = item;
            let imgStyle = {'objectFit' : 'cover'};
            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (                //вернется имя персонажа и его номер
                <li 
                    className="char__item"
                    key={id}>
                        <img src={thumbnail} alt={name} style={imgStyle}/>
                        <div className="char__name">{name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
    
    render(){

        const {charList, loading, error }= this.state; //изменный char(после получения трансофр. данных с сервера) будет содержать эти данные
        const items = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(error || loading) ? items : null;

        return (
            <div className="char__list">
                
                {errorMessage}
                {spinner}
                {content}
                
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
    
}


export default CharList;