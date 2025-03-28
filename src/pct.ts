import {pinky} from "./pinky.ts";
import {ccode} from "./ccode.ts";

document.addEventListener('DOMContentLoaded', function():void {
    let scripts: HTMLCollectionOf<HTMLScriptElement>;
    scripts = document.scripts;
    for(let i:number = 0; i < scripts.length; i++){
        const script:HTMLScriptElement = scripts[i]
        if (script.type === 'text/pinky') {
            pinky(script.text)
        } else if (script.type === 'text/ccode') {
            ccode(script.text)
        }
    }
});