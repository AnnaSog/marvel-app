import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);      //приходит массив с объектами(комисками)
    const [newItemLoading, setNewItemLoading] = useState(false);   //спиннер загрузки доп. комиксов, эл.загрузки будет вызываться вручную при нажатии на кнопку
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setСomicsEnded] = useState(false);         //загрузились все перс. из API
    
    const{loading, error,  getAllComics} = useMarvelService();

    useEffect( () => {
        onRequest(offset, true);    //true, т.е. initial: true - при первом запросе спиннер с доп. перс. не будет загр.
    }, [])

    //запрос на сервер
    const onRequest = (offset, initial) => {   //initial - первоначальная загрузка
        initial ? setNewItemLoading(false) : setNewItemLoading(true)  //если первая загрузка, то спиннер загрузки доб. перс не будет отражаться, если повт.загр - будет 
        getAllComics(offset)        //сетевой запрос с нужным методом
            .then(onComicsListLoaded)       //после получения данных сработает этот метод по отражения изменения сос-ния и отраж. интрефейса 
    }

    //комиксы успешно загрузились
    const onComicsListLoaded = (newComicsList) => {    // newCharList - придут трансформированные данные с сервера 
        let ended = false;       //эта переменная нужна,что подставить в изм.сос-ние
        if(newComicsList < 8){
            ended = true;
        }
    
        //вот так изменится сос-ние когда придут данные с сервера
        //новое состояние зависит от предыдущего и из-за этого стрелочная фун-ия c текущем сос-нием(пока без внесенных изм.)и мы из этой фун-ии возращаем объект
        setComicsList( [...comicsList, ...newComicsList]);  //при первом запросе 9 перс.попадут в newCharList, при втором и посл. запросах эти первые 9 перс. будут уже в charList, а новые newCharList,т.е.предыд.сохр +новое
        setNewItemLoading(false);
        setOffset(offset + 8) ;  //текущее сос-ние + 8 
        setСomicsEnded(ended);
    }

    function renderItems(arr) {      //arr - из сервиса придет массив данных
        const items =  arr.map((item, i) => {  //полученный [] переберем на item с созданием нового  - каждый эл. и порядковый номер c 0 до 9
            const {title, thumbnail, price} = item;

            //настроваем стиль на картинку без изобр. перс.
            let imgStyle = {'objectFit' : 'cover'};
            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (                //вернется имя персонажа и его номер
                <li className="comics__item" key={i}> 
                    <a href="#">
                        <img src={thumbnail} alt={title} style={imgStyle} className="comics__item-img"/>
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}</div>
                    </a>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }
    const items = renderItems(comicsList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}  //атр. disabled блокирует/заблокирует кнопку в замисимости, что будет в state true/false
                style={{'display': comicsEnded ? 'none' : 'block'}}  //если перс.все загр., то кнопка исчезает('none')
                onClick={()=> onRequest(offset)}  //если с атрибутом, то всегда указывать с ()=>
                >   
                <div className="inner">load more</div>
            </button>
        </div>
        
    )
    
}

export default ComicsList;