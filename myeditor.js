window.onload=function()
{
    handleAutoSave();
    try 
    {
        let args=this.getUrlVars();
        console.log(args);
        if(args.listIndex!=undefined && args.chapterIndex!=undefined)
        {
            document.querySelector("#injectHtml").innerHTML = listIndeces[args.listIndex][args.chapterIndex].content;
            document.querySelector('.load-chapter-parent').style.display = "none";            
        }                
    } catch (error) {
        
    }
}

function insertTab() {
    if (!window.getSelection) return;
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    range.collapse(true);

    const span = document.createElement('span');
    span.appendChild(document.createTextNode('\t'));
    span.style.whiteSpace = 'pre';

    range.insertNode(span);

    // Move the caret immediately after the inserted span
    range.setStartAfter(span);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

let showHint = false;
let hintBox = document.querySelector('.suggestions');
let selectedNode = 0;
let currentWord = "null";


document.addEventListener("keyup",function(){
    //console.log(event.keyCode);
    changeFileName();
    if (event.keyCode == 27)
    {
        resetHintBox();
    }
    if (event.keyCode == 32) {
        showHintBox();
    }
    if (event.ctrlKey && event.keyCode == 32) {
        showHintBox();
    }
    handleHint(event);
})


document.addEventListener('keydown', function ()
{
   

    
    if (event.ctrlKey && event.keyCode == 79) {
        console.log("open dialog");
        event.preventDefault();
        openChapterDialog();
    }

    if (event.ctrlKey && event.keyCode == 83)
    {
        event.preventDefault();
        saveChapter();
    }

    if (event.ctrlKey && event.keyCode == 76) {
        console.log("list");
        event.preventDefault();
        insertHtmlAtCursor("<ol><li></li></ol>");
    }

    if (event.keyCode == 9) {
        insertTab();
        event.preventDefault();
    }

    if (event.ctrlKey && event.keyCode == 69) {
        console.log("align");
        event.preventDefault();
        if (window.getSelection().anchorNode.parentElement.style.textAlign == "center") {
            window.getSelection().anchorNode.parentElement.style.textAlign = "left"
        } else {
            window.getSelection().anchorNode.parentElement.style.textAlign = "center";
        }
    }

    if (event.ctrlKey && event.keyCode == 107) {
        console.log("font up");
        event.preventDefault();
        let fontSize = window.getComputedStyle(window.getSelection().anchorNode.parentElement).fontSize;
        fontSize = parseFloat(fontSize);
        fontSize++;
        window.getSelection().anchorNode.parentElement.style.fontSize = fontSize;
    }

    if (event.ctrlKey && event.keyCode == 109) {
        console.log("font down");
        event.preventDefault();
        let fontSize = window.getComputedStyle(window.getSelection().anchorNode.parentElement).fontSize;
        fontSize = parseFloat(fontSize);
        fontSize--;
        window.getSelection().anchorNode.parentElement.style.fontSize = fontSize;
    }



    if (event.ctrlKey && event.keyCode == 83) {
        console.log("saving");
        event.preventDefault();
        let output = `,{ title: "${document.querySelector('#chapter').value} ${document.querySelector('.subtitle').value} ",`;
        output += "content:" + '`' + document.querySelector('#injectHtml').innerHTML.trim() + "`}";
        console.log(output);
        copyToClipboard(output);
    }



if (showHint) {
        if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13) {
            event.preventDefault();
        }
    }

})

function handleAutoSave()
{
    //auto save after 1 minute
    setInterval(function()
    {
        saveChapter(0);
        
    },1000*60);
}


function saveChapter(args)
{
    //console.log("saving");
    let output = `{ title: "${document.querySelector('#chapter').value} ${document.querySelector('.subtitle').value} ",`;
    output += "content:" + '`' + document.querySelector('#injectHtml').innerHTML.trim() + "`}";
    console.log(output);
    localStorage.chapterData=output;
    if(args==undefined)
        copyToClipboard(output);
    
}



function changeColor()
{
    let range=window.getSelection().getRangeAt(0);
    let p=range.startContainer.parentElement;
    let original=p.innerHTML;
    original=original.substring(0,range.startOffset)+"<span class='myBold'>"+original.substring(range.startOffset,range.endOffset)+"</span>"+original.substring(range.endOffset);
    console.log(original);
    p.innerHTML=original;
    
}








