

import { useState, useEffect} from 'react'
import './App.css'
import VanillaTilt from "vanilla-tilt";


function Hand({setCode}) {

    let [hand, setHand] = useState([]);
    let [loaded, setLoaded] = useState(false);
    let [clicked, setClicked] = useState([]);
    let [replay, setReplay] = useState(false);
    let [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        setLoaded(false);
        setGameOver(false);
        setClicked([]);

        if(setCode != "" && setCode != "default") {
            requestBooster(setCode).then(response => {

                let cards = [];

                response.cards.forEach(c => {
                    if(!cards.includes(c.name) && "imageUrl" in c) {
                        cards.push(c);
                    }
                });

                
                setHand(cards);

            })
        } else {
            setHand([]);
        }
    }, [setCode, replay]);

    useEffect(() => {
        const checkImage = (path) => {
            return new Promise(resolve => {
                let img = new Image();
                img.onload = () => resolve(img);
                img.src = path;
            });
        }

        Promise.all(
            hand.map(c => checkImage(c.imageUrl))
        ).then(response => {
                let lis  = document.querySelectorAll("li");
                for(let i = 0; i < response.length; i++) {
                    lis[i].innerHTML = "";
                    lis[i].append(response[i]);
                    
                    const isMobile = navigator.userAgentData.mobile;
                    
                    if(!isMobile) {
                        VanillaTilt.init((lis[i].children[0]), {
                            max: 15,
                            speed: 100,
                            scale: 1.1,
                        });
                    }
                }
            setLoaded(true);
        });
    }, [hand]);

    const requestBooster = async (set) => {
        const response = await fetch(
          `https://api.magicthegathering.io/v1/sets/${set}/booster`,
          {
            mode: "cors",
          },
        );
      
        const json = await response.json();
      
        return json;
      };

    function handleClick(e) {
        let cardName = e.currentTarget.getAttribute("data");
        if(clicked.length != hand.length && !clicked.includes(cardName)) {
            setClicked([...clicked, cardName]);
            var ul = document.querySelector('ul');

            for (var i = ul.children.length; i >= 0; i--) {
                ul.appendChild(ul.children[Math.random() * i | 0]);
            }
        } 

        if(clicked.length == hand.length - 1 || clicked.includes(cardName)) {
            setGameOver(true);
        }
        
    }

    function handleReplay(){
        setClicked([]);
        setReplay(!replay);
    }
      
    return (
        <div className="card-tray" style={{}}>
            <div>Score: {clicked.length} / {hand.length}</div>
            <ul style={{filter: (gameOver) ? "blur(2px)" : "none", display: loaded ? "flex" : "none", pointerEvents: gameOver ? "none" : "all"}}>
                {
            
                hand.map(c => {
                    return (
                        <li data={c.name} onClick={handleClick} key={hand.indexOf(c)}>
            
                        </li>
                    )
                })
            }</ul>
            <div style={{display: (!loaded && setCode != "default") ? "flex" : "none"}}>
                Loading...
            </div>
            <div style={{display: (gameOver) ? "flex" : "none"}} className="gameOverText">
                You {clicked.length == hand.length ? "Win" : "Lose"}!
                <button onClick={handleReplay}>Replay</button>
            </div>
        </div>
    )
}

export default Hand;