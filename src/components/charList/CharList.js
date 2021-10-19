import React, { Component } from 'react';
import PropTypes from 'prop-types'; 

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component{

    state = {
        charList: [],       //приходит массив с объектами(персонажами)
        loading: true,      //загружается что-то
        error: false,
        newItemLoading: false,  //эл.загрузки будет вызываться вручную при нажатии на кнопку
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount(){
        this.onRequest();   //при первом запросе в арг.не прописан offset, значит по умол. 210, при повторном запросе будут уже указан 
    
    }


    //запрос на сервер
    onRequest = (offset) => {
        this.marvelService.getAllCharacters(offset)     //сетевой запрос, вызываем один из его нужных методов
            .then(this.onCharListLoaded)       //после получения данных сработает этот метод по отражения изменения сос-ния и отраж. интрефейса
            .catch(this.onError) 
    }

    //персонаж еще загружается
    onCharLoading = () => {
        this.setState({
            newItemLoading: true   //при запросе загрузки персонажей - эл.загрузки будет отражаться
        })
    }

    //персонажи успешно загрузились
    onCharListLoaded = (newCharList) => {    // newCharList - придут трансформированные данные с сервера 
        let ended = false; //эта переменная нужна,что подставить в изм.сос-ние
        if(newCharList<9){
            ended = true;
        }
        
        //вот так изменится сос-ние когда придут данные с сервера
        this.setState(({offset, charList}) => ({    //новое состояние зависит от предыдущего и из-за этого ()=>{} c текущем сос-нием(пока без внесенных изм.)и мы из этой фун-ии возращаем объект
            charList: [...charList, ...newCharList],   //при первом запросе 9 перс.попадут в newCharList, при втором и посл. запросах эти первые 9 перс. будут уже в charList, а новые newCharList,т.е.предыд.сохр +новое
            loading: false,         //после загрузки данных спиннер исчезнет 
            newItemLoading: false,
            offset: offset + 9,       //текущее сос-ние + 9 
            charEnded:ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,         //после загрузки данных спиннер исчезнет
            error: true
        })
    }

    itemRefs = []

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderItems(arr) {      //arr - из сервиса придет массив данных
        const items =  arr.map((item, i) => {  //полученный [] переберем на item с созданием нового  - каждый эл. и порядковый номер c 0 до 9
            const {id, name, thumbnail} = item;
            let imgStyle = {'objectFit' : 'cover'};
            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (                //вернется имя персонажа и его номер
                <li 
                    className="char__item"
                    tabIndex={0} //уст ручной фокус
                    ref={this.setRef}
                    key={id}
                    onClick={() => {
                            this.props.onCharSelected(id);  //при клике на персонажа получаем id и передаем в App.js
                            this.focusOnItem(i);  //при клике на перс сработае фокус
                        }
                    } 
                    onKeyPress={(e) => {        //событие, ктр срабаТывает на нажатие клавиш
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(id);
                            this.focusOnItem(i);
                        }
                    }}
                    > 
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

        const {charList, loading, error, offset, newItemLoading, charEnded }= this.state; //изменный char(после получения трансофр. данных с сервера) будет содержать эти данные
        const items = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(error || loading) ? items : null;

        return (
            <div className="char__list">
                
                {errorMessage}
                {spinner}
                {content}
                
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}  //атр. disabled блокирует/заблокирует кнопку в замисимости, что будет в state true/false
                    style={{'display': charEnded ? 'none' : 'block'}}  //если перс.все загр., то кнопка исчезает('none')
                    onClick={()=> this.onRequest(offset)}  //если с атрибутом, то всегда указывать с ()=>
                    >   
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
    
}

//проверяем, чтобы пропс пришел функцией
CharList.propTypes = {
    onCharSelected: PropTypes.func
}


export default CharList;