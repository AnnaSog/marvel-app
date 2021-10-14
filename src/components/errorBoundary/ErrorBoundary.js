import { Component } from 'react';
import ErrorMessage from '../errorMessage/ErrorMessage';

class ErrorBoundary extends Component{

    state ={
        error: false
    }

    componentDidCatch(error, errorInfo){
        this.setState({
            error: true
        })
    }

    render() {
        if(this.state.error){           //если прошла ошибка, то картинка с ошибкой
            return <ErrorMessage/>
        }

        return this.props.children  //если нет ошибки, то рендерится компонент, ктр обернут этим комп.
    }
}

export default ErrorBoundary;