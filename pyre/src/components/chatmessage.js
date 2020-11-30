import react from 'react'

function ChatMessage(props){
    const {text, uid} = props.message;
    return <p>{text}</p>
}