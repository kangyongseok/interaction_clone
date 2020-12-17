(() => {
    let yOffset = 0;
    let prevScrollHeight = 0;
    let currentScene = 0;

    const sceneInfo = [
        // 스크롤의 높이를 정하는 배열
        {
            type: 'sticky',
            scrollHeight: 0,
            heightNum: 5,
            objs: {
                container: document.querySelector('.scroll_section_0')
            }
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
        console.log(sceneInfo)
    }
    const scrollLoop = () => {
        prevScrollHeight = 0;
        for(let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            currentScene++;
        }

        if (yOffset < prevScrollHeight) {
            if (currentScene === 0) return;
            currentScene--;
        }
        
        document.body.setAttribute('id', `show_scene_${currentScene}`);
    }

    window.addEventListener('resize', setLayout());
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    })

    setLayout();
})();
