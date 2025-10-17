import { MathUtils, showMessage } from "./utils.js";
import { TIME } from "./constants.js";


import LetterBox from "./letterBox.js";
import { Levels } from "./levels.js";




class Stats{
    errors = 0;
    accuracy = 0;
    speed = 0;
    time = 0; //session time in min

    /**
     * calculate all stats
     * @param {number} lettersAmount total number of letters typed
     */
    calculate(lettersAmount){
        let correctLetters = lettersAmount - this.errors;

        /* speed */
        // avg word is five letters so divide by 5 to get amount of words
        // subtract errors from letters amount
        let words = Math.round((correctLetters) / 5);
        this.speed = Math.round(words / this.time);

        /* accuracy */
        this.accuracy = Math.round((correctLetters/lettersAmount) * 100);
        

    }




    /**
     * calculate time spent to complete the session
     * @param {number} timeStart starting time date object
     * @param {number} timeEnd ending time date object
     */
    calculateTime(timeStart, timeEnd){

        // get time in min
        this.time = (timeEnd.getTime() - timeStart.getTime()) / TIME.MILLISEC_PER_MIN;
    
        console.log(this.time);
        
    }

}


export class Session{

    lettersAmount = 10;

    //static current letter index
    currentLetterI = 0;
    /**
     * represent the letters and their state in the practise session
     */
    level = null;
    practiseLetters = [];
    letters = [
        {
            name: "f",
            state: LetterBox.state.current
        }
    ];
    

    stats = new Stats();



    constructor(level){

        Levels.fetchLevel().then(levels => {
            
            if(!levels){console.log("something went wrong!"); return; }
            this.level = levels[level];
            
            
            this.preparePractiseLetters(levels);

            this.renderLetters();
            this.start();
            
        });
        
    }




    preparePractiseLetters(levels){
        
        for (let i = 0; i < this.level.level - 1; i++) {
            
            this.practiseLetters.push(...levels[i].practiseLetters);
            console.log(this.practiseLetters);    
            
        }

    }

    


    






    /**
     * render letterbox elements with random letters
     */
    renderLetters(){

        const lettersSection = document.querySelector(".section.letters");
        // reset first
        lettersSection.innerHTML = null;


        for (let i = 0; i < this.lettersAmount; i++) {

            // get a random index of letter from practiseLetters array
            let randomIndex = MathUtils.randomInt(0, this.practiseLetters.length);
            

            let randomLetter = this.practiseLetters[randomIndex];
            this.letters[i] = {
                name: randomLetter,
                state: LetterBox.state.none
            };

            
            // add random letter
            lettersSection.appendChild(LetterBox.renderLetterBox(randomLetter));
        }
  
    }





    /**
     * render stats section
     */
    renderStats(){
        const lettersSection = document.querySelector(".section.letters");
        lettersSection.innerHTML = null;
        let speed = this.stats.speed;
        let accuracy = this.stats.accuracy;
        let intensitySpeed = speed < 30 ? "low" : speed < 50 ? "mid" : "high";
        let intensityAccuracy = accuracy < 30 ? "low" : accuracy < 50 ? "mid" : "high";


        const html = `
        <div class="stats container container-vr">

            <div class="container">
                <div class="stats__data container container-vr">
                    <h2>speed</h2>
                    <span class="stats__data-value intensity-${intensitySpeed} speed">${this.stats.speed}</span>
                </div>

                <div class="stats__data container container-vr">
                    <h2>accuracy</h2>
                    <span class="stats__data-value intensity-${intensityAccuracy} accuracy">${this.stats.accuracy}</span>
                </div>
            </div>

            <button class="btn back">go back</button>

        </div>
        `;
        
        lettersSection.innerHTML = html;

        document.querySelector(".btn.back")
        .addEventListener("click", () => {
            // new Levels();
            console.log("click");
            Levels.renderLevels();
            
        });

    }





    start(){

        
        let letterBoxElements = document.querySelectorAll(".letters__box");
        LetterBox.changeState(letterBoxElements[this.currentLetterI], LetterBox.state.current);
        let timeStart = new Date();

        
        const handler = e => {

            let currentLetter = this.letters[this.currentLetterI];
            let currentLetterBoxElement = letterBoxElements[this.currentLetterI];


            let correct = e.key == currentLetter.name;

            if(correct){
                currentLetter.state = LetterBox.state.correct;
                LetterBox.changeState(currentLetterBoxElement, currentLetter.state);
            }  
            else{
                currentLetter.state = LetterBox.state.wrong;
                this.stats.errors++;
                LetterBox.changeState(currentLetterBoxElement, currentLetter.state);
            }
        
            if(this.currentLetterI == (this.lettersAmount - 1)){
                this.stats.calculateTime(timeStart, new Date());
                this.end(handler);
                return;
            }


            this.currentLetterI++;

            if(this.currentLetterI <= (this.lettersAmount - 1)){
                LetterBox.changeState(letterBoxElements[this.currentLetterI], LetterBox.state.current);
            }
            
        }

        document.addEventListener("keypress", handler);


    }

    end(handler){
        this.stats.calculate(this.lettersAmount);
        document.removeEventListener("keypress", handler);
        this.renderStats();
    }


}