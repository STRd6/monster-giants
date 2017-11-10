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
      "content": "style = document.createElement \"style\"\nstyle.innerHTML = require(\"./style\")\ndocument.head.appendChild style\n\naudio = document.createElement \"audio\"\naudio.setAttribute \"autoplay\", \"\"\naudio.src = \"https://danielx.whimsy.space/lelly/monster-giants/welcome.wav\"\ndocument.body.appendChild(audio)\n\ncanvas = document.createElement \"canvas\"\ndocument.body.appendChild canvas\n\ncontext = canvas.getContext('2d')\n\ngradient = context.createLinearGradient(0, 0, canvas.width, 0)\ngradient.addColorStop(0, 'red')\ngradient.addColorStop(1 / 6, 'orange')\ngradient.addColorStop(2 / 6, 'yellow')\ngradient.addColorStop(3 / 6, 'green')\ngradient.addColorStop(4 / 6, 'blue')\ngradient.addColorStop(5 / 6, 'indigo')\ngradient.addColorStop(1, 'violet')\n\nimg = document.createElement \"img\"\nimg.src = \"https://danielx.whimsy.space/lelly/monster-giants/guy.png\"\n\ndraw = ->\n  {width, height} = canvas\n  context.fillStyle = gradient\n  context.fillRect(0, 0, width, height)\n\n  context.drawImage(img, ((width - img.width) / 2)|0, ((height - img.height)/ 2)|0)\n\nstep = ->\n  window.requestAnimationFrame step\n\n  draw()\n\nstep()\n",
      "mode": "100644"
    },
    "style.styl": {
      "path": "style.styl",
      "content": "html\n  display: flex\n  height: 100%\n\nbody\n  display: flex\n  flex: 1\n  margin: 0\n\n  > canvas\n    flex: 0\n    margin: auto\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  var audio, canvas, context, draw, gradient, img, step, style;\n\n  style = document.createElement(\"style\");\n\n  style.innerHTML = require(\"./style\");\n\n  document.head.appendChild(style);\n\n  audio = document.createElement(\"audio\");\n\n  audio.setAttribute(\"autoplay\", \"\");\n\n  audio.src = \"https://danielx.whimsy.space/lelly/monster-giants/welcome.wav\";\n\n  document.body.appendChild(audio);\n\n  canvas = document.createElement(\"canvas\");\n\n  document.body.appendChild(canvas);\n\n  context = canvas.getContext('2d');\n\n  gradient = context.createLinearGradient(0, 0, canvas.width, 0);\n\n  gradient.addColorStop(0, 'red');\n\n  gradient.addColorStop(1 / 6, 'orange');\n\n  gradient.addColorStop(2 / 6, 'yellow');\n\n  gradient.addColorStop(3 / 6, 'green');\n\n  gradient.addColorStop(4 / 6, 'blue');\n\n  gradient.addColorStop(5 / 6, 'indigo');\n\n  gradient.addColorStop(1, 'violet');\n\n  img = document.createElement(\"img\");\n\n  img.src = \"https://danielx.whimsy.space/lelly/monster-giants/guy.png\";\n\n  draw = function() {\n    var height, width;\n    width = canvas.width, height = canvas.height;\n    context.fillStyle = gradient;\n    context.fillRect(0, 0, width, height);\n    return context.drawImage(img, ((width - img.width) / 2) | 0, ((height - img.height) / 2) | 0);\n  };\n\n  step = function() {\n    window.requestAnimationFrame(step);\n    return draw();\n  };\n\n  step();\n\n}).call(this);\n",
      "type": "blob"
    },
    "style": {
      "path": "style",
      "content": "module.exports = \"html {\\n  display: flex;\\n  height: 100%;\\n}\\nbody {\\n  display: flex;\\n  flex: 1;\\n  margin: 0;\\n}\\nbody > canvas {\\n  flex: 0;\\n  margin: auto;\\n}\\n\";",
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