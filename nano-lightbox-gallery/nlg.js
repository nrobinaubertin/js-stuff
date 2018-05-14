// nano lightbox gallery
window.nlg = {
    list: [],
    bodyStyle: "",
    nlgStyles: `
        #nlg-modal-bg {
            position: fixed;
            width: 100%; height: 100%;
            top: 0; left: 0; right: 0; bottom: 0;
            z-index: 9997;
            background: rgba(0, 0, 0, 0.7);
            display: flex; justify-content: center; align-items: center;
        }
        .nlg-next, .nlg-prev, .nlg-close {
            cursor: pointer;
            position: absolute;
            top: 50%;
            padding: 19px 22px 22px 22px;
            margin-top: -3rem;
            color: white;
            font-size: 2rem;
            background: rgba(0, 0, 0, 0.2);
            transition: .5s;
        }
        .nlg-next:hover, .nlg-prev:hover, .nlg-close {
            background: rgba(0, 0, 0, 0.5);
        }
        .nlg-close {
            position: fixed;
            z-index: 9999;
            right: 0; top: 0;
            border-radius: 0 0 0 3px;
            transform: translateY(50%);
            font-weight: bold;
        }
        .nlg-next {
            right: 0;
            border-radius: 3px 0 0 3px;
        }
        .nlg-prev {
            left: 0;
            border-radius: 0 3px 3px 0;
        }
        #nlg-modal {
            left: 0;
            position: absolute;
            overflow: visible;
            z-index: 9998;
            width: 100%;
            box-sizing: border-box;
            opacity: 0;
            transition: 300ms;
        }
        #nlg-modal > img {
            position: relative;
            left: 0;
            transition: 300ms;
        }
        .nlg-left {
            left: -${window.innerWidth}px !important;
        }
        .nlg-right {
            left: ${window.innerWidth}px !important;
        }
        .nlg-spinner {
            margin: 100px auto;
            width: 50px;
            height: 40px;
            display: flex;
            justify-content: space-between;
            opacity: 0;
            transition: 500ms;
        }
        .nlg-spinner > div {
            background-color: #fff;
            height: 100%;
            width: 6px;
            animation: nlg-stretchdelay 1.2s infinite ease-in-out;
        }
        .nlg-spinner :nth-child(2) {
            animation-delay: -1.1s;
        }
        .nlg-spinner :nth-child(3) {
            animation-delay: -1.0s;
        }
        .nlg-spinner :nth-child(4) {
            animation-delay: -0.9s;
        }
        .nlg-spinner :nth-child(5) {
            animation-delay: -0.8s;
        }
        @keyframes nlg-stretchdelay {
            0%, 40%, 100% {
                transform: scaleY(0.4);
            }  20% {
                transform: scaleY(1.0);
            }
        }
    `,
    start: () => {
        document.querySelectorAll("[data-nlg]").forEach(
            elm => {
                nlg.list.push(elm);
                elm.addEventListener("click", e => {
                    e.preventDefault();
                    nlg.show(elm);
                });
            }
        );
        if (!document.getElementById("nlg-styles")) {
            let nlgStyles = document.createElement("style");
            nlgStyles.id = "nlg-styles";
            nlgStyles.innerHTML = nlg.nlgStyles;
            document.body.append(nlgStyles);
        }
    },
    show: (e, keepBackground = false, side = null) => {
        let url = e.dataset.src || e.src || e.href;
        let img = new Image();
        img.src = url;
        if (side) {
            img.classList.add("nlg-"+side);
        }
        nlg.bodyStyle = document.body.style.cssText;
        document.body.style.cssText = "overflow: hidden";
        if (!keepBackground) {
            let modalBackground = document.createElement("div");
            modalBackground.id = "nlg-modal-bg";
            modalBackground.addEventListener("click", e => {
                if (e.currentTarget != e.target) { return; }
                nlg.hide();
            });
            let close = document.createElement("a");
            close.classList.add("nlg-close");
            close.innerHTML = "&times;";
            close.addEventListener("click", nlg.hide);
            nlg.keyPressClose = e => e.keyCode == 27 && nlg.hide();
            window.addEventListener("keypress", nlg.keyPressClose);
            document.body.appendChild(close);
            document.body.appendChild(modalBackground);
        }
        let spinner = document.createElement("div");
        spinner.classList.add("nlg-spinner");
        for(let i = 0; i < 5; i++) {
            spinner.appendChild(document.createElement("div"));
        }
        setTimeout(() => {
            let spinner = document.querySelector(".nlg-spinner");
            if (spinner) {
                spinner.style.opacity = 1;
            }
        }, 500);
        document.getElementById("nlg-modal-bg").appendChild(spinner);
        let modal = document.createElement("div");
        modal.id = "nlg-modal";
        modal.appendChild(img);
        document.body.appendChild(modal);
        img.addEventListener("load", () => {
            document.querySelector(".nlg-spinner").outerHTML = "";
            if (window.innerWidth/window.innerHeight > img.width/img.height) {
                img.height = window.innerHeight;
            } else {
                img.width = window.innerWidth;
            }
            let currentIndex = nlg.list.findIndex(e => url === (e.dataset.src || e.src || e.href));
            let nextElmt = nlg.list[currentIndex + 1];
            let prevElmt = nlg.list[currentIndex - 1];
            if (nextElmt) {
                let next = document.createElement("a");
                next.classList.add("nlg-next");
                next.innerHTML = "&#10095;";
                let nextFn = e => {
                    nlg.moveLeft();
                    setTimeout(() => {
                        nlg.hide(true);
                        nlg.show(nextElmt, true, "right");
                    }, 300);
                };
                next.addEventListener("click", nextFn);
                nlg.keyPressRight = e => e.keyCode == 39 && nextFn(e);
                window.addEventListener("keypress", nlg.keyPressRight);
                modal.appendChild(next);
            }
            if (prevElmt) {
                let prev = document.createElement("a");
                prev.innerHTML = "&#10094;";
                prev.classList.add("nlg-prev");
                let prevFn = e => {
                    nlg.moveRight();
                    setTimeout(() => {
                        nlg.hide(true);
                        nlg.show(prevElmt, true, "left");
                    }, 300);
                };
                prev.addEventListener("click", prevFn);
                nlg.keyPressLeft = e => e.keyCode == 37 && prevFn(e);
                window.addEventListener("keypress", nlg.keyPressLeft);
                modal.appendChild(prev);
            }
            modal.style.cssText = `
                top: ${document.body.scrollTop + Math.floor(window.innerHeight/2 - img.scrollHeight/2)};
                padding: 0 ${document.body.scrollLeft + Math.floor(window.innerWidth/2 - img.scrollWidth/2)};
                opacity: 1;
            `;
            setTimeout(nlg.center, 1);
        });
        modal.addEventListener("click", e => {
            if (e.currentTarget != e.target) { return; }
            nlg.hide();
        });
    },
    hide: (keepBackground = false) => {
        window.removeEventListener("keypress", nlg.keyPressRight);
        window.removeEventListener("keypress", nlg.keyPressLeft);
        document.body.style.cssText = nlg.bodyStyle;
        document.getElementById("nlg-modal").outerHTML = "";
        if (keepBackground != true) {
            document.querySelector(".nlg-close").outerHTML = "";
            document.getElementById("nlg-modal-bg").outerHTML = "";
            window.removeEventListener("keypress", nlg.keyPressClose);
        }
    },
    moveLeft: () => document.querySelector("#nlg-modal > img").classList.add("nlg-left"),
    moveRight: () => document.querySelector("#nlg-modal > img").classList.add("nlg-right"),
    center: () => {
        let img = document.querySelector("#nlg-modal > img");
        img.classList.remove("nlg-right");
        img.classList.remove("nlg-left");
    },
};
