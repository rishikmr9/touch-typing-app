import { Session } from "./session.js";

export class Levels{

    static async fetchLevel(){
        try {

            const api = await fetch("/levels/levels.json");
            const res = await api.json();
            
            
            return res.levels;
            
        } catch (error) {
            console.log(error);
            return false;
            
        }

    }




    static renderLevels(){
        // reset section section = null;
        const section = document.querySelector(".section.letters");
        section.innerHTML = null;

        this.fetchLevel().then(levels => {

           levels.forEach(levelData => {

            let levelBox = this.renderLevelBox(levelData);
            section.appendChild(levelBox);

           }); 

        });


    }





    static renderLevelBox(levelData){

        const box = document.createElement("div");

        box.classList.add("level-box");
        box.innerText = levelData.practiseLetters[0] + " " + levelData.practiseLetters[1];

        box.addEventListener("click", (e) => {
            e.preventDefault();
            new Session(levelData.level);
            console.log(levelData.level);
            
        });

        return box;
    }
}