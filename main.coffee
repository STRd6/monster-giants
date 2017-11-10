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


draw = ->
  {width, height} = canvas
  context.fillStyle = "blue"
  context.fillRect(0, 0, width, height)
  
step = ->
  window.requestAnimationFrame step
  
  draw()

step()
