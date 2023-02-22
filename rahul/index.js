// const arrayOfFiles = document.querySelectorAll('.square')
// console.log(arrayOfFiles.length);

const arrayOfFiles = document.querySelectorAll('.files')
const filesNameArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

let fileNumber = 0
for (const i of arrayOfFiles) {
    let counter = 1
    for (const el of i.children) {
        el.setAttribute('id', filesNameArray[fileNumber] + counter)
        // console.log(el);
        counter++
    }
    fileNumber++
}

for (const i of arrayOfFiles) {
    // console.log(i.children);
}

const allSquares = document.getElementsByClassName('square')
const clickedElements = []

for (const x of allSquares) {
    x.addEventListener('click', function () {
        console.log(clickedElements);

        const idOfElement = x.getAttribute('id')
        const innerHtmlOfElement = document.getElementById(idOfElement).innerHTML
        if (clickedElements.length > 0) {
            clickedElements[0].removeAttribute('style')
            clickedElements.length = 0
        }
        console.log(x);
        if (innerHtmlOfElement.includes('black') || innerHtmlOfElement.includes('white')) {
            // console.log('change');
            document.getElementById(idOfElement).style.backgroundColor = '#f6f669'
            clickedElements.push(x)
        }
    })
}

const arrayOfPawn = []

for (const i of filesNameArray) {
    arrayOfPawn.push(document.getElementById(i + 2))
}
for (const i of filesNameArray) {
    arrayOfPawn.push(document.getElementById(i + 7))
}
for (const i of arrayOfPawn) {
    i.addEventListener('click', () => {
        const clickedElement = i
        const currentId = i.getAttribute('id')
        // console.log(currentId);
        let change = parseInt(currentId[1])
        const stepsSquare = []
        for (let i = 0; i < 2; i++) {
            change++
            stepsSquare.push(document.getElementById(currentId[0] + change))
        }
        console.log(stepsSquare);
        highlightCircle(stepsSquare)
    })
}

const highlightCircle = function ([first, second]) {
    let circle = document.createElement('div')
    let circle2 = document.createElement('div')
    circle.setAttribute('class', 'circle')
    circle2.setAttribute('class', 'circle')
    first.appendChild(circle)
    second.appendChild(circle2)
    console.log(first, second);
    first.classList.add('flex')
    second.classList.add('flex')
}