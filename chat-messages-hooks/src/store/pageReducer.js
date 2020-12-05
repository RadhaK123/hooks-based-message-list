const initialState = {
    currentPage: 1
};

function pageReducer(state=initialState, action) {
    switch (action.type) {
        case 'next': {
            return {currentPage: state.currentPage+1}
        }
        case 'prev': {
            return {currentPage: state.currentPage-1}
        }
        default:
            return state;
    }
}

export default pageReducer;