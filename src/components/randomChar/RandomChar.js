import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {

    //В ЭТОМ state ЛЕЖАТ ДАННЫЕ, КТР ОПРЕДЕЛЯЮТ ВСЕГО ОДНОГО ПЕРСОНАЖА, НО В state МОГУТ БЫТЬ И ДР.ДАННЫЕ(ОШИБКА, ИНДИКАТОР И ТД.) И ЛУЧШЕ ЭТИ ДАННЫЕ ЗАГР.В ОТДЕЛЬНЫЙ ОБЪЕКТ
    // state ={                //данные взяты из данные персонажей в API и в основном в разделе results
    //     name: null,
    //     description: null,  //Описание
    //     thumbnail: null,    //маленькая картинка
    //     homepage:null,     //кнопка
    //     wiki: null          //вт. кнопка
    // }

    state = {
        char: {},
        loading: true,      //сразу загружается спиннер при вызове этого блока/при обновлении стр
        error: false
    }
    
    marvelService = new MarvelService();

    componentDidMount(){
        this.updateChar();  //сетевой запрос
        // this.timerId = setInterval(this.updateChar, 3000);  //уст. таймер
    }

    componentWillUnmount(){      
        clearInterval(this.timerId);
    }

    //метод по загрузке персонажа
    onCharLoaded = (char) => {    // char - придут трансформированные данные с сервера 
        this.setState({
            char: char,            //и изменять сос-ние  
            loading: false         //после загрузки данных спиннер исчезнет 
        })
    }

    //перед сетевым запросом будет загружаться спиннер, особенно это важно при нажатив на кн."try it"
    onCharLoading = () => {
        this.setState({
            loading: true       
        })
    }

    onError = () => {
        this.setState({
            loading: false,         //после загрузки данных спиннер исчезнет
            error: true
        })
    }

   updateChar = () =>{
        const id = Math.floor(Math.random() * (1011400-1011000) + 1011000); //Math.floor -округляет рез-т,далее прописана формула метода Math.random; (1011400-101100)-min-max персон.
        this.onCharLoading();  //загружается спиннер пока не пришли данные с сервера
        this.marvelService
            .getCharacter(id)       //вызываем один из его нужных методов
            .then(this.onCharLoaded) //после получения данных сработает этот метод
            .catch(this.onError)
    }

    render() {
        const {char, loading, error }= this.state; //изменный char(после получения трансофр. данных с сервера) будет содержать эти данные
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
                    <button className="button button__main" onClick={this.updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
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