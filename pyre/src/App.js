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
<SignOut/>
<h1>Welcome to Pyre Chat</h1>
<p>Pyre Chat is a place where you can promote yourself, network with others, or simply lurk for fun!</p>
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
        console.log("SignOut")
        return auth.currentUser && (
            <button onClick={() => auth.signOut()}>Sign Out</button>
            )
      };
  SignOut();
  
      function ChatRoom(){

        const dummy = useRef();
        const messagesRef= firestore.collection('messages');
        const query = messagesRef.orderBy('createdAt').limit(25);
        const[messages]=useCollectionData(query, {idField: 'id'});
        const [formValue, setFormValue ] = useState('');

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

        return(
          <>
          <main>
          {messages && messages.map(msg=> <ChatMessage key={msg.id} message={msg}/>)}
          
          <span ref={dummy}> </span>
          </main>
        <form onSubmit={sendMessage}>
<input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Talk to me"/>
<button type ="submit" disabled={!formValue}>Submit</button>
        </form>
        </>
        )
      }


            function ChatMessage(props){
              const {text, uid, photoURL} = props.message;

              const messageClass = uid === auth.currentUser.uid ? `sent` : `received`;
              console.log("It WOrks")
              return (<>
              <div className={`message ${messageClass}`}>
<img src={photoURL} alt='Profile Pic'/>
                <p>{text}</p>

              </div>
              </>
              )
          }
    

export default App;
