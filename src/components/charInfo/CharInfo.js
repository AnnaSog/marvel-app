import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'; 

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';


const CharInfo = (props) => {

    const [char, setChar] = useState(null);     //если бы указали пустой объект {}, то это означает true и мы не смогли бы загрузить по условию скелетон
    const {getCharacter, clearError, process, setProcess} = useMarvelService();

    useEffect( () => {
        updateChar()  //сетевой запрос 
    }, [props.charId])

    //сетевой запрос 
    const updateChar = () =>{
        const {charId} = props;  //получим Id из app.js, а они из CharList
        if(!charId){    //если нет Id, то просто остановим 
            return;
        }

        clearError();
        getCharacter(charId)       //вызываем метод из useMarvelService
            .then(onCharLoaded) //после получения данных сработает этот метод
            .then(() => setProcess('confirmed')); //подверждение получение данных
    }


    //метод по уже загруженным перс.
    const onCharLoaded = (char) => {    //char - придут трансформированные данные с сервера 
        setChar(char);               //и изменять сос-ние 
    }

    const setContent = (process, char) => {
        switch(process){
            case 'waiting':
                return <Skeleton/>;
                break;
            case 'loading':
                return <Spinner/>;
                break;
            case 'confirmed':
                return <View character={char} />;
                break;
            case 'error':
                return <ErrorMessage/>;
                break;
            default:
                throw new Error('Unexpected process state');
        }
    }


    // const skeleton = !(error || loading || char) ? <Skeleton/> : null; //первоначально будет отражаться скелетон, а потом загрузится после запроса все ост
    // const errorMessage = error ? <ErrorMessage/> : null;
    // const spinner = loading ? <Spinner/> : null;
    // const content = !(error || loading || !char) ? <View character={char} /> : null;
    //         //нет ошибки, нет загрузки и есть персонаж(!char)

    return (
        <div className="char__info">
            {/* {skeleton}
            {errorMessage}
            {spinner}
            {content} */}
            {setContent(process, char)}
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
                                     
                                    <Link to={`/comics/${item.resourceURI.substring(43)}`}>
                                        {item.name}
                                    </Link> 
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