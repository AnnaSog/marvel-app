import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'; 

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);   //приходит массив с объектами(персонажами)
    const [loading, setLoading] = useState(true);   //загружается что-то
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);   //эл.загрузки будет вызываться вручную при нажатии на кнопку
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

   const marvelService = new MarvelService();

   useEffect( () => {
        onRequest();    //при первом запросе в арг.не прописан offset, значит по умол. 210, при повторном запросе будут уже указан 
   }, [])

   
    //запрос на сервер
    const onRequest = (offset) => {
        marvelService.getAllCharacters(offset)     //сетевой запрос, вызываем один из его нужных методов
            .then(onCharListLoaded)       //после получения данных сработает этот метод по отражения изменения сос-ния и отраж. интрефейса
            .catch(onError) 
    }

    //персонаж еще загружается
    const onCharLoading = () => {
        setNewItemLoading(true)   //при запросе загрузки персонажей - эл.загрузки будет отражаться
    }

    //персонажи успешно загрузились
    const onCharListLoaded = (newCharList) => {    // newCharList - придут трансформированные данные с сервера 
        let ended = false; //эта переменная нужна,что подставить в изм.сос-ние
        if(newCharList<9){
            ended = true;
        }
        
        //вот так изменится сос-ние когда придут данные с сервера
        //новое состояние зависит от предыдущего и из-за этого стрелочная фун-ия c текущем сос-нием(пока без внесенных изм.)и мы из этой фун-ии возращаем объект
        setCharList(charList => [...charList, ...newCharList]);  //при первом запросе 9 перс.попадут в newCharList, при втором и посл. запросах эти первые 9 перс. будут уже в charList, а новые newCharList,т.е.предыд.сохр +новое
        setLoading(false);                 //после загрузки данных спиннер исчезнет 
        setNewItemLoading(false);
        setOffset(offset => offset + 9) ;  //текущее сос-ние + 9 
        setCharEnded(ended);
    }

    const onError = () => {
        setLoading(false);   //после загрузки данных спиннер исчезнет
        setError(true);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected')); //current - это св-во, после рендеринга запишется ссылка на DOM-эл. и после будут перебираться эл. в этой ссылке
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();  
    }

    function renderItems(arr) {      //arr - из сервиса придет массив данных
        const items =  arr.map((item, i) => {  //полученный [] переберем на item с созданием нового  - каждый эл. и порядковый номер c 0 до 9
            const {id, name, thumbnail} = item;

            //настроваем стиль на картинку без изобр. перс.
            let imgStyle = {'objectFit' : 'cover'};
            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (                //вернется имя персонажа и его номер
                <li 
                    className="char__item"
                    tabIndex={0} //уст ручной фокус
                    ref={el => itemRefs.current[i] = el}  //itemRefs.current - массив ссылок, ктр будут последовательно формироваться
                    key={id}
                    onClick={() => {
                            props.onCharSelected(id);  //при клике на персонажа получаем id и передаем в App.js
                            focusOnItem(i);  //при клике на перс сработае фокус
                        }
                    } 
                    onKeyPress={(e) => {        //событие, ктр срабаТывает на нажатие клавиш
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(id);
                            focusOnItem(i);
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
    
    
    const items = renderItems(charList);
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
                onClick={()=> onRequest(offset)}  //если с атрибутом, то всегда указывать с ()=>
                >   
                <div className="inner">load more</div>
            </button>
        </div>
    )
    
    
}

//проверяем, чтобы пропс пришел функцией
CharList.propTypes = {
    onCharSelected: PropTypes.func
}


export default CharList;