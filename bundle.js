/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _engine = __webpack_require__(/*! ./class/engine */ 1);\n\nvar _engine2 = _interopRequireDefault(_engine);\n\nvar _sensor = __webpack_require__(/*! ./class/sensor */ 8);\n\nvar _sensor2 = _interopRequireDefault(_sensor);\n\nvar _config = __webpack_require__(/*! ./config.json */ 9);\n\nvar _config2 = _interopRequireDefault(_config);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nvar http = __webpack_require__(/*! http */ 6);\n\nvar sensorHelper = new _sensor2.default();\n\nvar server = http.createServer(function (req, res) {\n    if (req.url === '/favicon.ico') {\n        return;\n    }\n\n    var engine = new _engine2.default(sensorHelper);\n    res.writeHead(200);\n    res.end(engine.compute());\n});\n\nserver.listen(8080);\n\nvar io = __webpack_require__(/*! socket.io */ 7)(server);\n\nio.on('connection', function (socket) {\n    socket.on('get-config', function () {\n        socket.emit('get-config', _config2.default);\n    });\n\n    socket.on('sensor-emit', function (data) {\n        sensorHelper.updateData(data);\n    });\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9pbmRleC5qcz8xNjg3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFbmdpbmUgZnJvbSAnLi9jbGFzcy9lbmdpbmUnO1xuaW1wb3J0IFNlbnNvciBmcm9tICcuL2NsYXNzL3NlbnNvcic7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzb24nO1xuXG5jb25zdCBodHRwID0gcmVxdWlyZSgnaHR0cCcpO1xuXG5sZXQgc2Vuc29ySGVscGVyID0gbmV3IFNlbnNvcigpO1xuXG52YXIgc2VydmVyID0gaHR0cC5jcmVhdGVTZXJ2ZXIoZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICBpZihyZXEudXJsID09PSAnL2Zhdmljb24uaWNvJykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGVuZ2luZSA9IG5ldyBFbmdpbmUoc2Vuc29ySGVscGVyKTtcbiAgICByZXMud3JpdGVIZWFkKDIwMCk7XG4gICAgcmVzLmVuZChlbmdpbmUuY29tcHV0ZSgpKTtcbn0pO1xuXG5zZXJ2ZXIubGlzdGVuKDgwODApO1xuXG5jb25zdCBpbyA9IHJlcXVpcmUoJ3NvY2tldC5pbycpKHNlcnZlcik7XG5cbmlvLm9uKCdjb25uZWN0aW9uJywgZnVuY3Rpb24gKHNvY2tldCkge1xuICAgIHNvY2tldC5vbignZ2V0LWNvbmZpZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBzb2NrZXQuZW1pdCgnZ2V0LWNvbmZpZycsIGNvbmZpZyk7XG4gICAgfSk7XG5cbiAgICBzb2NrZXQub24oJ3NlbnNvci1lbWl0JywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBzZW5zb3JIZWxwZXIudXBkYXRlRGF0YShkYXRhKTtcbiAgICB9KTtcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBpbmRleC5qcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7QUFBQTtBQUNBOzs7OztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///0\n");

/***/ }),
/* 1 */
/*!*************************!*\
  !*** ./class/engine.js ***!
  \*************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

"use strict";
eval("throw new Error(\"Module build failed: Duplicate declaration \\\"conditionLogicOk\\\"\\n\\n\\u001b[0m \\u001b[90m 89 | \\u001b[39m\\n \\u001b[90m 90 | \\u001b[39m            \\u001b[36mcase\\u001b[39m redtype\\u001b[33m.\\u001b[39mlogic_and\\u001b[33m:\\u001b[39m\\n\\u001b[31m\\u001b[1m>\\u001b[22m\\u001b[39m\\u001b[90m 91 | \\u001b[39m                let conditionLogicOk \\u001b[33m=\\u001b[39m \\u001b[36mfalse\\u001b[39m\\u001b[33m;\\u001b[39m\\n \\u001b[90m    | \\u001b[39m                    \\u001b[31m\\u001b[1m^\\u001b[22m\\u001b[39m\\n \\u001b[90m 92 | \\u001b[39m\\n \\u001b[90m 93 | \\u001b[39m                \\u001b[36mfor\\u001b[39m(let childLogic of \\u001b[36mthis\\u001b[39m\\u001b[33m.\\u001b[39mreader\\u001b[33m.\\u001b[39mgetConnectedNodeParentsFromId(child\\u001b[33m.\\u001b[39mid)) {\\n \\u001b[90m 94 | \\u001b[39m                    \\u001b[36mif\\u001b[39m(\\u001b[36mthis\\u001b[39m\\u001b[33m.\\u001b[39msubcondition[childLogic\\u001b[33m.\\u001b[39mid] \\u001b[33m===\\u001b[39m \\u001b[36mtrue\\u001b[39m \\u001b[33m&&\\u001b[39m \\u001b[33m!\\u001b[39mconditionLogicOk) {\\u001b[0m\\n\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///1\n");

/***/ }),
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

eval("module.exports = require(\"http\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBcIj84ZTQ0Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJodHRwXCJcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///6\n");

/***/ }),
/* 7 */
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

eval("module.exports = require(\"socket.io\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcInNvY2tldC5pb1wiPzUxMDUiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic29ja2V0LmlvXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwic29ja2V0LmlvXCJcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///7\n");

/***/ }),
/* 8 */
/*!*************************!*\
  !*** ./class/sensor.js ***!
  \*************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Sensor = function () {\n    function Sensor() {\n        _classCallCheck(this, Sensor);\n\n        this.data = {};\n    }\n\n    _createClass(Sensor, [{\n        key: \"updateData\",\n        value: function updateData(data) {\n            data = JSON.parse(data);\n            this.data[data.sensor_id + data.sensor_type] = data;\n        }\n    }, {\n        key: \"getSensorByIdAndType\",\n        value: function getSensorByIdAndType(id, type) {\n            // console.log(this.data);\n            // console.log(id+type);\n            console.log(this.data[id + type]);\n            return this.data[id + type];\n        }\n    }]);\n\n    return Sensor;\n}();\n\nexports.default = Sensor;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiOC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9jbGFzcy9zZW5zb3IuanM/YjhlMCJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBTZW5zb3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmRhdGEgPSB7fTtcbiAgICB9XG5cbiAgICB1cGRhdGVEYXRhKGRhdGEpIHtcbiAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgIHRoaXMuZGF0YVtkYXRhLnNlbnNvcl9pZCtkYXRhLnNlbnNvcl90eXBlXSA9IGRhdGE7XG4gICAgfVxuXG4gICAgZ2V0U2Vuc29yQnlJZEFuZFR5cGUoaWQsIHR5cGUpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5kYXRhKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coaWQrdHlwZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZGF0YVtpZCt0eXBlXSk7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbaWQrdHlwZV07XG4gICAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBjbGFzcy9zZW5zb3IuanMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FBZkEiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///8\n");

/***/ }),
/* 9 */
/*!*********************!*\
  !*** ./config.json ***!
  \*********************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

eval("module.exports = {\"type\":\"server\",\"device_id\":55}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiOS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL2NvbmZpZy5qc29uP2UyMDMiXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB7XCJ0eXBlXCI6XCJzZXJ2ZXJcIixcImRldmljZV9pZFwiOjU1fVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vY29uZmlnLmpzb25cbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///9\n");

/***/ })
/******/ ]);