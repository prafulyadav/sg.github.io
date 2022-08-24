
(function() {
  var Utils, exports;

  Utils = (function() {

    /*
      Creates a bkcore.threejs.Shaders["normalV"|"normal"] material
      with given parameters
     */
    function Utils() {}

    Utils.createNormalMaterial = function(opts) {
      var material, parameters, shader, shadername, uniforms;
      if (opts == null) {
        opts = {};
      }
      if (opts.ambient == null) {
        opts.ambient = 0x444444;
      }
      if (opts.normalScale == null) {
        opts.normalScale = 1.0;
      }
      if (opts.reflectivity == null) {
        opts.reflectivity = 0.9;
      }
      if (opts.shininess == null) {
        opts.shininess = 42;
      }
      if (opts.metal == null) {
        opts.metal = false;
      }
      shadername = opts.perPixel ? "normalV" : "normal";
      shader = bkcore.threejs.Shaders[shadername];
      uniforms = THREE.UniformsUtils.clone(shader.uniforms);
      uniforms["enableDiffuse"].value = true;
      uniforms["enableSpecular"].value = true;
      uniforms["enableReflection"].value = !!opts.cube;
      uniforms["tNormal"].texture = opts.normal;
      uniforms["tDiffuse"].texture = opts.diffuse;
      uniforms["tSpecular"].texture = opts.specular;
      uniforms["uAmbientColor"].value.setHex(opts.ambient);
      uniforms["uAmbientColor"].value.convertGammaToLinear();
      uniforms["uNormalScale"].value = opts.normalScale;
      if (opts.cube != null) {
        uniforms["tCube"].texture = opts.cube;
        uniforms["uReflectivity"].value = opts.reflectivity;
      }
      parameters = {
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: uniforms,
        lights: true,
        fog: false
      };
      material = new THREE.ShaderMaterial(parameters);
      material.perPixel = true;
      material.metal = opts.metal;
      return material;
    };


    /*
      Projects an object origin vector to screen using given camera
      @param  THREE.Object3D object The object which origin you want to project
      @param  THREE.Camera camera The camera of the projection
      @return THEE.Vector3 Projected verctor
     */

    Utils.projectOnScreen = function(object, camera) {
      var c, lPos, mat;
      mat = new THREE.Matrix4();
      mat.multiply(camera.matrixWorldInverse, object.matrixWorld);
      mat.multiply(camera.projectionMatrix, mat);
      c = mat.n44;
      lPos = new THREE.Vector3(mat.n14 / c, mat.n24 / c, mat.n34 / c);
      return lPos.multiplyScalar(0.5).addScalar(0.5);
    };


    /*
      Get an url parameter
      @param  String name Parameter slug
      @return Mixed
     */

    Utils.URLParameters = null;

    Utils.getURLParameter = function(name) {
      if (this.URLParameters == null) {
        this.URLParameters = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (function(_this) {
          return function(m, key, val) {
            return _this.URLParameters[key] = val;
          };
        })(this));
      }
      return this.URLParameters[name];
    };


    /*
      Get top offset of an element
      @param obj HTMLElement
     */

    Utils.getOffsetTop = function(obj) {
      var curtop;
      curtop = obj.offsetTop;
      if (obj.offsetParent) {
        while (obj = obj.offsetParent) {
          curtop += obj.offsetTop;
        }
      }
      return curtop;
    };


    /*
      Scrolls page to given element id
      @param  string id The ID of the element
     */

    Utils.scrollTo = function(id) {
      return window.scroll(0, this.getOffsetTop(document.getElementById(id)));
    };


    /*
      Add or remove a class from an element
      @param  string id       [description]
      @param  string cssclass [description]
      @param  bool active   [description]
     */

    Utils.updateClass = function(id, cssclass, active) {
      var e;
      e = document.getElementById(id);
      if (e == null) {
        return;
      }
      if (active) {
        return e.classList.add(cssclass);
      } else {
        return e.classList.remove(cssclass);
      }
    };


    /*
      Performs an XMLHttpRequest
      @param  string   url      [description]
      @param  bool   postData true = POST, false = GET
      @param  {Function} callback [description]
      @param  {Object}   data     [description]
     */

    Utils.request = function(url, postData, callback, data) {
      var XMLHttpFactories, createXMLHTTPObject, i, method, qdata, req, val;
      XMLHttpFactories = [
        function() {
          return new XMLHttpRequest();
        }, function() {
          return new ActiveXObject("Msxml2.XMLHTTP");
        }, function() {
          return new ActiveXObject("Msxml3.XMLHTTP");
        }, function() {
          return new ActiveXObject("Microsoft.XMLHTTP");
        }
      ];
      createXMLHTTPObject = function() {
        var e, i, xmlhttp, _i, _ref;
        xmlhttp = false;
        for (i = _i = 0, _ref = XMLHttpFactories.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          try {
            xmlhttp = XMLHttpFactories[i]();
          } catch (_error) {
            e = _error;
            continue;
          }
          break;
        }
        return xmlhttp;
      };
      req = createXMLHTTPObject();
      if (req == null) {
        return;
      }
      method = postData != null ? "POST" : "GET";
      qdata = "o=bk";
      if (data != null) {
        for (i in data) {
          val = data[i];
          qdata += "&" + i + "=" + val;
          if (postData != null) {
            url += "?" + qdata;
          }
        }
      }
      req.open(method, url, true);
      if (postData != null) {
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      }
      req.onreadystatechange = function() {
        if (req.readyState !== 4) {
          return;
        }
        if (!(req.status === 200 || req.status === 304)) {
          return;
        }
        return typeof callback === "function" ? callback(req) : void 0;
      };
      req.send(qdata);
      return req;
    };


    /*
      Checks whether the device supports Touch input
     */

    Utils.isTouchDevice = function() {
      return ('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    };

    return Utils;

  })();


  /*
    Exports
    @package bkcore
   */

  exports = exports != null ? exports : this;

  exports.bkcore || (exports.bkcore = {});

  exports.bkcore.Utils = Utils;

}).call(this);
