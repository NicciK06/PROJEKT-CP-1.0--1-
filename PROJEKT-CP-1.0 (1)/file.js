

   /*
    var text = document.getElementById("text");
    var words = text.innerHTML.split(" ");
    text.innerHTML = "";
    */
    
  
    /*
    for (var i = 0; i < words.length; i++) {
      (function(index) {
        setTimeout(function() {
          text.innerHTML += words[index] + " ";
        }, i * 400); // 
      })(i);


    }
    */
    















  //typeWriter('IN THIS GAME, THE GOAL IS TO SHOOT DOWN ALL THE DRONES', "text");



  //typeWriter('12345678', "text2");

  function setupTypewriter(t) {
    var HTML = t.innerHTML;

    t.innerHTML = "";

    var cursorPosition = 0,
        tag = "",
        writingTag = false,
        tagOpen = false,
        typeSpeed = 1, // higher number = slower
    tempTypeSpeed = 0;

    var type = function() {
    
        if (writingTag === true) {
            tag += HTML[cursorPosition];
        }

        if (HTML[cursorPosition] === "<") {
            tempTypeSpeed = 0;
            if (tagOpen) {
                tagOpen = false;
                writingTag = true;
            } else {
                tag = "";
                tagOpen = true;
                writingTag = true;
                tag += HTML[cursorPosition];
            }
        }
        if (!writingTag && tagOpen) {
            tag.innerHTML += HTML[cursorPosition];
        }
        if (!writingTag && !tagOpen) {
            if (HTML[cursorPosition] === " ") {
                tempTypeSpeed = 0;
            }
            else {
                tempTypeSpeed = ((Math.floor(Math.random() * (75.0 - 25.0) + 25.0) )/(100.0) * typeSpeed) + 50;
            }
            t.innerHTML += HTML[cursorPosition];
        }
        if (writingTag === true && HTML[cursorPosition] === ">") {
            tempTypeSpeed = (Math.random() * typeSpeed) + 50;
            writingTag = false;
            if (tagOpen) {
                var newSpan = document.createElement("span");
                t.appendChild(newSpan);
                newSpan.innerHTML = tag;
                tag = newSpan.firstChild;
            }
        }

        cursorPosition += 1;
        if (cursorPosition < HTML.length - 1) {
            setTimeout(type, tempTypeSpeed);
        }

    };


    return {
        type: type
    };

}

var typer = document.getElementById('typewriter');
typewriter = setupTypewriter(typewriter);
typewriter.type();




  




    
    





