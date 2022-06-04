document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const column = 20
    const row0 = 0
    const row1 = 10
    const row2 = 2*row1
    const row3 = 3*row1
    const leftKey = 37
    const upKey = 38
    const rightKey = 39
    const downKey = 40
    const a = 65
    const s = 83
    const d = 68
    const q = 81
    const ee = 69
    let upcomingI = 0
    let timerId
    let score = 0
    const images = [
        'url(./assets/lightblue.png)', 
        'url(./assets/mediumblue.png)', 
        'url(./assets/darkorange.png)', 
        'url(./assets/gold.png)', 
        'url(./assets/limegreen.png)', 
        'url(./assets/mediumpurple.png)', 
        'url(./assets/tomato.png)',
        'url(./assets/white.png)'
    ]


    const scoreDisplay = document.querySelector('#score')
    const startButton = document.querySelector('#start-button')
    
    const iPiece = [
        [row0, row0+1, row0+2, row0+3],
        [row0, row1, row2, row3],
        [row0, row0+1, row0+2, row0+3],
        [row0, row1, row2, row3]
    ]

    const jPiece = [
        [row0, row1, row1+1, row1+2],
        [row0+2, row0+1, row1+1, row2+1], 
        [row1, row1+1, row1+2, row2+2],
        [row2, row2+1, row1+1, row0+1]
    ]

    const lPiece = [
        [row1, row1+1, row1+2, row0+2],
        [row0+1, row1+1, row2+1, row2+2], 
        [row2, row1, row1+1, row1+2],
        [row0, row0+1, row1+1, row2+1]
    ]

    const oPiece = [
        [row0, row1, row0+1, row1+1],
        [row0, row1, row0+1, row1+1],
        [row0, row1, row0+1, row1+1],
        [row0, row1, row0+1, row1+1]
    ]

    const sPiece = [
        [row1, row1+1, row0+1, row0+2],
        [row0+1, row1+1, row1+2, row2+2],
        [row2, row2+1, row1+1, row1+2],
        [row0, row1, row1+1, row2+1]
    ]

    const tPiece = [
        [row1, row1+1, row0+1, row1+2],
        [row0+1, row1+1, row1+2, row2+1],
        [row1, row2+1, row1+1, row1+2],
        [row0+1, row1, row1+1, row2+1]
    ]

    const zPiece = [
        [row0, row1+1, row0+1, row1+2],
        [row0+2, row1+1, row1+2, row2+1],
        [row1, row2+1, row1+1, row2+2],
        [row0+1, row1, row1+1, row2]
    ]

    const pieces = [iPiece, jPiece, lPiece, oPiece, sPiece, tPiece, zPiece]

    let i = Math.floor(Math.random()*pieces.length)

    let currPos = 4
    let currRotation = 0
    let currPiece = pieces[i][currRotation]

    function draw() {
        currPiece.forEach(index => {
            squares[currPos + index].classList.add('piece')
            squares[currPos + index].style.content = images[i]
        })
    }

    function erase() {
        currPiece.forEach(index => {
            squares[currPos + index].classList.remove('piece')
            squares[currPos + index].style.backgroundColor = ''
            squares[currPos + index].style.content = images[7]
        })
    }

    function control(e) {
        if (e.keyCode === leftKey || e.keyCode === a) {
            moveLeft()
        } else if (e.keyCode === upKey || e.keyCode === ee) {
            rotateRight()
        } else if (e.keyCode === rightKey || e.keyCode === d) {
            moveRight()
        } else if (e.keyCode === downKey || e.keyCode === s) {
            down()
        } else if (e.keyCode === q) {
            rotateLeft()
        }
    }
    document.addEventListener('keyup', control)

    function down() {
        erase()
        currPos += row1
        draw()
        hitGround()
    }


    function moveLeft() {
        erase()
        const atLeftWall = currPiece.some(index => (currPos + index) % row1 === 0)
        const otherPiecesBlocking = currPiece.some(index => squares[currPos - 1 + index].classList.contains('secret'))
        if(!atLeftWall && !otherPiecesBlocking) currPos -= 1
        draw()
    }

    function moveRight() {
        erase()
        const atRightWall = currPiece.some(index => (currPos + index) % row1 === row1-1)
        const otherPiecesBlocking = currPiece.some(index => squares[currPos + 1 + index].classList.contains('secret'))
        if(!atRightWall && !otherPiecesBlocking) currPos += 1
        draw()
    }

    function hitGround() {
        if(currPiece.some(index => squares[currPos + index + row1].classList.contains('secret'))){
            currPiece.forEach(index => squares[currPos + index].classList.add('secret'))
            i = upcomingI
            upcomingI = Math.floor(Math.random()*pieces.length)
            currPos = 4
            currRotation = 0
            currPiece = pieces[i][currRotation]
            draw()
            updateUpcoming()
            addScore()
            endGame()
        }
    }

    function rotateRight() {
        erase()
        currRotation = (currRotation + 1) % 4
        currPiece = pieces[i][currRotation]
        draw()
    }

    function rotateLeft() {
        erase()
        currRotation = (currRotation + 3) % 4
        currPiece = pieces[i][currRotation]
        draw()
    }

    const upcomingSquares = document.querySelectorAll('.up-next div')
    const uprow0 = 0
    const uprow1 = 4
    const uprow2 = 2*uprow1
    const uprow3 = 3*uprow1
    const upcomingIndex = 0

    const upcomingPieces = [
        [uprow0, uprow0+1, uprow0+2, uprow0+3],
        [uprow0, uprow1, uprow1+1, uprow1+2],
        [uprow1, uprow1+1, uprow1+2, uprow0+2],
        [uprow0, uprow1, uprow0+1, uprow1+1],
        [uprow1, uprow1+1, uprow0+1, uprow0+2],
        [uprow1, uprow1+1, uprow0+1, uprow1+2],
        [uprow0, uprow1+1, uprow0+1, uprow1+2],
    ]

    function updateUpcoming() {
        upcomingSquares.forEach(square => {
            square.classList.remove('piece')
            square.style.backgroundColor = ''
            square.style.backgroundImage = images[7]
        })
        upcomingPieces[upcomingI].forEach(index => {
            upcomingSquares[upcomingIndex + index].classList.add('piece')
            upcomingSquares[upcomingIndex + index].style.content = images[upcomingI]
        })
    }

    startButton.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(down, 1000)
            upcomingI = Math.floor(Math.random()*pieces.length)
            updateUpcoming()
        }
    })

    function addScore() {
        for (let i=0; i< row1*column - 1; i+= row1) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
        
            if (row.every(index => squares[index].classList.contains('secret'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('piece')
                    squares[index].classList.remove('secret')
                    squares[index].style.backgroundColor = ''
                    squares.style.content = images[7]
                })
                const removed = squares.splice(i, row1)
                squares = removed.concat(squares)
                squares.forEach(square => grid.appendChild(square))
            }
        }
    }

    function endGame() {
        if(currPiece.some(index => squares[currPos + index].classList.contains('secret'))) {
            scoreDisplay.innerHTML = 'GAME OVER'
            clearInterval(timerId)
        }
    }

})