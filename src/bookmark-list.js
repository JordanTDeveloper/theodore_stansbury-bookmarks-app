import $ from 'jquery';
import bookmark from './bookmarks';
import api from './api';


const showBookmark = function(bookmarkList, showDescription){
    const bookmarks = bookmarkList

    if(!showDescription) {
        return `
        <li class="js-mark-element" data-mark-id="${bookmarks.id}">
        <div class="title-container">
            <span class="mark-title">${bookmarks.title}</span>
        </div>
        <div class="rating-container">
            <span class="mark-rating js-mark-rating">${bookmarks.rating}</span>
        </div>
        </li>
        `;
    } else  {
        return `    
            <li class="js-mark-element" data-mark-id="${bookmarks.id}">
                <div class="bookmark-list-desc">
                    
                        <span class="mark-title"><h3>${bookmarks.title}</h3></span>
                        <hr>
                        <span class="mark-description">
                            <p>${bookmarks.desc}</p>
                        </span>
                        
                        <br>
                        <span class="mark-url">
                        <a href="${bookmarks.url}" target="_blank">Visit website</a>
                        </span>
                        <br>
                        <button class="delete-button js-delete-button">
                            <span class="button-label">Delete</span>
                        </button>
                    
                </div>
                <div class="rating-container">
                    <span class="rating-label">Rating:</span>
                    <span class="mark-rating js-mark-id">${bookmarks.rating}</span>
                </div>
            </li>
    `;
    }
}

const bookmarkPage = function(){
        return`
            <div id="add-bookmark-container">
                    <form id="add-form">
                        <label for="title" class="title-label">Title:</label>
                        <input type="text" name="title" id="title" placeholder="Title..." required>
                        <br>
                        <label for="url" class="url-label">Link to website:</label>
                        <input type="url" name="url" id="url" placeholder="http(s)://..." required>
                        <br>
                        <label for="desc" class="desc-label">Description:</label>
                        <input type="text" name="desc" id="desc" placeholder="Description...">
                        <br>
                        <label for="rating" class="rating-label">Rating:</label>
                        <input type="number" name="rating" id="rating" min="1" max="5" placeholder="1-5" required>
                        <br>
                        <button type="submit" id="add-bookmark-button">Add</button>
                        <button type="reset" id="cancel-bookmark-button">Cancel</button>
                    </form>         
            </div>`
}

const generateError = function(message){
    return `
        <section class="error-content">
          <button id="cancel-error">X</button>
          <p>${message}</p>
        </section>
      `;
}

const makeBookmarkList = function(theList){
    const books = theList.map((book) => showBookmark(book, book.id === bookmark.selectedId));
    return books.join('');
}

// Event Handlers

const handleFilterBookmark = function(){    
    $('#header-container').on('click', '#ratings-filter' ,function(evt){
        evt.preventDefault();
        let rating = $('#ratings-filter option:selected').val();
        bookmark.ratingNumber = rating;
        
        if (bookmark.ratingNumber !== 0){
            bookmark.ratingFilter = true;
        }else{
            bookmark.ratingFilter = false;
        }
        render();
    })
}

const handleBookmarkPage = function(){
    $('#header-container').on('click','#to-add-button', function(evt){
        evt.preventDefault();
        bookmark.adding = true;
        render();
    })
}

const handleAddBookmark = function(){
    $('main').on('submit','form', function(evt){
        evt.preventDefault();
        
        const newBookmark = {
            title: $('#title').val(),
            url: $('#url').val(),
            desc: $('#desc').val(),
            rating: $('#rating').val()
        }

        bookmark.adding = true;

        api.createBookmark(newBookmark)
            .then((newMark) => {
                bookmark.addMark(newMark);
                render();
            })
            .catch((error) => {
                bookmark.setError(error.message);
                renderError();
            });

        bookmark.adding = false;
    })
}

const handleCancelAdding = function(){    
    $('#main-container').on('click', '#cancel-bookmark-button', function(evt){
        evt.preventDefault();
        bookmark.adding = false;  
        render();
    })
}

const handleClickedBookmark = function(){
    $('.bookmarks-list').on('click', '.mark-title', function(evt){
        evt.preventDefault();
        const id = getIdFromElement(evt.currentTarget);

        if (bookmark.selectedId === id){
            bookmark.selectedId = '';
        }
        else{
            bookmark.selectedId = id;
        }
        render();
    })
}

const handleDeleteBookmark = function(){
    $('.bookmarks-list').on('click','.js-delete-button', function(evt){
        evt.preventDefault();
        const id = getIdFromElement(evt.currentTarget);

        api.deleteBookmark(id)
            .then(() => {
                bookmark.deleteMark(id);
                render();
            })
            .catch((error) => {
                console.log(error);
                bookmark.setError(error.message);
                renderError();
            });
    })
}

const handleError = function(){
    $('#error-container').on('click', '#cancel-error', () => {
      bookmark.setError(null);
      renderError();
    });
}

const getIdFromElement = function(mark){
    return $(mark)
      .closest('li')
      .data('mark-id');
}


// Render

const render = function(){
    renderError();

    let theList = [...bookmark.marks];

    if (bookmark.adding === false && bookmark.ratingFilter === false){
        if(theList.length === 0){
            $('.bookmarks-list').addClass('hidden');
        }else{
            $('.bookmarks-list').removeClass('hidden');
        }

        $('#main-container').empty();
        $('.bookmarks-list').html(makeBookmarkList(theList));
    }
    else if (bookmark.adding === true){
        $('#main-container').html(bookmarkPage());
        bookmark.adding = false;
    }
    else if (bookmark.ratingFilter === true){
        let booksFilter = theList.filter(function (item) {
            if (bookmark.ratingNumber == 0) {
                return theList
            }
            else {
                return item.rating == bookmark.ratingNumber
            }
        })

        if (theList.length === 0){
            $('.bookmarks-list').addClass('hidden');
        }
        else {
            $('.bookmarks-list').removeClass('hidden');
        }

        $('#main-container').empty();
        $('.bookmarks-list').html(makeBookmarkList(booksFilter));
    }
}

const renderError = function(){
    if (bookmark.error){
      const el = generateError(bookmark.error);
      $('#error-container').html(el);
    } else {
      $('#error-container').empty();
    }
}


const bindEventListeners = function(){
    handleError();
    handleAddBookmark();
    handleClickedBookmark();
    handleDeleteBookmark();
    handleBookmarkPage();
    handleFilterBookmark();
    handleCancelAdding();
}


export default{
    render,
    bindEventListeners
}