import $ from 'jquery';
import bookmark from './bookmarks';
import api from './api';
import bookmarkList from './bookmark-list';


const main = function(){
    api.getBookmarks()
    .then((marks) => {
      marks.forEach((mark) => bookmark.addMark(mark));
      bookmarkList.render();
    });

    bookmarkList.bindEventListeners();
    bookmarkList.render();
}


$(main);