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
                messageA_opacity: [0, 1],
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
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
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
        let scrollRatio = currentYOffSet / sceneInfo[currentScene].scrollHeight; 
        rv = scrollRatio * (values[1] - values[0]) + values[0];
        return rv;
    }

    const playAnimation = () => {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffSet = yOffset - prevScrollHeight;

        switch(currentScene) {
            case 0:
                let messageA_opacity_in = calcValues(values.messageA_opacity, currentYOffSet);
                console.log(messageA_opacity_in)
                objs.messageA.style.opacity = messageA_opacity_in
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
