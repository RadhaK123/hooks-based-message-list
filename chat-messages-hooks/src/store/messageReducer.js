const initialState = {
    sortedUniqueMessages: []
};

function messageReducer(state=initialState, action) {
    switch(action.type) {
        case 'messages': {
            return {sortedUniqueMessages: Array.from(action.payload)}
        }

        default:
            return state;
    }
}

export default messageReducer;