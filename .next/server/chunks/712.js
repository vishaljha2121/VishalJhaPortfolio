exports.id = 712;
exports.ids = [712];
exports.modules = {

/***/ 8646:
/***/ ((module) => {

// Exports
module.exports = {
	"card": "ProjectCard_card__BRwfT",
	"linkWrapper": "ProjectCard_linkWrapper__i0Bdz",
	"title": "ProjectCard_title__Khf44",
	"description": "ProjectCard_description__diwJz",
	"tags": "ProjectCard_tags__JzvyD",
	"tag": "ProjectCard_tag__ufLNO",
	"links": "ProjectCard_links__UsZM6"
};


/***/ }),

/***/ 1288:
/***/ ((module) => {

// Exports
module.exports = {
	"hero": "Home_hero__cwxAA",
	"heroContent": "Home_heroContent__x6iHE",
	"title": "Home_title__T09hD",
	"subtitle": "Home_subtitle__j4GMd",
	"bio": "Home_bio__C_JdL",
	"ctaGroup": "Home_ctaGroup__ldwSm",
	"section": "Home_section__taYTg",
	"sectionTitle": "Home_sectionTitle__GgIAn",
	"grid": "Home_grid__GxQ85",
	"focusCard": "Home_focusCard__4q3_Y",
	"highlights": "Home_highlights__LShCx",
	"highlightGrid": "Home_highlightGrid__NWKq_",
	"highlightItem": "Home_highlightItem__ZJ7Kx",
	"number": "Home_number__SVhPT",
	"label": "Home_label__UYtOa",
	"projectGrid": "Home_projectGrid__eAs_v"
};


/***/ }),

/***/ 2248:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (/* binding */ ProjectCard)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1664);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ProjectCard_module_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8646);
/* harmony import */ var _ProjectCard_module_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_ProjectCard_module_css__WEBPACK_IMPORTED_MODULE_2__);



function ProjectCard({ title , description , tags , href , github , demo  }) {
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (_ProjectCard_module_css__WEBPACK_IMPORTED_MODULE_2___default().card),
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_1___default()), {
                href: href,
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("a", {
                    className: (_ProjectCard_module_css__WEBPACK_IMPORTED_MODULE_2___default().linkWrapper),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h3", {
                            className: (_ProjectCard_module_css__WEBPACK_IMPORTED_MODULE_2___default().title),
                            children: title
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                            className: (_ProjectCard_module_css__WEBPACK_IMPORTED_MODULE_2___default().description),
                            children: description
                        })
                    ]
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: (_ProjectCard_module_css__WEBPACK_IMPORTED_MODULE_2___default().tags),
                children: tags.map((tag)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        className: (_ProjectCard_module_css__WEBPACK_IMPORTED_MODULE_2___default().tag),
                        children: tag
                    }, tag))
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_ProjectCard_module_css__WEBPACK_IMPORTED_MODULE_2___default().links),
                children: [
                    github && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                        href: github,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        children: "GitHub"
                    }),
                    demo && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                        href: demo,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        children: "Demo"
                    })
                ]
            })
        ]
    });
}


/***/ })

};
;