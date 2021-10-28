import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'; 

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);   //приходит массив с объектами(персонажами)
    const [newItemLoading, setNewItemLoading] = useState(false);   //спиннер загрузки доп. перс., эл.загрузки будет вызываться вручную при нажатии на кнопку
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);     //закончилась загрузка перс.

   const {loading, error, getAllCharacters} = useMarvelService();

   useEffect( () => {
        onRequest(offset, true);    //true, т.е. initial: true - при первом запросе спиннер с доп. перс. не будет загр.
    }, [])

   
    //запрос на сервер
    const onRequest = (offset, initial) => {   //initial - первоначальная загрузка
        initial ? setNewItemLoading(false) : setNewItemLoading(true)  //если первая загрузка, то спиннер загрузки доб. перс не будет отражаться, если повт.загр - будет 
        getAllCharacters(offset)        //сетевой запрос с нужным методом
            .then(onCharListLoaded)       //после получения данных сработает этот метод по отражения изменения сос-ния и отраж. интрефейса 
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
        setNewItemLoading(false);
        setOffset(offset => offset + 9) ;  //текущее сос-ние + 9 
        setCharEnded(ended);
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
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            
            {errorMessage}
            {spinner}
            {items}
            
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