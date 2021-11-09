import { useState} from 'react';

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import CharSearchForm from '../charSearchForm/CharSearchForm';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';

import decoration from '../../resources/img/vision.png';

const MainPage = () => {

    //чтобы передать инфо(id) из CharList в CharInfo нужен промежуточны компонент(MainPage) 
    const [selectedChar, setChar] = useState(null)   //данных пока нет

    //метод, ктр будет изменять сос-ние state через аргумент( получив id из CharList)
    const onCharSelected = (id) => {
        setChar(id)
    }

    return(
        <>
            <ErrorBoundary>
                <RandomChar/>
            </ErrorBoundary>
            <div className="char__content">
                <ErrorBoundary>
                    <CharList onCharSelected={onCharSelected} />
                </ErrorBoundary>
                <div>
                    <ErrorBoundary>
                        <CharInfo charId={selectedChar}/>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <CharSearchForm/>
                    </ErrorBoundary>
                </div>
              
                
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>

    )
}

export default MainPage;