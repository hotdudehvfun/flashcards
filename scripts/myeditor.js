let fontSize=100;
let showHint = false;
let hintBox = document.querySelector('.suggestions');
let selectedNode = 0;
let currentWord = "null";
window.onload=function()
{
    handleAutoSave();
    try 
    {
        let args=this.getUrlVars();
        //console.log(args);
        if(args.listIndex!=undefined && args.chapterIndex!=undefined)
        {
            document.querySelector("#injectHtml").innerHTML = listIndeces[args.listIndex][args.chapterIndex].content;
            document.querySelector('.load-chapter-parent').style.display = "none";            
        }                
    } catch (error) {
        
    }
    prepareChapterDialog();
    cleanEditor();
    update_word_count()
}

function cleanEditor()
{
    document.querySelectorAll("div").forEach(item=>{
        item.removeAttribute("style");
    })
    
    document.querySelectorAll("span").forEach(item=>{
        item.removeAttribute("style");
    })
    
    document.querySelectorAll("li").forEach(item=>{
        item.removeAttribute("style");
    })
    
    document.querySelectorAll("ol").forEach(item=>{
        item.removeAttribute("style");
    })
    closeChapterDialog();
}


function insertTab(arg)
{

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


document.addEventListener("keypress",function()
{
    
});

document.addEventListener("keyup",function(){
    console.log(event.keyCode);
    changeFileName();
    //escape key 
    if (event.keyCode == 27)
    {
        resetHintBox();
    }

    //ctrl + space
    if ( (event.ctrlKey && event.keyCode == 32) || (event.keyCode>=65 && event.keyCode<=90) || (event.keyCode>=48 && event.keyCode<=57))
    {
        loadHintsInHintBox()
    }

    update_info_bar(event)
    //highlight_current_row(event)
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

    if (event.keyCode == 9)
    {
        //only add tab if inside editor
        let id=(document.activeElement.id)
        if(id=="editor")
        {
            event.preventDefault();
            insertTab("up");
        }
    }
    if (event.shiftKey && event.keyCode == 9)
    {
        insertTab("down");
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

    if (event.ctrlKey && event.keyCode == 107)
    {
        console.log("font up");
        event.preventDefault();
        fontSize++;
        document.querySelector(".editor").style.fontSize=fontSize+"%";
    }

    if (event.ctrlKey && event.keyCode == 109)
    {
        console.log("font down");
        event.preventDefault();
        fontSize--;
        document.querySelector(".editor").style.fontSize=fontSize+"%";
    }



    if (event.ctrlKey && event.keyCode == 83) {
        console.log("saving");
        event.preventDefault();
        let output = `,{ title: "${document.querySelector('#chapter').value} ${document.querySelector('.subtitle').value} ",`;
        output += "content:" + '`' + document.querySelector('#injectHtml').innerHTML.trim() + "`}";
        console.log(output);
        copyToClipboard(output);
    }


    if (hintBox.innerHTML.length>0)
    {
        if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode==13)
        {
                event.preventDefault();
        }
    }
    handleHint(event); 

    


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
    
    //cleanEditor();
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
    class_11_old_history
];

function prepareChapterDialog()
{
    //also in listIndeces name of array
    //text, list index
    prepareIndex("Spectrum Chapters",0);
    prepareIndex("Class 6 History",1);
    prepareIndex("Class 12 History",2);
    prepareIndex("Polity",3);
    prepareIndex("Class 11 History Old",4);
    
    //default load
    loadChatersOfSubject("Spectrum Chapters",0);
}

// load chapters of subjects
function prepareIndex(heading,listIndex)
{
  
    let tabs=document.querySelector("#tabs");
    //console.log(tabs)
    let article =document.createElement("article");
    article.innerHTML= `${heading}`;
    article.setAttribute("data-isChildInView","true")
    article.addEventListener("click",function()
    {
        loadChatersOfSubject(heading,listIndex);        
    });
    tabs.appendChild(article);
}


function loadChatersOfSubject(heading,listIndex)
{
    document.querySelector('#tab-content').innerHTML="";
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
        document.querySelector('#tab-content').appendChild(child);
    });

    //update active
    if(document.querySelector(".active")!=null)
        document.querySelector(".active").className=""; 
        
    document.querySelector("#tabs").children[listIndex].setAttribute("class","active");
    

}


function closeChapterDialog()
{
    document.querySelector('.load-chapter-parent').style.display = "none";
}


function openChapterDialog()
{
    document.querySelector('.load-chapter-parent').style.display = "block";
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
    hintBox.innerHTML=""
    selectedNode = -1;
}
function showHintBox()
{
    showHint = true;
    hintBox.style.display = "flex";
    console.log('hint on')
    positionHintBox();
    selectedNode = -1;
    
}

