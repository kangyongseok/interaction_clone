(() => {
    const sceneInfo = [
        // 스크롤의 높이를 정하는 배열
        {
            type: 'sticky',
            scrollHeight: 0,
            heightNum: 5,
            objs: {
                container: document.querySelector('.scroll_section_1')
            }
        },
        {
            type: 'normal',
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
        },
        {
            type: 'sticky',
            scrollHeight: 0,
            heightNum: 5,
            objs: {
                container: document.querySelector('.scroll_section_4')
            }
        }
    ];

    const setLayout = () => {
        for(let i = 0; i < sceneInfo.length; i++) {
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}`
        }
        console.log(sceneInfo)
    }

    window.addEventListener('resize', setLayout());

    setLayout();
})();