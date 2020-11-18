const BASE_URL = 'https://thinkful-list-api.herokuapp.com/theodore/bookmarks'

const listApiFetch = function(...marks){
    let error;
    return fetch(...marks)
    .then(response =>{
        if(!response.ok){
            error={code: response.status};
        
        if(!response.headers.get('content-type').includes('json')){
            error.message = response.statusText;
            return Promise.reject(error);
        }
    }
    return response.json();
    })
    .then(data =>{
        if(error){
            error.message = data.message;
            return Promise.reject(error);
        }
        return data;
    })
}

const getBookmarks = function(){
    return listApiFetch(`${BASE_URL}`)
}

const createBookmark = function(bookmark){
    const newBookmark = JSON.stringify(bookmark);
    return listApiFetch(`${BASE_URL}`, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: newBookmark
    });
}

const deleteBookmark = function(id){
    return listApiFetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
    });
}


export default {
    getBookmarks,
    createBookmark,
    deleteBookmark,    
}