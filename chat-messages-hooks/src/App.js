import React, { useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import './App.css';
import {messages} from './data/data.json';

const pageSize = 5;

function App() {
    const sortedUniqueMessages = useSelector(state => state.messageReducer.sortedUniqueMessages);
    const currentPage = useSelector(state => state.pageReducer.currentPage);
    const dispatch = useDispatch();

    function processMessages() {
        const uniqueMessageMap = new Map();

        //Remove duplicate messages
        removeDuplicateMessages(messages, uniqueMessageMap);

        // Sort messages by timestamp.
        const sortedMessages = sortMessages(uniqueMessageMap);

        //Set the state
        dispatch({type: 'messages', payload: sortedMessages}); // sortedUniqueMessages);
    };


    //Initialization work
    useEffect(() => {
        processMessages();
    }, []);


    //Remove duplicate messages from the data. uui+content is the key
    function removeDuplicateMessages(msgList, uniqueMessageMap) {
        msgList.forEach((msg, index) => {
            // Use the 'uuid+content' as the key to the map because the input sample
            //looks simple. Another type of key should probably be used if
            //content will be longer or complex data type.
            let msgKey = msg.uuid + '' + msg.content;  //Convert it to a string

            // if there are duplicate messages, the later one replaces the older message.
            uniqueMessageMap.set(msgKey, msg);
        });
    };  //removeDuplicateMessages


    //Sort messages based on 'sentAt' on the message
    function sortMessages(uniqueMessageMap) {

        //Get a iterator for the message map
        const messageIterator = uniqueMessageMap.values();
        const sortedMessages = [];

        //Get the messages out of the iterator
        let msg;
        while ((msg = messageIterator.next().value) !== undefined) {
            sortedMessages.push(msg);
        };

        //Sort on timestamp
        sortedMessages.sort((msg1, msg2) => {
            const time1 = new Date(msg1.sentAt);
            const time2 = new Date(msg2.sentAt);

            if (time1 < time2)
                return -1;
            else if (time1 > time2)
                return 1;
            return 0;
        });

        return sortedMessages;
    };

    //Format the Timestamp on the message
     function processTimeStamp(timeString) {
        const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


        const sentAt = new Date(timeString);

        //Format the day, date and time
        const dateSegment = `${dayIndex[sentAt.getDay()]} ${monthIndex[sentAt.getMonth()]} ${sentAt.getDate()}, ${sentAt.getFullYear()}`;
        let hour = sentAt.getHours();
        let min = sentAt.getMinutes().toString().padStart(2, '0');

        let amPM = 'am';
        if (hour > 12)
            amPM = 'pm';

        hour = hour > 12 ? hour % 12 : hour;

        let time = `${hour}:${min} ${amPM}`;

        return dateSegment + ' at ' + time;
    };     //processTimeStamp


    //Delete button callback
    function deleteMessage(e) {
        const deletedMsg = e.target.dataset.key;

        sortedUniqueMessages.splice(deletedMsg, 1);
        dispatch({type: 'messages', payload: sortedUniqueMessages});
    };

    //Callback for Prev and Next button
    function changePage(e) {
        const where = e.target.id;

        //Figure what page comes up  next
        if (where === "prev") {
            dispatch({type: 'prev'});
        } else {
            dispatch({type: 'next'});
        }
    };


    //Find total Number of pages
    const totalMessages = sortedUniqueMessages.length;
    const totalPages = (totalMessages%pageSize === 0) ? (totalMessages/pageSize) : Math.floor((totalMessages/pageSize))+1;

    //Identify the messages for this page.
    const startIndex = (currentPage-1)*pageSize;
    const endIndex = startIndex + pageSize;
    const currPageMessages = sortedUniqueMessages.slice(startIndex, endIndex);


    // Make a list of all the messages that belong to this page.
    const messageList = currPageMessages.map((msg, index) => {
        const timeStr = processTimeStamp(msg.sentAt);
        const key = `msg${index}`;
        return (
            // Allow deletion of messages
            <li key={key}>
                <p>
                    <label className="msgLabel">Sender: {msg.senderUuid}</label><br/>
                    <label className="msgLabel">Received at : {timeStr}</label><br/>
                    <label className="msgLabel">Content: {msg.content}</label><br/>
                    <button className="button" data-key={index} onClick={deleteMessage}>Delete Message</button>
                </p>
            </li>
        );
    });

    //Build the page number buttons
    let pageNumbers;
    if (totalPages > 0) {
        pageNumbers =
            <div className="pageNumber">
                <button className="button" id="prev" onClick={changePage} disabled={currentPage === 1}>Prev</button>
                    {(totalPages >= currentPage) ?
                        <label>Page {currentPage} of {totalPages}</label>
                        : null}
                <button className="button" id="next" onClick={changePage} disabled={currentPage >= totalPages}>Next</button>
            </div>
    } else {
        pageNumbers = null;
    }


    return (
        <div className="App">
            <h1>Chat Messages</h1>
            <div className="messageList">
                <ul>
                    {messageList}
                </ul>
            </div>
            {pageNumbers}
        </div>
    );

}

export default App;
