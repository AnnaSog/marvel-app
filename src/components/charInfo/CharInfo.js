import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';


class CharInfo extends Component{

    state = {
        char: null,  //если бы указали пустой объект {}, то это означает true и мы не смогли бы загрузить по условию скелетон(см.render)
        loading: false,      //при вызове этого компонента, спинер не должен по умолчанию отражаться, появится при выове польз-ем
        error: false
    }


    marvelService = new MarvelService();

    componentDidMount(){  //вызывается 1 раз при создании компонента
        this.updateChar();  //сетевой запрос 
    }

    componentDidUpdate(prevProps){                 //prevProps/prevState сохраняет предыдущее сос-ние до обновления
        if(this.props.charId !== prevProps.charId){  //если текущий пропс не совпадает с предыдущем сос-нием (не совпадаю Id)
            this.updateChar();                    //то значит прошло обновление и обновляется персонаж
        }else{
            return;
        }
    }


    updateChar = () =>{
        const {charId} = this.props;  //получим Id из app.js, а они из CharList
        if(!charId){    //если нет Id, то просто остановим 
            return;
        }

        this.onCharLoading();
        this.marvelService
            .getCharacter(charId)       //вызываем один из его нужных методов
            .then(this.onCharLoaded) //после получения данных сработает этот метод
            .catch(this.onError)
    }

    //метод по загрузке персонажа
    onCharLoaded = (char) => {    // char - придут трансформированные данные с сервера 
        this.setState({
            char: char,            //и изменять сос-ние  
            loading: false         //после загрузки данных спиннер исчезнет 
        })
    }

    //перед сетевым запросом будет загружаться спиннер, что польз. понимал, что-то здесь сейчас загрузится
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


    render(){

        const {char, loading, error }= this.state; //изменный char(после получения трансофр. данных с сервера) будет содержать эти данные
        
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

export default CharInfo;