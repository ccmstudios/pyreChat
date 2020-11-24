import React, {useRef,useState} from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


import {useAuthState} from 'react-firebase-hooks/auth';
import { useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCjtCakqmwTk_01gzPCte21hcAdYT4wvuM",
  authDomain: "pyre-chat.firebaseapp.com",
  databaseURL: "https://pyre-chat.firebaseio.com",
  projectId: "pyre-chat",
  storageBucket: "pyre-chat.appspot.com",
  messagingSenderId: "383566845690",
  appId: "1:383566845690:web:d9629c8d92b98612d75b43",
  measurementId: "G-PZF51ZXT0E"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user]=useAuthState(auth);
  return (
    <div className="App">
      <header>

      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  )
};
function SignIn(){
  const signInWithGoogle =()=>{
    
      const provider =new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
  }
  
          return(
          <button onClick={signInWithGoogle}>Sign In with Google</button>
          )
      }
      function SignOut(){
          return auth.currentUser && (
              <button onClick={() => auth.SignOut()}>Sign Out</button>
          )
      };
  
      function ChatRoom(){

        const dummy = useRef();
        const messagesRef= firestore.collection('messages');
        const query = messagesRef.orderBy('createdAt').limit(25);
        const [ formValue, setFormValue ] = useState('');

const sendMessage = async(e) => {
  e.preventDefault();
  const { uid, photoURL } = auth.currentUser;

  await messagesRef.add({
    text:formValue,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    uid,
    photoURL
  })
setFormValue('');
dummy.current.scrollIntoView({behavior: 'smooth'});
}

        const[messages]=useCollectionData(query, {idField: 'id'});
        return(
          <>
          <main>
          {messages && messages.map(msg=> <ChatMessage key={msg.id} message = {msg}/>)}
          
          <div ref={dummy}> </div>
          </main>
        <form onSubmit={sendMessage}>
<input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
<button type ='submit'>Send</button>
        </form>
        </>
        )
      }


            function ChatMessage(props){
              const {text, uid, photoURL} = props.message;

              const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
              return (
              <div className={`message ${messageClass}`}>
<img src={photoURL}/>
                <p>{text}</p>

              </div>
              )
          }
    

export default App;
