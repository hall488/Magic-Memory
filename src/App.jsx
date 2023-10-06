import { useState, useEffect} from 'react'
import './App.css'
import Hand from './Hand';
import logo from "./assets/mtg-logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

library.add(faCircleInfo);

function App() {

  let [setCode, setSetCode] = useState(""); 
  let [sets, setSets] = useState([]);


  useEffect(() => {

    let vals = []

    requestSets().then(response => {
    
      response.sets.forEach(s => {
        if("booster" in s) {
          vals.push({code: s.code, name:s.name})
        }
      }); 

      setSets(vals);
      
    });

  }, []);

  

  const requestSets = async () => {
    const response = await fetch(
      `https://api.magicthegathering.io/v1/sets`,
      {
        mode: "cors",
      },
    );
  
    const json = await response.json();
  
    return json;
  }

  function Sets() {    

    const handleChange = (e) => {
      setSetCode(e.target.options[e.target.selectedIndex].getAttribute("value"));
    }
    
    return (
      <select placeholder="Select Set" value={setCode} onChange={handleChange}>
        <option key="default" value="default">Select Set</option>
        {sets.map(o => <option key={o.code} value={o.code}>{o.name}</option>)}
      </select>
    )
   
  }

  function Info() {

    let [show, setShow] = useState(false);

    const toggleInfo = () => {
      setShow(!show);
    }

    return(
      <>
        <FontAwesomeIcon icon="circle-info" onMouseEnter={toggleInfo} onMouseLeave={toggleInfo} onTouchStart={toggleInfo} />
        <div className="info-text" style={{display: show ? "flex" : "none"}}>
          Game Rules: Click as many cards as you can without clicking the same card twice!
          Change MTG sets with the dropdown menu!
        </div>
      </>
    )
  }

  return (
    <>
      <img className="mtg-logo" src={logo}/>
      <div style={{position: "relative", display: "flex", gap: "8px"}}>
        <Sets/>
        <Info/>
      </div>
      <Hand setCode={setCode}/>
      
    </>
  )
}

export default App
