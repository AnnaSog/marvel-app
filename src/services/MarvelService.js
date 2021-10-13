class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=b4e99c5feecbc58cf8b09dc8585dac81';

    getResource = async (url) => {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    }

    getAllCharacters = async () => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`); //получаем большой массив с объектами
        return res.data.results.map(this._transformCharacter); //в полученном рез-те отбираем нужный массив и создав отдельный массив(map) трансформируя их по конкретным данным 
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?limit=9&offset=210&${this._apiKey}`); //получаем большой объект с данными сделав запрос
        return this._transformCharacter(res.data.results[0]); //возращается только те данные, ктр нам нужны; [0] - один персонаж
    }

    _transformCharacter = (char) => {   //char(т.е. res.data.results[0]) - получаем объект данных их сервера, в getCharacter адрес запроса указан в res
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
}

export default MarvelService