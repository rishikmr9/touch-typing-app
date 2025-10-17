export default class LetterBox{


    /**
     * Represent the state of box and contains css class for that state
     */
    static state = {
        none: "",
        current: "letters__box--current",
        wrong: "letters__box--wrong",
        correct: "letters__box--correct"
    }

    constructor(){
    }





    /**
     * change the state of letter box
     * @param {LetterBox.state} state state to change
     * @param {HTMLElement} letterBox the html element of letter box
     */
    static changeState(letterBox, state){
        letterBox.classList.add(state);
    }




    /**
     * create a l
     * @param {string} letter letter that to show in the box
     * @returns 
     */
    static renderLetterBox(letter){
        const letterBox = document.createElement("div");
        letterBox.classList.add("letters__box");
        letterBox.innerText = letter;
        return letterBox;
    }
}