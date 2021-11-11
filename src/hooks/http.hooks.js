import { useState, useCallback } from 'react';

export const useHttp = () => {
    const [loading, setLoading] = useState(false);   //загружается что-то
    const [error, setError] = useState(null);
    const [process, setProcess] = useState('waiting');  //ожидание какое-то действия, напр.скелетон отражается

    //этот запрос будет помещен в дочерн. комп., чтобы не запускался в бесконечнный цикл указан useCallback  
    const request = useCallback(async (url, method='GET', body=null, headers={'Content-Type': 'application/json'}) => {          //если метод не прописан, то по умолчанию GET
    
        setLoading(true);  //перед отправкой запроса будет отражаться загрузка(спиннер)
        setProcess('loading');  //перед отправкой запроса будет отражаться загрузка(спиннер); необх.указать как строку
        try {
            const response = await fetch(url, {method, body, headers});  //отправляем запрос и получаем ответ
            
            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            const data = await response.json();  //получим данные в формате json

            setLoading(false);      //после получение данных спиннер исчезает
            return data;            //вернутся и будут отражаться данные, ктр запрашивали  

        }catch(e) {
            setLoading(false);
            setProcess('error');
            setError(e.message);    //изменение состояние ошибки - отражазится сообщение об ошибке
            throw e;
        }

    }, []) 


    //фун-ия по очистке ошибок, по умолчанию она не будет очищаться
    const clearError = useCallback( ()=> {
        setError(null)              //сообщение об ошибке исчезнет
        setProcess('loading');
    }, []);


    return {loading, request, error, clearError, process, setProcess}    //этот собственный хук будет возращать эти объекты, т.е мы их экспортируем в др. комп. или хуки
}