exports.id = 968;
exports.ids = [968];
exports.modules = {

/***/ 7054:
/***/ ((module) => {

// Exports
module.exports = {
	"timeline": "Timeline_timeline__TVfgV",
	"item": "Timeline_item__eavab",
	"marker": "Timeline_marker__IG8rD",
	"date": "Timeline_date__WgDJ8",
	"role": "Timeline_role__Xo_Tc",
	"description": "Timeline_description__GQBVS",
	"techStack": "Timeline_techStack__AslzX"
};


/***/ }),

/***/ 5968:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ Timeline)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Timeline_module_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7054);
/* harmony import */ var _Timeline_module_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_Timeline_module_css__WEBPACK_IMPORTED_MODULE_1__);


function Timeline({ items  }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: (_Timeline_module_css__WEBPACK_IMPORTED_MODULE_1___default().timeline),
        children: items.map((item, idx)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_Timeline_module_css__WEBPACK_IMPORTED_MODULE_1___default().item),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: (_Timeline_module_css__WEBPACK_IMPORTED_MODULE_1___default().marker)
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: (_Timeline_module_css__WEBPACK_IMPORTED_MODULE_1___default().date),
                        children: item.date
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: (_Timeline_module_css__WEBPACK_IMPORTED_MODULE_1___default().content),
                        children: [
                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("h3", {
                                className: (_Timeline_module_css__WEBPACK_IMPORTED_MODULE_1___default().role),
                                children: [
                                    item.role,
                                    " @ ",
                                    item.company
                                ]
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("ul", {
                                className: (_Timeline_module_css__WEBPACK_IMPORTED_MODULE_1___default().description),
                                children: item.description.map((desc, i)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("li", {
                                        children: desc
                                    }, i))
                            }),
                            item.techStack && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: (_Timeline_module_css__WEBPACK_IMPORTED_MODULE_1___default().techStack),
                                children: item.techStack.join(" • ")
                            })
                        ]
                    })
                ]
            }, idx))
    });
}


/***/ })

};
;