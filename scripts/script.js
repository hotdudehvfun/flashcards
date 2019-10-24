document.addEventListener("DOMContentLoaded", function ()
{
    
    registerEvents();
});

registerEvents();

function registerEvents() {
    let timeTaken = 0, lastTimeStamp = 0;
    document.querySelectorAll("card").forEach(card => {
        card.onkeypress = function ()
        {
        
        }
        card.onclick = function () {
            timeTaken = Date.now() - lastTimeStamp;
            lastTimeStamp = Date.now();
            if (timeTaken < 500) {
                this.setAttribute("contenteditable", "true");
            }
        }

        card.onblur = function () {
            this.setAttribute("contenteditable", "false");
            //add content if blur on input
            if (this.id == "input") {
                if (this.innerText.trim().length > 0) {
                    this.id = "";
                    document.querySelector("#content").innerHTML += this.outerHTML;
                    this.innerHTML = "<div></div>";
                    this.style.display = "none";
                    this.id = "input";
                } else {
                    console.log("nothing to save");
                }
            }
            saveData();
        }
    })
}

document.querySelector("#add-content").onclick = () =>
{
    let input = document.querySelector("#input");
    input.style.display = "block";
    input.setAttribute("contenteditable", "true");
};





loadData = (key) =>
{
    if (key == undefined) {
        //simply load any chapter
        let keys = getLocalKeys();
        if (keys.length > 0)
        {
            if (localStorage.getItem(keys[0]) != null) {
                //load key into body
                document.querySelector("#content").innerHTML = localStorage.getItem(keys[0]);
            }
        }
    } else {
        if (localStorage.getItem(key) != null) {
            //load key into body
            document.querySelector("#content").innerHTML = localStorage.getItem(key);
        }
    }

}
saveData = () =>
{
    let key = document.querySelector("chapter").innerHTML.trim();
    let value = document.querySelector("#content").innerHTML.trim();
    localStorage.setItem(key, value);
    //register events again
    registerEvents();
}

getLocalKeys = () => {
    let keys = [];
    Object.keys(localStorage).forEach(function (key) {
        keys.push(key);
    });
    return keys;
}

loadPageTitles=()=>
{
    let html="";
    getLocalKeys().forEach(key=>
    {
        html+=` <page-link>${key}</page-link>`;
    });
    document.querySelector("page-viewer").innerHTML=html;
}