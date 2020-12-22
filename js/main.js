/*
백그라운드 비디오 제어방법 은 총 세가지
1. 직접 비디오파일을 제어하여 스크롤에따라 동작하게 한다
- 단점 저해상도일때 스크롤에 따른 동작이 자연스러운데 그러면 큰화면에서볼땐 깨져보임 그래서 고해상도의 영상으로 사용하게되면 버벅거림이 발생해서 옳은 방법은 아님

2. 이미지를 사용
수백장의 이미지를 사용하여 스크롤에 따른 이미지 전환을 통해서 동작하게 만듬
적절한 이미지의 압축이 필요함
단점은 수백장의 이미지 다운로드받는데 시간이 필요함

3. 캔버스 사용
애플에서도 사용중인 방식
*/

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
                canvas: document.querySelector('.video_canvas_0'),
                context: document.querySelector('.video_canvas_0').getContext('2d'),
                videoImages: []
            },
            values: {
                videoImageCount: 300,
                imageSequence: [0, 299],
                canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
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
                container: document.querySelector('.scroll_section_2'),
                canvas: document.querySelector('.video_canvas_1'),
                context: document.querySelector('.video_canvas_1').getContext('2d'),
                videoImages: []
            },
            values: {
                videoImageCount: 960,
                imageSequence: [0, 959],
                canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
                canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
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

    const setCanvasImages = () => {
        const videoImagesNum = sceneInfo[0].values.videoImageCount;
        const videoImagesNum2 = sceneInfo[2].values.videoImageCount;
        let imgEl
        for (let i = 0; i < videoImagesNum; i++) {
            imgEl = new Image();
            imgEl.src = `./video/001/IMG_${6726 + i}.JPG`;
            sceneInfo[0].objs.videoImages.push(imgEl);
        }
        let imgEl2
        for (let i = 0; i < videoImagesNum2; i++) {
            imgEl2 = new Image();
            imgEl2.src = `./video/002/IMG_${7027 + i}.JPG`;
            sceneInfo[2].objs.videoImages.push(imgEl2);
        }
    }
    setCanvasImages();

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

        const heightRatio = window.innerHeight / 1000;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
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
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffSet));
                objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffSet);
                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffSet);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffSet)}%)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_translateY_out, currentYOffSet);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYOffSet)}%)`;
                }

                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffSet);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffSet)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffSet);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffSet)}%, 0)`;
                }
    
                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffSet);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffSet)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffSet);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffSet)}%, 0)`;
                }
    
                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffSet);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffSet)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffSet);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffSet)}%, 0)`;
                }


                break;
            case 1:
                break;
            case 2:
                let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffSet));
                objs.context.drawImage(objs.videoImages[sequence2], 0, 0);
                if (scrollRatio <= 0.5) {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffSet);
                } else {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffSet);
                }
                
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
    window.addEventListener('load', () => {
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
    }) ;
    window.addEventListener('resize', setLayout);
})();
