
import './App.css';
import {useState, useRef, useEffect} from 'react';

/* References
https://react.dev/reference/react/useEffect
Updating state based on previous state from an Effect 

Google Alarm sounds Free
https://developers.google.com/assistant/tools/sound-library/alarms
 */


function DisplayTimer() {
  const [timer, setTimer] = useState(25*60);
  const [lengthBreak, setLengthBreak ] = useState(5);
  const [lengthSession, setLengthSession] = useState(25);
  const [type, setType] = useState('1'); // 1 is Session, 2 is Break
  const intervalRef = useRef(0);
  
  const [flgStartTimer, setFlgStartTimer] = useState(false);
  let intervalID;


   useEffect(() => {
    const intervalID = setInterval(() => {
      //setTimer(c => c - 1); // ✅ Pass a state updater
      countDown()
    }, 1000);
    return () => clearInterval(intervalID);
  }, [flgStartTimer, timer]); // 
 


  const formattedTime = (time) => {

    let mins = Math.floor(time/60);
    let secs = time % 60;
    
    return (
      (mins < 10 ? "0" + mins : mins ) + 
      ":" +
      (secs < 10 ? "0" + secs : secs )
      );

  }
   
  function decrementLength(type) {
    
    if (type==='break') {
     
      if (lengthBreak>1) {
        setLengthBreak( lengthBreak-1) 
      }
      
    } else if (type==='session') {
      if ((lengthSession>1) && (timer > 60))  {
        setLengthSession(lengthSession-1)
        setTimer(timer - 60)
      }
      
    } 
  }

  function incrementLength(timerType) {
    
    if (timerType==='break') {
     
      if (lengthBreak<60) {
        setLengthBreak( lengthBreak + 1) 
      }
      
    } else if (timerType==='session') {
      if (lengthSession<60) {
        setLengthSession(lengthSession + 1)
        setTimer(timer + 60)
      }
      
    }
  }

  const reset = () => {
    intervalID = intervalRef.current;
    clearInterval(intervalID);
    
      var beep = document.getElementById("beep"); 
      beep.pause(); 
      beep.currentTime = 0; // rewind the audio to the beginning
    
    setFlgStartTimer((prev) => false);

    setType("1"); //Session
    setTimer(25*60);
    setLengthBreak(5);
    setLengthSession(25);
  }



  const setTo5andStart = (typeVal) => {
    setType(typeVal)
    setTimer(5);
    //setFlgStartTimer(true);
    setFlgStartTimer((prev) => {return (true)});
    startStop(flgStartTimer);
    

  }


  const startStop =(val) => {
  
    if (val === true) {
      intervalID = (setInterval(() => { countDown()  }, 1000)) 
      intervalRef.current = intervalID;
    } else {
      intervalID = intervalRef.current;
      clearInterval(intervalID)
    }
    
  }


  function countDown() {
    if (timer && flgStartTimer) {
      setTimer(prev => (prev===0) ? prev : prev - 1); // ✅ Pass a state updater
    }

    if (document.getElementById('time-left').innerText==="00:00") {
      document.getElementById('beep').play();
    };

    if (timer===0) {

      switchTimer()
    } 

 }

 const switchTimer = () => {
  
    if (timer===0) {


      if (type==="1") {
        //console.log('current type session: ' + type);
        // setTimer(lengthBreak*60);
        let beep = document.getElementById('beep');
        beep.play();
        setTimer(lengthBreak*60);
        
      } else  {

        setTimer(lengthSession*60);
      }
      setType((prev)=> {return (prev==='1') ? '2': '1'});
    }
  }

  const timerLabel = () => {
    return (
      (type==="1") ? "Session" : "Break"
    );
  }

  



  return (
    <div>
      <h1>25 + 5 (Pomodoro) Clock</h1>
      <div className='params'>
        <div>
          <h2 id="break-label" >Break Length</h2>
          <div className='params'>
            <button className='arrows'
                    id="break-decrement" 
                    onClick={() => decrementLength('break')}>
                    &#8595;
            </button>
            
            <h2 id="break-length">{ lengthBreak }</h2>
            <button className='arrows'
                    id="break-increment"
                    onClick={() => incrementLength('break')}>
                    &#8593;
            </button>

          </div>
      </div>

      <div>

        <h2 id="session-label">Session Length</h2>
        <div className='params'>
          <button className='arrows' 
                  id="session-decrement"
                  onClick={() => decrementLength('session')}>
                  &#8595;
          </button>
          <h2 id="session-length">{ lengthSession }</h2>
          <button className='arrows' 
                  id="session-increment"
                  onClick={() => incrementLength('session')}>
                  &#8593;
          </button>

        </div>

      </div>
    </div>


    <div className='timer-box'>
      <h1 id="timer-label">
        {/* Session */}
        {timerLabel()}
  
      </h1> 
      <h1 id="time-left">
        {formattedTime( timer )}
      </h1>
    </div>

    <div>
        
      <button className="controls" id="start_stop"onClick={() => {startStop(setFlgStartTimer(!(flgStartTimer)))}} >&#x23F5;&#x23F8;</button>

      <button className="controls" id="reset" onClick={() => reset()} >&#x1F504;</button>
      
    </div>


      <div>

{/*       <button onClick={() => (setTo5andStart("1"))}>
        set to 5sec and type to session (1)
      </button>
      <button onClick={() => (setTo5andStart("2"))}>
        set to 5sec and  type to break (2)
      </button> */}
      </div>


      <audio 
        className='clip' 
        id='beep' 
        src='https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg' 
        /* src = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg' */
        type="audio/mpeg" 
        preload="auto"
      ></audio>
      
     
    </div>
  ); 
}

// Pomodoro
function Pomodoro() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="timer">
          <DisplayTimer />
        </div>
        
      </header>
    </div>
  );
}

/* const el = document.getElementById("root");
ReactDOM.render(<Pomodoro />, el);  */

export default Pomodoro;

