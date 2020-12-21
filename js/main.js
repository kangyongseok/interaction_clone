(() => {
    let yOffset = 0;
    let prevScrollHeight = 0;
    let currentScene = 0;
    let enterNewScene = false;

    const sceneInfo = [
        // 스크롤의 높이를 정하는 배열
        {
            type: 'sticky',
            scrollHeight: 0,
            heightNum: 5,
            objs: {
                container: document.querySelector('.scroll_section_0'),
                messageA: document.querySelector('.scroll_section_0 .main_message.a'),
                messageB: document.querySelector('.scroll_section_0 .main_message.b'),
                messageC: document.querySelector('.scroll_section_0 .main_message.c'),
                messageD: document.querySelector('.scroll_section_0 .main_message.d'),
            },
            values: {
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }], 
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],

                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }], 
            },
        },
        {
            type: 'normal',
            scrollHeight: 0,
            heightNum: 5,
            objs: {
                container: document.querySelector('.scroll_section_1')
            }
        },
        {
            type: 'sticky',
            scrollHeight: 0,
            heightNum: 5,
            objs: {
                container: document.querySelector('.scroll_section_2')
            }
        },
        {
            type: 'sticky',
            scrollHeight: 0,
            heightNum: 5,
            objs: {
                container: document.querySelector('.scroll_section_3')
            }
        }
    ];

    const setLayout = () => {
        for(let i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
                sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`
            }
            if (sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`
        }

        let totalScrollHeight = 0;
        for(let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= pageYOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show_scene_${currentScene}`);
    }

    const calcValues = (values, currentYOffSet) => {
        let rv;
        const scrolleHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffSet / scrolleHeight;
        if (values.length === 3) {
            const partScrolleStart = values[2].start * scrolleHeight;
            const partScrolleEnd = values[2].end * scrolleHeight;
            const partScrollHeight = partScrolleEnd - partScrolleStart;
            if (currentYOffSet >= partScrolleStart && currentYOffSet <= partScrolleEnd) {
                rv = (currentYOffSet - partScrolleStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if (currentYOffSet < partScrolleStart) {
                rv = values[0];
            } else if (currentYOffSet > partScrolleEnd) {
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }
        return rv;
    }

    const playAnimation = () => {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffSet = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffSet / scrollHeight;

        switch(currentScene) {
            case 0:
                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffSet);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffSet)}%)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_translateY_out, currentYOffSet);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYOffSet)}%)`;
                }
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            default:
                break;
        }
    }

    const scrollLoop = () => { 
        prevScrollHeight = 0;
        enterNewScene = false;
        for(let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id', `show_scene_${currentScene}`);
        }

        if (yOffset < prevScrollHeight) {
            if (currentScene === 0) return;
            enterNewScene = true;
            currentScene--;
            document.body.setAttribute('id', `show_scene_${currentScene}`);
        }

        if (enterNewScene) return;

        playAnimation();
    }

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    })
    window.addEventListener('load', setLayout) ;
    window.addEventListener('resize', setLayout);
})();
