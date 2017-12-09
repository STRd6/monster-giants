(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, publicAPI, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = self;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, content, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    if ((content = file.content) == null) {
      throw "Malformed package. No content for file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    var fn;
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    fn = function(path) {
      var otherPackage;
      if (typeof path === "object") {
        return loadPackage(path);
      } else if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
    fn.packageWrapper = publicAPI.packageWrapper;
    fn.executePackageWrapper = publicAPI.executePackageWrapper;
    return fn;
  };

  publicAPI = {
    generateFor: generateRequireFn,
    packageWrapper: function(pkg, code) {
      return ";(function(PACKAGE) {\n  var src = " + (JSON.stringify(PACKAGE.distribution.main.content)) + ";\n  var Require = new Function(\"PACKAGE\", \"return \" + src)({distribution: {main: {content: src}}});\n  var require = Require.generateFor(PACKAGE);\n  " + code + ";\n})(" + (JSON.stringify(pkg, null, 2)) + ");";
    },
    executePackageWrapper: function(pkg) {
      return publicAPI.packageWrapper(pkg, "require('./" + pkg.entryPoint + "')");
    },
    loadPackage: loadPackage
  };

  if (typeof exports !== "undefined" && exports !== null) {
    module.exports = publicAPI;
  } else {
    global.Require = publicAPI;
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

  return publicAPI;

}).call(this);

  window.require = Require.generateFor(pkg);
})({
  "source": {
    "README.md": {
      "path": "README.md",
      "content": "# monster-giants\n\nWelcome to monster giants!\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee": {
      "path": "main.coffee",
      "content": "style = document.createElement \"style\"\nstyle.innerHTML = require(\"./style\")\ndocument.head.appendChild style\n\naudio = null\n\nspiderActive = false\nspiderButton = document.createElement \"button\"\nspiderButton.textContent = \"Spider\"\nspiderButton.classList.add \"spider\"\nspiderButton.onclick = ->\n  spiderActive = true\n  audio.pause()\n\nbutton = document.createElement \"button\"\nbutton.textContent = \"▶️\"\nbutton.onclick = ->\n  button.remove()\n  document.body.appendChild spiderButton\n  start()\ndocument.body.appendChild button\n\ncreateImage = (url) ->\n  _img = document.createElement \"img\"\n  _img.src = url\n\n  return _img\n\nimg = createImage \"https://danielx.whimsy.space/lelly/monster-giants/guy.png\"\nbg = createImage \"https://danielx.whimsy.space/lelly/monster-giants/toot.png\"\n\nmonsters = [1, 2, 3, 4, 5].map (i) ->\n  createImage \"https://danielx.whimsy.space/lelly/monster-giants/monster#{i}.png\"\n\nmonsterLeader = createImage \"https://danielx.whimsy.space/lelly/monster-giants/monster-leader.png\"\n\ngiants = [1, 2, 3, 4, 5].map (i) ->\n  createImage \"https://danielx.whimsy.space/lelly/monster-giants/giant#{i}.png\"\n\ngiantLeader = createImage \"https://danielx.whimsy.space/lelly/monster-giants/giant-leader.png\"\n\n{min, max} = Math\n\nstart = ->\n  audio = document.createElement \"audio\"\n  audio.setAttribute \"autoplay\", \"\"\n  audio.src = \"https://danielx.whimsy.space/lelly/monster-giants/welcome.wav\"\n\n  audio.onended = ->\n    audio.src = \"https://danielx.whimsy.space/lelly/monster-giants/da da da.wav\"\n\n    audio.onended = ->\n      audio.onended = undefined\n      audio.setAttribute \"loop\", \"\"\n      audio.src = \"https://danielx.whimsy.space/lelly/monster-giants/theme.mp3\"\n\n  document.body.appendChild(audio)\n\n  canvas = document.createElement \"canvas\"\n  document.body.appendChild canvas\n\n  {width, height} = canvas\n  context = canvas.getContext('2d')\n\n  gradient = context.createLinearGradient(0, 0, canvas.width, 0)\n  gradient.addColorStop(0, 'red')\n  gradient.addColorStop(1 / 6, 'orange')\n  gradient.addColorStop(2 / 6, 'yellow')\n  gradient.addColorStop(3 / 6, 'green')\n  gradient.addColorStop(4 / 6, 'blue')\n  gradient.addColorStop(5 / 6, 'indigo')\n  gradient.addColorStop(1, 'violet')\n\n  gradient2 = context.createLinearGradient(0, 0, 0, canvas.height)\n  gradient2.addColorStop(0, 'blue')\n  gradient2.addColorStop(0.5, 'blue')\n  gradient2.addColorStop(0.5, 'green')\n  gradient2.addColorStop(1, 'green')\n\n  drawMonster = (monster, i) ->\n    x = (width / 2) * i / monsters.length\n    y = max(height - (t - 2) * 20, height / 2)\n    context.drawImage(monster, x, y)\n\n  drawGiant = (giant, i) ->\n    x = (width / 2) * i / giants.length + width / 2 - 32\n    y = max(height - (t - 2) * 20, height / 2)\n    context.drawImage(giant, x, y)\n\n  draw = ->\n    if t < 2\n      context.fillStyle = gradient\n      context.fillRect(0, 0, width, height)\n      context.drawImage(img, ((width - img.width) / 2)|0, ((height - img.height)/ 2)|0)\n    else\n      context.fillStyle = gradient2\n      context.fillRect(0, 0, width, height)\n      drawGiant giantLeader, 2.5\n      drawMonster monsterLeader, 2.5\n      monsters.forEach drawMonster\n      giants.forEach drawGiant\n\n  t = 0\n  dt = 1 / 60\n  step = ->\n    window.requestAnimationFrame step\n\n    draw()\n    t += dt\n\n  step()\n\n\n",
      "mode": "100644",
      "type": "blob"
    },
    "style.styl": {
      "path": "style.styl",
      "content": "html\n  display: flex\n  height: 100%\n\nbody\n  display: flex\n  flex: 1\n  flex-direction: column\n  margin: 0\n\n  > button\n    border-radius: 100px\n    width: 200px\n    height: 200px\n    margin: auto\n\n  > button.spider\n    height: 64px\n    width: 64px\n    margin: 0 auto\n\n  > canvas\n    flex: 0\n    margin: auto\n",
      "mode": "100644",
      "type": "blob"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  var audio, bg, button, createImage, giantLeader, giants, img, max, min, monsterLeader, monsters, spiderActive, spiderButton, start, style;\n\n  style = document.createElement(\"style\");\n\n  style.innerHTML = require(\"./style\");\n\n  document.head.appendChild(style);\n\n  audio = null;\n\n  spiderActive = false;\n\n  spiderButton = document.createElement(\"button\");\n\n  spiderButton.textContent = \"Spider\";\n\n  spiderButton.classList.add(\"spider\");\n\n  spiderButton.onclick = function() {\n    spiderActive = true;\n    return audio.pause();\n  };\n\n  button = document.createElement(\"button\");\n\n  button.textContent = \"▶️\";\n\n  button.onclick = function() {\n    button.remove();\n    document.body.appendChild(spiderButton);\n    return start();\n  };\n\n  document.body.appendChild(button);\n\n  createImage = function(url) {\n    var _img;\n    _img = document.createElement(\"img\");\n    _img.src = url;\n    return _img;\n  };\n\n  img = createImage(\"https://danielx.whimsy.space/lelly/monster-giants/guy.png\");\n\n  bg = createImage(\"https://danielx.whimsy.space/lelly/monster-giants/toot.png\");\n\n  monsters = [1, 2, 3, 4, 5].map(function(i) {\n    return createImage(\"https://danielx.whimsy.space/lelly/monster-giants/monster\" + i + \".png\");\n  });\n\n  monsterLeader = createImage(\"https://danielx.whimsy.space/lelly/monster-giants/monster-leader.png\");\n\n  giants = [1, 2, 3, 4, 5].map(function(i) {\n    return createImage(\"https://danielx.whimsy.space/lelly/monster-giants/giant\" + i + \".png\");\n  });\n\n  giantLeader = createImage(\"https://danielx.whimsy.space/lelly/monster-giants/giant-leader.png\");\n\n  min = Math.min, max = Math.max;\n\n  start = function() {\n    var canvas, context, draw, drawGiant, drawMonster, dt, gradient, gradient2, height, step, t, width;\n    audio = document.createElement(\"audio\");\n    audio.setAttribute(\"autoplay\", \"\");\n    audio.src = \"https://danielx.whimsy.space/lelly/monster-giants/welcome.wav\";\n    audio.onended = function() {\n      audio.src = \"https://danielx.whimsy.space/lelly/monster-giants/da da da.wav\";\n      return audio.onended = function() {\n        audio.onended = void 0;\n        audio.setAttribute(\"loop\", \"\");\n        return audio.src = \"https://danielx.whimsy.space/lelly/monster-giants/theme.mp3\";\n      };\n    };\n    document.body.appendChild(audio);\n    canvas = document.createElement(\"canvas\");\n    document.body.appendChild(canvas);\n    width = canvas.width, height = canvas.height;\n    context = canvas.getContext('2d');\n    gradient = context.createLinearGradient(0, 0, canvas.width, 0);\n    gradient.addColorStop(0, 'red');\n    gradient.addColorStop(1 / 6, 'orange');\n    gradient.addColorStop(2 / 6, 'yellow');\n    gradient.addColorStop(3 / 6, 'green');\n    gradient.addColorStop(4 / 6, 'blue');\n    gradient.addColorStop(5 / 6, 'indigo');\n    gradient.addColorStop(1, 'violet');\n    gradient2 = context.createLinearGradient(0, 0, 0, canvas.height);\n    gradient2.addColorStop(0, 'blue');\n    gradient2.addColorStop(0.5, 'blue');\n    gradient2.addColorStop(0.5, 'green');\n    gradient2.addColorStop(1, 'green');\n    drawMonster = function(monster, i) {\n      var x, y;\n      x = (width / 2) * i / monsters.length;\n      y = max(height - (t - 2) * 20, height / 2);\n      return context.drawImage(monster, x, y);\n    };\n    drawGiant = function(giant, i) {\n      var x, y;\n      x = (width / 2) * i / giants.length + width / 2 - 32;\n      y = max(height - (t - 2) * 20, height / 2);\n      return context.drawImage(giant, x, y);\n    };\n    draw = function() {\n      if (t < 2) {\n        context.fillStyle = gradient;\n        context.fillRect(0, 0, width, height);\n        return context.drawImage(img, ((width - img.width) / 2) | 0, ((height - img.height) / 2) | 0);\n      } else {\n        context.fillStyle = gradient2;\n        context.fillRect(0, 0, width, height);\n        drawGiant(giantLeader, 2.5);\n        drawMonster(monsterLeader, 2.5);\n        monsters.forEach(drawMonster);\n        return giants.forEach(drawGiant);\n      }\n    };\n    t = 0;\n    dt = 1 / 60;\n    step = function() {\n      window.requestAnimationFrame(step);\n      draw();\n      return t += dt;\n    };\n    return step();\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "style": {
      "path": "style",
      "content": "module.exports = \"html {\\n  display: flex;\\n  height: 100%;\\n}\\nbody {\\n  display: flex;\\n  flex: 1;\\n  flex-direction: column;\\n  margin: 0;\\n}\\nbody > button {\\n  border-radius: 100px;\\n  width: 200px;\\n  height: 200px;\\n  margin: auto;\\n}\\nbody > button.spider {\\n  height: 64px;\\n  width: 64px;\\n  margin: 0 auto;\\n}\\nbody > canvas {\\n  flex: 0;\\n  margin: auto;\\n}\\n\";",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "https://danielx.net/editor/"
  },
  "config": {},
  "entryPoint": "main",
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "STRd6/monster-giants",
    "homepage": null,
    "description": "Welcome to monster giants!",
    "html_url": "https://github.com/STRd6/monster-giants",
    "url": "https://api.github.com/repos/STRd6/monster-giants",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});