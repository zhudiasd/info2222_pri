"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/login/route";
exports.ids = ["app/api/auth/login/route"];
exports.modules = {

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("pg");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2FUsers%2Fabhishekyadav%2FDesktop%2FINFO2222%2FINFO2222_PROJECT_PHASE1%2FThreadflow_Main%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fabhishekyadav%2FDesktop%2FINFO2222%2FINFO2222_PROJECT_PHASE1%2FThreadflow_Main&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2FUsers%2Fabhishekyadav%2FDesktop%2FINFO2222%2FINFO2222_PROJECT_PHASE1%2FThreadflow_Main%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fabhishekyadav%2FDesktop%2FINFO2222%2FINFO2222_PROJECT_PHASE1%2FThreadflow_Main&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   headerHooks: () => (/* binding */ headerHooks),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),\n/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_abhishekyadav_Desktop_INFO2222_INFO2222_PROJECT_PHASE1_Threadflow_Main_src_app_api_auth_login_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/auth/login/route.ts */ \"(rsc)/./src/app/api/auth/login/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/login/route\",\n        pathname: \"/api/auth/login\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/login/route\"\n    },\n    resolvedPagePath: \"/Users/abhishekyadav/Desktop/INFO2222/INFO2222_PROJECT_PHASE1/Threadflow_Main/src/app/api/auth/login/route.ts\",\n    nextConfigOutput,\n    userland: _Users_abhishekyadav_Desktop_INFO2222_INFO2222_PROJECT_PHASE1_Threadflow_Main_src_app_api_auth_login_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks, headerHooks, staticGenerationBailout } = routeModule;\nconst originalPathname = \"/api/auth/login/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGbG9naW4lMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmFiaGlzaGVreWFkYXYlMkZEZXNrdG9wJTJGSU5GTzIyMjIlMkZJTkZPMjIyMl9QUk9KRUNUX1BIQVNFMSUyRlRocmVhZGZsb3dfTWFpbiUyRnNyYyUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZhYmhpc2hla3lhZGF2JTJGRGVza3RvcCUyRklORk8yMjIyJTJGSU5GTzIyMjJfUFJPSkVDVF9QSEFTRTElMkZUaHJlYWRmbG93X01haW4maXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDNkQ7QUFDMUk7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSx1R0FBdUc7QUFDL0c7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUM2Sjs7QUFFN0oiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90aHJlYWRmbG93Lz9hZGY2Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9hYmhpc2hla3lhZGF2L0Rlc2t0b3AvSU5GTzIyMjIvSU5GTzIyMjJfUFJPSkVDVF9QSEFTRTEvVGhyZWFkZmxvd19NYWluL3NyYy9hcHAvYXBpL2F1dGgvbG9naW4vcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvbG9naW4vcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hdXRoL2xvZ2luXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL2xvZ2luL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL1VzZXJzL2FiaGlzaGVreWFkYXYvRGVza3RvcC9JTkZPMjIyMi9JTkZPMjIyMl9QUk9KRUNUX1BIQVNFMS9UaHJlYWRmbG93X01haW4vc3JjL2FwcC9hcGkvYXV0aC9sb2dpbi9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBoZWFkZXJIb29rcywgc3RhdGljR2VuZXJhdGlvbkJhaWxvdXQgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hdXRoL2xvZ2luL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIGhlYWRlckhvb2tzLCBzdGF0aWNHZW5lcmF0aW9uQmFpbG91dCwgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2FUsers%2Fabhishekyadav%2FDesktop%2FINFO2222%2FINFO2222_PROJECT_PHASE1%2FThreadflow_Main%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fabhishekyadav%2FDesktop%2FINFO2222%2FINFO2222_PROJECT_PHASE1%2FThreadflow_Main&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/auth/login/route.ts":
/*!*****************************************!*\
  !*** ./src/app/api/auth/login/route.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/web/exports/next-response */ \"(rsc)/./node_modules/next/dist/server/web/exports/next-response.js\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _db_db__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/db/db */ \"(rsc)/./src/db/db.ts\");\n\n\n\n\nasync function POST(request) {\n    try {\n        const { username, password } = await request.json();\n        // Get user from database\n        const result = await (0,_db_db__WEBPACK_IMPORTED_MODULE_3__.query)(\"SELECT * FROM users WHERE username = $1\", [\n            username\n        ]);\n        const user = result.rows[0];\n        if (!user) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                message: \"Invalid credentials\"\n            }, {\n                status: 401\n            });\n        }\n        // Verify password\n        const validPassword = await bcrypt__WEBPACK_IMPORTED_MODULE_1___default().compare(password, user.password_hash);\n        if (!validPassword) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                message: \"Invalid credentials\"\n            }, {\n                status: 401\n            });\n        }\n        // Generate JWT token\n        const token = jsonwebtoken__WEBPACK_IMPORTED_MODULE_2___default().sign({\n            id: user.id,\n            username: user.username,\n            role: user.role\n        }, process.env.JWT_SECRET || \"your-secret-key\", {\n            expiresIn: \"24h\"\n        });\n        // Remove password hash from response\n        const { password_hash, ...userWithoutPassword } = user;\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            user: userWithoutPassword,\n            token\n        });\n    } catch (error) {\n        console.error(\"Login error:\", error);\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            message: \"Internal server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL2xvZ2luL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBMkM7QUFDZjtBQUNHO0FBQ0M7QUFFekIsZUFBZUksS0FBS0MsT0FBZ0I7SUFDekMsSUFBSTtRQUNGLE1BQU0sRUFBRUMsUUFBUSxFQUFFQyxRQUFRLEVBQUUsR0FBRyxNQUFNRixRQUFRRyxJQUFJO1FBRWpELHlCQUF5QjtRQUN6QixNQUFNQyxTQUFTLE1BQU1OLDZDQUFLQSxDQUN4QiwyQ0FDQTtZQUFDRztTQUFTO1FBR1osTUFBTUksT0FBT0QsT0FBT0UsSUFBSSxDQUFDLEVBQUU7UUFFM0IsSUFBSSxDQUFDRCxNQUFNO1lBQ1QsT0FBT1Ysa0ZBQVlBLENBQUNRLElBQUksQ0FDdEI7Z0JBQUVJLFNBQVM7WUFBc0IsR0FDakM7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLGtCQUFrQjtRQUNsQixNQUFNQyxnQkFBZ0IsTUFBTWIscURBQWMsQ0FBQ00sVUFBVUcsS0FBS00sYUFBYTtRQUN2RSxJQUFJLENBQUNGLGVBQWU7WUFDbEIsT0FBT2Qsa0ZBQVlBLENBQUNRLElBQUksQ0FDdEI7Z0JBQUVJLFNBQVM7WUFBc0IsR0FDakM7Z0JBQUVDLFFBQVE7WUFBSTtRQUVsQjtRQUVBLHFCQUFxQjtRQUNyQixNQUFNSSxRQUFRZix3REFBUSxDQUNwQjtZQUFFaUIsSUFBSVQsS0FBS1MsRUFBRTtZQUFFYixVQUFVSSxLQUFLSixRQUFRO1lBQUVjLE1BQU1WLEtBQUtVLElBQUk7UUFBQyxHQUN4REMsUUFBUUMsR0FBRyxDQUFDQyxVQUFVLElBQUksbUJBQzFCO1lBQUVDLFdBQVc7UUFBTTtRQUdyQixxQ0FBcUM7UUFDckMsTUFBTSxFQUFFUixhQUFhLEVBQUUsR0FBR1MscUJBQXFCLEdBQUdmO1FBRWxELE9BQU9WLGtGQUFZQSxDQUFDUSxJQUFJLENBQUM7WUFDdkJFLE1BQU1lO1lBQ05SO1FBQ0Y7SUFDRixFQUFFLE9BQU9TLE9BQU87UUFDZEMsUUFBUUQsS0FBSyxDQUFDLGdCQUFnQkE7UUFDOUIsT0FBTzFCLGtGQUFZQSxDQUFDUSxJQUFJLENBQ3RCO1lBQUVJLFNBQVM7UUFBd0IsR0FDbkM7WUFBRUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90aHJlYWRmbG93Ly4vc3JjL2FwcC9hcGkvYXV0aC9sb2dpbi9yb3V0ZS50cz9kMzFhIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcbmltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0JztcbmltcG9ydCBqd3QgZnJvbSAnanNvbndlYnRva2VuJztcbmltcG9ydCB7IHF1ZXJ5IH0gZnJvbSAnQC9kYi9kYic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IHVzZXJuYW1lLCBwYXNzd29yZCB9ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XG5cbiAgICAvLyBHZXQgdXNlciBmcm9tIGRhdGFiYXNlXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcXVlcnkoXG4gICAgICAnU0VMRUNUICogRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ICQxJyxcbiAgICAgIFt1c2VybmFtZV1cbiAgICApO1xuXG4gICAgY29uc3QgdXNlciA9IHJlc3VsdC5yb3dzWzBdO1xuXG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgbWVzc2FnZTogJ0ludmFsaWQgY3JlZGVudGlhbHMnIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDEgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBWZXJpZnkgcGFzc3dvcmRcbiAgICBjb25zdCB2YWxpZFBhc3N3b3JkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIHVzZXIucGFzc3dvcmRfaGFzaCk7XG4gICAgaWYgKCF2YWxpZFBhc3N3b3JkKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgbWVzc2FnZTogJ0ludmFsaWQgY3JlZGVudGlhbHMnIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDEgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBHZW5lcmF0ZSBKV1QgdG9rZW5cbiAgICBjb25zdCB0b2tlbiA9IGp3dC5zaWduKFxuICAgICAgeyBpZDogdXNlci5pZCwgdXNlcm5hbWU6IHVzZXIudXNlcm5hbWUsIHJvbGU6IHVzZXIucm9sZSB9LFxuICAgICAgcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVCB8fCAneW91ci1zZWNyZXQta2V5JyxcbiAgICAgIHsgZXhwaXJlc0luOiAnMjRoJyB9XG4gICAgKTtcblxuICAgIC8vIFJlbW92ZSBwYXNzd29yZCBoYXNoIGZyb20gcmVzcG9uc2VcbiAgICBjb25zdCB7IHBhc3N3b3JkX2hhc2gsIC4uLnVzZXJXaXRob3V0UGFzc3dvcmQgfSA9IHVzZXI7XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xuICAgICAgdXNlcjogdXNlcldpdGhvdXRQYXNzd29yZCxcbiAgICAgIHRva2VuXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignTG9naW4gZXJyb3I6JywgZXJyb3IpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgbWVzc2FnZTogJ0ludGVybmFsIHNlcnZlciBlcnJvcicgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn0gIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImJjcnlwdCIsImp3dCIsInF1ZXJ5IiwiUE9TVCIsInJlcXVlc3QiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwianNvbiIsInJlc3VsdCIsInVzZXIiLCJyb3dzIiwibWVzc2FnZSIsInN0YXR1cyIsInZhbGlkUGFzc3dvcmQiLCJjb21wYXJlIiwicGFzc3dvcmRfaGFzaCIsInRva2VuIiwic2lnbiIsImlkIiwicm9sZSIsInByb2Nlc3MiLCJlbnYiLCJKV1RfU0VDUkVUIiwiZXhwaXJlc0luIiwidXNlcldpdGhvdXRQYXNzd29yZCIsImVycm9yIiwiY29uc29sZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/login/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/db/db.ts":
