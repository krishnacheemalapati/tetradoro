document.addEventListener('DOMContentLoaded', () => {
    let minutes = 25
    let seconds = 0
    let minText = '25'
    let secText = '00'
    let timerInterval
    let toggled = 'doro'
    const backgrounds = [
        'url(./assets/beach1.jpg)',
        'url(./assets/beach2.webp)',
        'url(./assets/beach3.jpg)',
        'url(./assets/beach4.jpg)',
        'url(./assets/beach5.jpg)',
        'url(./assets/beach6.jpg)',
    ]
    const back = document.querySelector('html')
    const toggleText = document.querySelector('#tetradoro-text')
    toggleText.addEventListener('click', tetradoroClick)

    const pomButton = document.getElementById("pom-button")
    pomButton.addEventListener("click", () => {
      const { pom } = pomButton.dataset
      if (pom === "start") {
        startCountdown()
      } else {
        stopCountdown()
      }
    })

    function calcTimeLeft(endTime) {
        const currentTime = Date.parse(new Date())
        const difference = endTime - currentTime
        minutes = Number.parseInt((difference / 60000) % 60, 10)
        seconds = Number.parseInt((difference / 1000) % 60, 10)
        minText = Number(minutes).toString().padStart(2, '0')
        secText = Number(seconds).toString().padStart(2, '0')
    }

    function startCountdown() {
        const end = Date.parse(new Date()) + minutes * 60 * 1000;
        pomButton.dataset.pom = "stop"
        pomButton.classList.add("active")
        startButton.classList.add("active")
      
        timerInterval = setInterval(function() {
          calcTimeLeft(end)
          updateTimeLeft()
      
          total = minutes * 60 + seconds
          if (minutes % 5 == 0 && seconds % 60 == 0) {
              bgIndex = Math.floor(Math.random()*backgrounds.length)
              back.style.background = backgrounds[bgIndex]
          }
          if (total <= 0) {
            clearInterval(timerInterval)
            clearInterval(timerId)
            timerId = null
            toggled = (toggled.valueOf() == "tetra") ? "doro" : "tetra"
            tetradoroToggle(toggled)
            startCountdown()
          }
        }, 1000)
      }

    function stopCountdown() {
      clearInterval(timerInterval);
      pomButton.dataset.pom = "start";
      pomButton.classList.remove("active");
      startButton.classList.remove("active");      
    }

    function updateTimeLeft() {      
        document.querySelector('#game-time-left').innerHTML = minText+":"+secText
        document.querySelector('#pom-time-left').innerHTML = minText+":"+secText
    }

    function tetradoroToggle(text) {
        minutes = (text.valueOf() == "tetra") ? 5 : 25
        seconds = 0
        minText = Number(minutes).toString().padStart(2, '0')
        secText = Number(seconds).toString().padStart(2, '0')
        console.log(minutes)
        document
          .querySelectorAll('[data-text]')
          .forEach(e => e.classList.remove('active'))
        document.querySelector(`[data-text="${text}"]`).classList.add('active')
        if (minutes < 10) {
            minText = '0'+minutes.toString()
        }
        if (seconds < 10) {
            secText = '0'+seconds.toString()
        }
        updateTimeLeft()
    }

    function tetradoroClick(event) {
      const { text } = event.target.dataset
      if (!text) return
      toggled = text
      tetradoroToggle(text)
      stopCountdown()
      if (text.valueOf() == "tetra") {
        document.querySelector('.pomodoro-container').classList.add('invisible')
        document.querySelector('.tetris-container').classList.remove('invisible')
        document.querySelector('.tetradoro-text').style.marginTop = "0vh"
      } else {
        document.querySelector('.tetris-container').classList.add('invisible')
        document.querySelector('.pomodoro-container').classList.remove('invisible')
        document.querySelector('.tetradoro-text').style.marginTop = "10vh"
      }
    }
    
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
    let interval
    let score = 0
    const images = [
        'url(./assets/lightblue.png)', 
        'url(./assets/mediumblue.png)', 
        'url(./assets/darkorange.png)', 
        'url(./assets/gold.png)', 
        'url(./assets/limegreen.png)', 
        'url(./assets/mediumpurple.png)', 
        'url(./assets/tomato.png)',
    ]
    gameEnded = false


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
            squares[currPos + index].style.content = ''
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
            square.style.content = ''
        })
        upcomingPieces[upcomingI].forEach(index => {
            upcomingSquares[upcomingIndex + index].classList.add('piece')
            upcomingSquares[upcomingIndex + index].style.content = images[upcomingI]
        })
    }

    startButton.addEventListener('click', () => {
        if (timerId) {
            stopCountdown()
            clearInterval(timerId)
            timerId = null
        } else {
            startCountdown()
            draw()
            timerId = setInterval(down, 1000)
            upcomingI = Math.floor(Math.random()*pieces.length)
            updateUpcoming()
        }
        if (gameEnded) {
            squares.forEach(square => {
                squares[index].classList.remove('piece')
                squares[index].classList.remove('secret')
                squares[index].style.content = ''
            gameEnded = false
            })
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
                    squares[index].style.content = ''
                })
                const removed = squares.splice(i, row1)
                squares = removed.concat(squares)
                squares.forEach(square => grid.appendChild(square))
            }
        }
    }

    function endGame() {
        if(currPiece.some(index => squares[currPos + index].classList.contains('secret'))) {
            scoreDisplay.innerHTML = score + '\nGame Over!'
            clearInterval(timerId)
            gameEnded = true
        }
    }

})