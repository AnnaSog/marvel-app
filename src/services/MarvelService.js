import {useHttp} from '../hooks/http.hooks';

const useMarvelService = ()  => {
    const {loading, error, request, clearError} = useHttp();

   const _apiBase = 'https://gateway.marvel.com:443/v1/public/'; 
   const _apiKey = 'apikey=b4e99c5feecbc58cf8b09dc8585dac81';
   const _baseOffset = 210;  //загружаются перс. с 210 отступа


    const getAllCharacters = async (offset = _baseOffset, name='') => {      //по умолчанию будут загружаться перс. с 210 отступа(если при отправке запроса не указан арг)
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);   //получаем большой массив с объектами
        return res.data.results.map(_transformCharacter);     //в полученном рез-те отбираем нужный массив и создав отдельный массив(map) трансформируя их по конкретным данным 
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?limit=9&offset=210&${_apiKey}`); //получаем большой объект с данными сделав запрос
        return _transformCharacter(res.data.results[0]); //возращается только те данные, ктр нам нужны; [0] - один персонаж
    }

    const _transformCharacter = (char) => {   //char(т.е. res.data.results[0]) - получаем объект данных их сервера, в getCharacter адрес запроса указан в res
        return {                        //и возращается только то, что нам нужно  
            id: char.id,  
            name: (char.name.length > 22) ? `${char.name.slice(0, 22)}...` : char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            //если есть, то обрезает с 0 до 210 букв и дописывает ..., если описания нет, то выходит это сообщение 
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension, 
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items  
        }  
    }

    const getAllComics = async(offset=0) => {
        const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,  
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension, 
            title: comics.title,
            price: comics.prices[0].price ? `${comics.prices[0].price }$` : 'not available',
         
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount ? `${comics.pageCount} pages` : 'No information about the number of pages',
            language: comics.textObjects.language || 'en-us'
        }
    }

    return {loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic, getCharacterByName}
}

export default useMarvelService;