/*!**********************!*\
  !*** ./src/db/db.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   query: () => (/* binding */ query)\n/* harmony export */ });\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pg */ \"pg\");\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pg__WEBPACK_IMPORTED_MODULE_0__);\n\nconst pool = new pg__WEBPACK_IMPORTED_MODULE_0__.Pool({\n    user: process.env.DB_USER || \"postgres\",\n    host: process.env.DB_HOST || \"localhost\",\n    database: process.env.DB_NAME || \"threadflow\",\n    password: process.env.DB_PASSWORD || \"postgres\",\n    port: parseInt(process.env.DB_PORT || \"5432\")\n});\nconst query = (text, params)=>pool.query(text, params);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pool);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvZGIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUEwQjtBQUUxQixNQUFNQyxPQUFPLElBQUlELG9DQUFJQSxDQUFDO0lBQ3BCRSxNQUFNQyxRQUFRQyxHQUFHLENBQUNDLE9BQU8sSUFBSTtJQUM3QkMsTUFBTUgsUUFBUUMsR0FBRyxDQUFDRyxPQUFPLElBQUk7SUFDN0JDLFVBQVVMLFFBQVFDLEdBQUcsQ0FBQ0ssT0FBTyxJQUFJO0lBQ2pDQyxVQUFVUCxRQUFRQyxHQUFHLENBQUNPLFdBQVcsSUFBSTtJQUNyQ0MsTUFBTUMsU0FBU1YsUUFBUUMsR0FBRyxDQUFDVSxPQUFPLElBQUk7QUFDeEM7QUFFTyxNQUFNQyxRQUFRLENBQUNDLE1BQWNDLFNBQW1CaEIsS0FBS2MsS0FBSyxDQUFDQyxNQUFNQyxRQUFRO0FBRWhGLGlFQUFlaEIsSUFBSUEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RocmVhZGZsb3cvLi9zcmMvZGIvZGIudHM/OTJjYSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQb29sIH0gZnJvbSAncGcnO1xuXG5jb25zdCBwb29sID0gbmV3IFBvb2woe1xuICB1c2VyOiBwcm9jZXNzLmVudi5EQl9VU0VSIHx8ICdwb3N0Z3JlcycsXG4gIGhvc3Q6IHByb2Nlc3MuZW52LkRCX0hPU1QgfHwgJ2xvY2FsaG9zdCcsXG4gIGRhdGFiYXNlOiBwcm9jZXNzLmVudi5EQl9OQU1FIHx8ICd0aHJlYWRmbG93JyxcbiAgcGFzc3dvcmQ6IHByb2Nlc3MuZW52LkRCX1BBU1NXT1JEIHx8ICdwb3N0Z3JlcycsXG4gIHBvcnQ6IHBhcnNlSW50KHByb2Nlc3MuZW52LkRCX1BPUlQgfHwgJzU0MzInKSxcbn0pO1xuXG5leHBvcnQgY29uc3QgcXVlcnkgPSAodGV4dDogc3RyaW5nLCBwYXJhbXM/OiBhbnlbXSkgPT4gcG9vbC5xdWVyeSh0ZXh0LCBwYXJhbXMpO1xuXG5leHBvcnQgZGVmYXVsdCBwb29sOyAiXSwibmFtZXMiOlsiUG9vbCIsInBvb2wiLCJ1c2VyIiwicHJvY2VzcyIsImVudiIsIkRCX1VTRVIiLCJob3N0IiwiREJfSE9TVCIsImRhdGFiYXNlIiwiREJfTkFNRSIsInBhc3N3b3JkIiwiREJfUEFTU1dPUkQiLCJwb3J0IiwicGFyc2VJbnQiLCJEQl9QT1JUIiwicXVlcnkiLCJ0ZXh0IiwicGFyYW1zIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/db/db.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/jsonwebtoken","vendor-chunks/jws","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/safe-buffer","vendor-chunks/ms","vendor-chunks/lodash.once","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isinteger","vendor-chunks/lodash.isboolean","vendor-chunks/lodash.includes","vendor-chunks/jwa","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2FUsers%2Fabhishekyadav%2FDesktop%2FINFO2222%2FINFO2222_PROJECT_PHASE1%2FThreadflow_Main%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fabhishekyadav%2FDesktop%2FINFO2222%2FINFO2222_PROJECT_PHASE1%2FThreadflow_Main&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();