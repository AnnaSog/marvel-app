import { useState, useEffect } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {

    const [char, setChar] = useState({});
    const [loading, setLoading] = useState(true);   //сразу загружается спиннер при вызове этого блока/при обновлении стр
    const [error, setError] = useState(false);
    
    const marvelService = new MarvelService();

    useEffect( () => {
        updateChar();  //сетевой запрос
        // timerId = setInterval(updateChar, 3000);  //уст. таймер
        // clearInterval(timerId);  //отписка от таймера
    }, [])


    //метод по загрузке персонажа
    const onCharLoaded = (char) => {    // char - придут трансформированные данные с сервера 
        setChar(char);       //и изменять сос-ние  
        setLoading(false);   //после загрузки данных спиннер исчезнет 
    }

    //перед сетевым запросом будет загружаться спиннер, особенно это важно при нажатив на кн."try it"
    const onCharLoading = () => {
        setLoading(true)
    }

    const onError = () => {
        setLoading(false);  //после загрузки данных спиннер исчезнет
        setError(true);
    }

  const updateChar = () =>{
        const id = Math.floor(Math.random() * (1011400-1011000) + 1011000); //Math.floor -округляет рез-т,далее прописана формула метода Math.random; (1011400-101100)-min-max персон.
        onCharLoading();  //загружается спиннер пока не пришли данные с сервера
        marvelService
            .getCharacter(id)       //вызываем один из его нужных методов
            .then(onCharLoaded) //после получения данных сработает этот метод
            .catch(onError)
    }


    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(error || loading) ? <View character={char}/> : null;

    return (
        <div className="randomchar">
            {errorMessage}
            {spinner}
            {content}

            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
    
}

const View = ({character}) => {
    const {thumbnail, name, description, homepage, wiki} = character;
    let classNames = 'randomchar__img';
    
    if(thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'){
        classNames += ' contain';
    }

    return(
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className={classNames}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">{description}</p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>    
    )
}


export default RandomChar;