let listIndeces=
[
    chapterContent_Spectrum,
    class_6_history,
    Class_12_History,
    chapterContent_Polity,
];
function openChapterDialog()
{
    document.querySelector('.load-chapter-parent').style.display = "block";
    document.querySelector('#chapters-list').innerHTML="";
    
    //text, list index
    prepareIndex("Spectrum Chapters",0);
    prepareIndex("Class 6 History",1);
    prepareIndex("Class 12 History",2);
    prepareIndex("Polity",3);

}

// load chapters of subjects
function prepareIndex(heading,listIndex)
{
    let article =document.createElement("article");
    article.innerHTML= `${heading}`;
    article.setAttribute("data-isChildInView","true")
    article.addEventListener("click",function()
    {
        //toggle children view
       console.log(this.getAttribute("data-isChildInView"));
        if(this.getAttribute("data-isChildInView")=="true")
        {
            this.setAttribute("data-isChildInView","false");
            changeViewOfChild("none")
        }else{
            this.setAttribute("data-isChildInView","true");
            changeViewOfChild("block")
        }
    });

    function changeViewOfChild(args)
    {
        // console.log(document.querySelectorAll('.child-of-'+heading))
        let targetClass=".child-of-"+heading.replace(/\s+/g,"-");
        // console.log(targetClass)
        // console.log(document.querySelectorAll(targetClass))
        document.querySelectorAll(targetClass).forEach(item=>{

            item.style.display=args;
        });
    }

    document.querySelector('#chapters-list').appendChild(article);
    listIndeces[listIndex].forEach((item, index) =>
    {
        let child=document.createElement("div");
        child.innerHTML=`${item.title}`;
        let childClass=heading.replace(/\s+/g,"-")
        child.setAttribute("class", `child-of-${childClass}`)
        child.addEventListener('click',function()
        {
            loadChapter(listIndex,index);
        });
        document.querySelector('#chapters-list').appendChild(child);
    });

}

function closeChapterDialog() {
    document.querySelector('.load-chapter-parent').style.display = "none";
}

function loadChapter(listIndex, chapterIndex)
{
    console.log(listIndex,chapterIndex);
    document.querySelector("#injectHtml").innerHTML = listIndeces[listIndex][chapterIndex].content;
    document.querySelector('.load-chapter-parent').style.display = "none";
    window.location=`index.html?listIndex=${listIndex}&chapterIndex=${chapterIndex}`;
}


function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function resetHintBox() {
    showHint = false;
    hintBox.style.display = "none";
    selectedNode = -1;
}
function showHintBox() {
    showHint = true;
    hintBox.style.display = "flex";
    // console.log('hint on')
    positionHintBox();
    selectedNode = -1;
}

function handleHint(event) {
    // select and insert hints
    if (showHint) {
        if (event.keyCode == 38) {
            //up
            event.preventDefault();
            if (document.querySelector('.selectedHint') != null) {
                document.querySelector('.selectedHint').className = '';
            }
            selectedNode--;
            if (selectedNode < 0) {
                selectedNode = hintBox.childNodes.length - 1;
            }
            // console.log(selectedNode);
            hintBox.childNodes[selectedNode].className = 'selectedHint';
        } else
            if (event.keyCode == 40) {
                //down
                event.preventDefault();
                if (document.querySelector('.selectedHint') != null) {
                    document.querySelector('.selectedHint').className = '';
                }
                selectedNode++;
                if (selectedNode >= hintBox.childNodes.length) {
                    selectedNode = 0;
                }
                // console.log(selectedNode);
                hintBox.childNodes[selectedNode].className = 'selectedHint';
            } else
                if (event.keyCode == 13) {
                    if (document.querySelector('.selectedHint') == null) {
                        //enter press when hint is on and now hint selected

                        showHint = false;
                        hintBox.style.display = "none";
                    } else {
                        event.preventDefault();

                        //use this word
                        let wordToInsert = document.querySelector('.selectedHint').innerText.trim();
                        insertHint(wordToInsert, currentWord);
                        showHint = false;
                        hintBox.style.display = "none";
                    }
                }
                else {
                    //words
                    currentWord = getCurrentWord();
                    if (currentWord.length > 0)
                    {
                        loadHintsInHintBox();

                    } else {
                        hintBox.style.display = "none";
                    }
                }
    }
}


function loadHintsInHintBox()
{
let words=document.querySelector('.editor').innerText.split(/\n| /);
let u=[...new Set(words)];
let html = '';
words=u;
words.forEach(item=>
{
    if(item.toLocaleLowerCase().indexOf(currentWord.toLocaleLowerCase())!=-1)
    {
        html += `<li>${item}</li>`;
    }
});


if (html.length > 0) {
        hintBox.innerHTML = html;
        hintBox.style.display = "flex";
        positionHintBox();
    } else {
        hintBox.style.display = "none";
    }
}

