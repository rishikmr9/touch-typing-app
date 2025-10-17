export class MathUtils{
    static randomInt(min, max){
        return Math.floor(Math.random() * (max - min)) + min;
    }
}


const message = document.querySelector(".message");
const hideMessage = () => {
    message.classList.add("hide");
};

export function showMessage(text) {

    message.classList.remove("hide");
    message.innerText = text;

    
    const hideHandler = () =>{
        hideMessage();
        document.removeEventListener("click", hideHandler);
    }

    setTimeout(() => {
        hideMessage();
        document.removeEventListener("click", hideHandler);
    }, 10000)

    document.addEventListener("click", hideHandler);
    
}
