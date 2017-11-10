style = document.createElement "style"
style.innerHTML = require("./style")
document.head.appendChild style

audio = document.createElement "audio"
audio.setAttribute "autoplay", ""
audio.src = "https://danielx.whimsy.space/lelly/monster-giants/welcome.wav"
document.body.appendChild(audio)

canvas = document.createElement "canvas"
document.body.appendChild canvas

context = canvas.getContext('2d')

gradient = context.createLinearGradient(0, 0, canvas.width, 0)
gradient.addColorStop(0, 'red')
gradient.addColorStop(1 / 6, 'orange')
gradient.addColorStop(2 / 6, 'yellow')
gradient.addColorStop(3 / 6, 'green')
gradient.addColorStop(4 / 6, 'blue')
gradient.addColorStop(5 / 6, 'indigo')
gradient.addColorStop(1, 'violet')

img = document.createElement "img"
img.src = "https://danielx.whimsy.space/lelly/monster-giants/guy.png"

draw = ->
  {width, height} = canvas
  context.fillStyle = gradient
  context.fillRect(0, 0, width, height)

  context.drawImage(img, ((width - img.width) / 2)|0, ((height - img.height)/ 2)|0)

step = ->
  window.requestAnimationFrame step

  draw()

step()