function handleDataFromGoogle(data) {
    let html = '';
    // console.log('all words=' + words)
    let limit = 5;
    data[1].forEach((item, index) => {
        if (index <= limit) {
            // console.log(item);
            html += `<li>${item}</li>`;
        }
    });
    if (html.length > 0) {
        hintBox.innerHTML = html;
        hintBox.style.display = "flex";
        positionHintBox();
    } else {
        hintBox.style.display = "none";
    }
}

function positionHintBox()
{
    let p=window.getSelection().getRangeAt(0).startContainer.parentElement;
    if(p!=undefined || p!=null)
    {
        let calc=p.getBoundingClientRect();
        //console.log(p)
        hintBox.style.top=(calc.y+calc.height)+'px';

    }
}

function changeFileName() {
    document.querySelector("#chapter").setAttribute("value", document.querySelector("#chapter").value.trim());
    document.querySelector(".subtitle").setAttribute("value", document.querySelector(".subtitle").value.trim());
    document.querySelector("#title").innerHTML = document.querySelector("#chapter").value + " " + document.querySelector(".subtitle").value
}


function isAlphanumeric(char) {
    return "0123456789abcdefghijklmnopqrstuvwxyz@#$%^&*()_-+{}[]".indexOf(char) > -1;
}
function getCurrentWord() {

    let currentWord = "";
    let range = window.getSelection().getRangeAt(0);
    let wholeText = range.endContainer.wholeText.toString();
    let pos = range.endOffset;
    // console.log(pos, wholeText, wholeText.length);
    if (wholeText.length > 0) {
        if (pos == 0) {
            //cursor at 0 and next is a char
            if (isAlphanumeric(wholeText[pos + 1])) {
                //then current word is 0 to space
                // console.log("start");
                currentWord = wholeText.substring(0, wholeText.indexOf(" "));
            }
        }
        if (pos == wholeText.length) {
            //cursor at end of string
            // console.log("end")
            if (isAlphanumeric(wholeText[pos - 1])) {
                //check if left of cursor is a char
                currentWord = wholeText.substring(wholeText.lastIndexOf(" "), pos);
            }
        }
        if (pos < wholeText.length && pos > 0) {
            //pos is between wholetext
            if (isAlphanumeric(wholeText[pos - 1]) && wholeText[pos] == " ") {
                // console.log('testign -1 +1',wholeText[pos-1],wholeText[pos])
                // //abc abc| abc
                currentWord = wholeText.substring(0, pos);
                currentWord = currentWord.substring(currentWord.lastIndexOf(" ") + 1, pos);

            } else if (isAlphanumeric(wholeText[pos]) && wholeText[pos - 1] == " ") {
                //abc |abc abc
                // console.log('not working')
                currentWord = wholeText.substring(pos, wholeText.indexOf(" ", pos));
            } else if (isAlphanumeric(wholeText[pos]) && isAlphanumeric(wholeText[pos - 1])) {
                //abc abc a|b
                //abc abc abc   
                //console.log('wokring')
                let a = wholeText.substring(0, pos);
                let b = wholeText.substring(pos, wholeText.length);
                let nextspace = b.indexOf(" ");
                if (nextspace == -1) {
                    //last word no space
                    currentWord = a.substring(a.lastIndexOf(" ") + 1) + b;
                } else {
                    currentWord = a.substring(a.lastIndexOf(" ") + 1) + b.substring(0, b.indexOf(" "));

                }
            }
        }
        //console.log(currentWord);
    }
    return currentWord.trim();
}

function insertHtmlAtCursor(html) {
    var sel, range, node;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = window.getSelection().getRangeAt(0);
            node = range.createContextualFragment(html);
            range.insertNode(node);
        }
    }
}

function insertHint(newWord, oldWord) {
    let range = window.getSelection().getRangeAt(0);
    console.log(range);
    let parent = range.endContainer.parentElement;
    let wholeText = range.endContainer.wholeText.toString();

    //hello he|llo world
    wholeText = wholeText.replace(oldWord, newWord);
    //let insert=wholeText.substring(0, range.endOffset - word.length) + "" + html+" "+wholeText.substring(range.endOffset+word.length,wholeText.length);

    parent.innerText = wholeText;

    //set cursor
    range.setStart(parent.childNodes[0], parent.innerText.length);
    range.collapse(true);
}


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}