function handleHint(event)
{
    // allow selection of hints if there are hints
    if (hintBox.childNodes.length>0)
    {
        if (event.keyCode == 38)
        {
            //up
            //remove previous selected hint if any
            if (document.querySelector('.selectedHint') != null)
            {
                document.querySelector('.selectedHint').className = '';
            }
            selectedNode--;
            if (selectedNode < 0)
            {
                selectedNode = hintBox.childNodes.length - 1;
            }
            // console.log(selectedNode);
            hintBox.childNodes[selectedNode].className = 'selectedHint';
        }
        
        if (event.keyCode == 40)
        {
            //down
            if (document.querySelector('.selectedHint') != null) {
                document.querySelector('.selectedHint').className = '';
            }
            selectedNode++;
            if (selectedNode >= hintBox.childNodes.length) {
                selectedNode = 0;
            }
            // console.log(selectedNode);
            hintBox.childNodes[selectedNode].className = 'selectedHint';
        }

        if (event.keyCode == 13)
        {
            //enter is pressed
            if (document.querySelector('.selectedHint') !=null && selectedNode!=-1)
            {
                //use this word
                let wordToInsert = document.querySelector('.selectedHint').innerText.trim();
                insertHint(wordToInsert, getCurrentWord());
                console.log("inserting word",wordToInsert);                
            }        
            hintBox.style.display = "none";
            hintBox.innerHTML="";
            selectedNode=-1;
        }
    }
}


function loadHintsInHintBox()
{
    let currentWord=getCurrentWord().trim();
    if(currentWord.length>0)
    {

        let words=document.querySelector('.editor').innerText.split(/\n| /);
        let u=[...new Set(words)];
        words=u;
        //remove current word from list
        //console.log(currentWord)
        let removePos=words.indexOf(currentWord)
        if(removePos!=-1)
            words.splice(removePos,1);
        
        //filter words
        let hint_array=[]
        words.forEach(item=>
        {
            let index_of=item.toLocaleLowerCase().indexOf(currentWord.toLocaleLowerCase());
            if(index_of!=-1)
            {
                hint_array.push({rank:index_of,text:item})
            }
        });
    
        hint_array.sort(function(a,b){return (a.rank-b.rank)})
        console.log(hint_array)
        let html = '';
        hint_array.forEach(item=>
        {
            html+=`<li>${item.text}</li>`;
        })
        //if there are hints to show
        if (html.length > 0)
        {
            hintBox.innerHTML = html;
            hintBox.style.display = "flex";
            //be default select first child
            selectedNode=0;
            hintBox.childNodes[selectedNode].className = 'selectedHint';
            positionHintBox();
            //console.log(html)
        }else
        {
            hintBox.style.display = "none";
            hintBox.innerHTML="";
        }
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
            range.collapse(true);
        }
    }
}

function insertHint(newWord, oldWord)
{
    let range = window.getSelection().getRangeAt(0);
    console.log(range);
    
    let text=range.endContainer;
    let offset=range.endOffset;
    console.log(text,offset)
    
    // this is text to insert hint
    //0-pos- + newword + pos-end
    
    //a=0-offset-oldword len
    //b=new word
    //c= offset - end

    //line=a + b + c
    let str=text.wholeText
    let a=str.substring(0, offset-oldWord.length) 
    let b=newWord
    let c=str.substring(offset)
    console.log(a,b,c)
    str=a+b+c;
    range.endContainer.nodeValue=str;

    // let parent = range.endContainer.parentElement;
    // let wholeText = range.endContainer.wholeText.toString();

    // //hello he|llo world
    // wholeText = wholeText.replace(oldWord, newWord);
    // //let insert=wholeText.substring(0, range.endOffset - word.length) + "" + html+" "+wholeText.substring(range.endOffset+word.length,wholeText.length);

    // parent.innerText = wholeText;

    //set cursor
    range.setStart(range.endContainer.parentElement.childNodes[0], (a+b).length);
    range.collapse(true);
}


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function handleNewChapter()
{
    window.location="../index.html";
}

var readMode=true;
function handleReadMode()
{
    readMode=!readMode;
    document.querySelector(".editor").setAttribute("contenteditable",readMode);
    document.querySelector("#read_mode").innerHTML="Editable:"+readMode;
}

var dark_theme=false;
function toggleTheme()
{
    dark_theme=!dark_theme;
    document.querySelector("body").classList.toggle("dark_theme");
    document.querySelector("#toggle_theme").innerHTML="Dark:"+dark_theme;
}



function update_info_bar(event)
{
    if(event.target.id=="editor")
    {

        let range = window.getSelection().getRangeAt(0);
        let tree=document.querySelector("#tree");
        let p=range.endContainer;
        tree.innerHTML=""
        while(p.parentElement.className!="editor")
        {
            tree.innerHTML+=p.parentElement.tagName+">";
            p=p.parentElement;
        }
        tree.innerHTML+="editor";
        
        update_word_count();
    }
}

function update_word_count()
{
    //word count
    document.querySelector("#word_count").innerHTML="wc: "+document.querySelector("#editor").innerText.trim().split(/\n| /).length
}

function highlight_current_row(event)
{
    if(event.target.id=="editor" && hintBox.innerHTML=="")
    {

        let range = window.getSelection().getRangeAt(0);
        //console.log(range)
        let p=range.endContainer;
        if(document.querySelector(".highlight_row")!=null)
           document.querySelector(".highlight_row").className=""
    
        
        if(p.id!="editor")
        {
            if (p.nodeType==3)
            {
                p.parentElement.className="highlight_row"
            }else
            {
                p.className="highlight_row"
            }
        }
        //console.log(p)
    }
}