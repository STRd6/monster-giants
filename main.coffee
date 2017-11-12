style = document.createElement "style"
style.innerHTML = require("./style")
document.head.appendChild style

button = document.createElement "button"
button.textContent = "▶️"
button.onclick = ->
  button.remove()
  start()
document.body.appendChild button

img = document.createElement "img"
img.src = "https://danielx.whimsy.space/lelly/monster-giants/guy.png"

bg = document.createElement "img"
bg.src = "https://danielx.whimsy.space/lelly/monster-giants/toot.png"

monsters = [1, 2, 3, 4, 5].map (i) ->
  monsterImg = document.createElement "img"
  monsterImg.src = "https://danielx.whimsy.space/lelly/monster-giants/monster#{i}.png"

  return monsterImg

giants = [1, 2, 3, 4, 5].map (i) ->
  giantImg = document.createElement "img"
  giantImg.src = "https://danielx.whimsy.space/lelly/monster-giants/giant#{i}.png"

  return giantImg

{min, max} = Math

start = ->
  audio = document.createElement "audio"
  audio.setAttribute "autoplay", ""
  audio.src = "https://danielx.whimsy.space/lelly/monster-giants/welcome.wav"

  audio.onended = ->
    audio.src = "https://danielx.whimsy.space/lelly/monster-giants/da da da.wav"

    audio.onended = ->
      audio.onended = undefined
      audio.setAttribute "loop", ""
      audio.src = "https://danielx.whimsy.space/lelly/monster-giants/theme.mp3"

  document.body.appendChild(audio)

  canvas = document.createElement "canvas"
  document.body.appendChild canvas

  {width, height} = canvas
  context = canvas.getContext('2d')

  gradient = context.createLinearGradient(0, 0, canvas.width, 0)
  gradient.addColorStop(0, 'red')
  gradient.addColorStop(1 / 6, 'orange')
  gradient.addColorStop(2 / 6, 'yellow')
  gradient.addColorStop(3 / 6, 'green')
  gradient.addColorStop(4 / 6, 'blue')
  gradient.addColorStop(5 / 6, 'indigo')
  gradient.addColorStop(1, 'violet')

  gradient2 = context.createLinearGradient(0, 0, 0, canvas.height)
  gradient2.addColorStop(0, 'blue')
  gradient2.addColorStop(0.5, 'blue')
  gradient2.addColorStop(0.5, 'green')
  gradient2.addColorStop(1, 'green')

  drawMonster = (monster, i) ->
    x = (width / 2) * i / monsters.length
    y = max(height - (t - 2) * 20, height / 2)
    context.drawImage(monster, x, y)

  drawGiant = (giant, i) ->
    x = (width / 2) * i / giants.length + width / 2 - 32
    y = max(height - (t - 2) * 20, height / 2)
    context.drawImage(giant, x, y)

  draw = ->
    if t < 2
      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)
      context.drawImage(img, ((width - img.width) / 2)|0, ((height - img.height)/ 2)|0)
    else
      context.fillStyle = gradient2
      context.fillRect(0, 0, width, height)
      monsters.forEach drawMonster
      giants.forEach drawGiant

  t = 0
  dt = 1 / 60
  step = ->
    window.requestAnimationFrame step

    draw()
    t += dt

  step()


