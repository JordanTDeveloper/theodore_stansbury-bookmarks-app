
const marks = [];
let ratingNumber = 0;
let ratingFilter = false;
let adding = false;
let selectedId = '';
let error = null;


const findById = function(id){
    return this.marks.find(currentMark => currentMark.id === id);
}

const addMark = function(mark){
    this.marks.push(mark);
}

const deleteMark = function(id){
    this.marks = this.marks.filter(currentMark => currentMark.id !== id);
}

const setError = function(error){
    this.error = error
}


export default {
    marks,
    error,
    ratingNumber,
    ratingFilter,
    selectedId,
    adding,
    findById,
    addMark,
    deleteMark,
    setError
};