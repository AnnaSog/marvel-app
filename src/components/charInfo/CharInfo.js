import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; 

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';


const CharInfo = (props) => {

    const [char, setChar] = useState(null);     //если бы указали пустой объект {}, то это означает true и мы не смогли бы загрузить по условию скелетон
    const [loading, setLoading] = useState(false);      //при вызове этого компонента, спинер не должен по умолчанию отражаться, появится при выове польз-ем
    const [error, setError] = useState(false);  

    const marvelService = new MarvelService();

    useEffect( () => {
        updateChar()  //сетевой запрос 
    }, [props.charId])


    const updateChar = () =>{
        const {charId} = props;  //получим Id из app.js, а они из CharList
        if(!charId){    //если нет Id, то просто остановим 
            return;
        }

        onCharLoading();
        marvelService
            .getCharacter(charId)       //вызываем один из его нужных методов
            .then(onCharLoaded) //после получения данных сработает этот метод
            .catch(onError)
    }

    //метод по загрузке персонажа
    const onCharLoaded = (char) => {    //char - придут трансформированные данные с сервера 
        setChar(char);         //и изменять сос-ние 
        setLoading(false);      //после загрузки данных спиннер исчезнет 
    }

    //перед сетевым запросом будет загружаться спиннер, что польз. понимал, что-то здесь сейчас загрузится
    const onCharLoading = () => {
        setLoading(true)
    }

    const onError = () => {
        setLoading(false);   //после загрузки данных спиннер исчезнет
        setError(true);
    }


    const skeleton = !(error || loading || char) ? <Skeleton/> : null; //первоначально будет отражаться скелетон, а потом загрузится после запроса все ост
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    
    const content = !(error || loading || !char) ? <View character={char}/> : null;
            //нет ошибки, нет загрузки и есть персонаж(!char)

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )

}

const View =({character}) => {
    const {name, thumbnail, description, homepage, wiki, comics} = character;
    
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }
    
    return(
        <>
            <div className='char__basics'>
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki}className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
              {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length ? null : "There is no comics with this character"}
                {
                    comics.map((item, i) => {
                        if(i > 9) return; //если комиксов больше 10, то дальше они не будет формироваться

                        return(
                            <li 
                                key={i}   //при создании нового эл.(они будут создаваться по этому шаблону), нужен key и по умолчанию укажем порядковый номер эл.(i)
                                className="char__comics-item"> 
                                {item.name}
                            </li>
                        )
                    })
                }

            </ul>
        </>
    )
}

//проверяем, чтобы пропс пришел числом
CharInfo.propTypes = {
    charId: PropTypes.number
}  

export default CharInfo;