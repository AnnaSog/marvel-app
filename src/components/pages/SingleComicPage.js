import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react'; 

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './singleComicPage.scss';

const SingleComicPage = () => {
    const {comicId} = useParams();
    const {loading, error, getComic, clearError} = useMarvelService();

    const [comic, setComic] = useState(null);     //если бы указали пустой объект {}, то это означает true и мы не смогли бы загрузить по условию скелетон

    useEffect( () => {
        updateComic()  //сетевой запрос 
    }, [comicId])


    //сетевой запрос 
    const updateComic = () =>{
        clearError();
        getComic(comicId)       //вызываем метод из useMarvelService
            .then(onComicLoaded) //после получения данных сработает этот метод
    }

    //метод по уже загруженным комиксов
    const onComicLoaded = (comic) => {    //comic - придут трансформированные данные с сервера 
        setComic(comic);               //и изменять сос-ние 
    }


    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    
    const content = !(error || loading || !comic) ? <View comic={comic}/> : null;
            //нет ошибки, нет загрузки и (!comic)

    return (
        <div className="single-comic">
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({comic}) => {
    const {thumbnail, title, price, description, pageCount, language} = comic;

    return(
        <>
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to='/comics' className="single-comic__back">Back to all</Link>
        </>
    )
}

export default SingleComicPage;