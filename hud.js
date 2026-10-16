
const GunboundHUD = {
    // =====================================================
    // 1. ESTADO
    // =====================================================
    state: {
        shot: 1,
        windForce: 7,
        windAngle: 45
    },

    // =====================================================
    // 2. CSS
    // =====================================================
    styles: `
        #hud-wrapper {
            --hud-yellow: #f6c400;
            --hud-dark: #263442;
            --hud-border: #414b54;

            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 200;

            height: 96px;
            padding: 8px 16px;
            box-sizing: border-box;

            display: grid;
            grid-template-columns: minmax(170px, 1fr) 166px minmax(230px, 1.35fr);
            align-items: center;
            gap: 18px;

            background: linear-gradient(
                180deg,
                #d0d3d0 0%,
                #b9c0c1 15%,
                #929da3 100%
            );

            border-top: 2px solid #edf0e9;
            box-shadow:
                0 -2px 0 #626d74,
                0 -5px 14px rgba(0,0,0,.25);

            font-family: "Segoe UI", Tahoma, sans-serif;
            color: #17212b;
            user-select: none;
        }

        #hud-wrapper *,
        #hud-wrapper *::before,
        #hud-wrapper *::after {
            box-sizing: border-box;
        }

        /* =========================================
           MAPA
           ========================================= */

        .hud-section-left {
            min-width: 0;
            display: flex;
            align-items: center;
        }

        #map-controls {
            position: relative;
            width: 100%;
            max-width: 260px;
            padding: 5px;

            background: linear-gradient(#3c4853, #1d2833);
            border: 1px solid #202a32;
            border-radius: 4px;

            box-shadow:
                inset 0 1px 0 rgba(255,255,255,.25),
                0 2px 3px rgba(0,0,0,.3);
        }

        #minimap-container {
            position: relative;
            display: flex;
            width: 100%;
            aspect-ratio: 211 / 47;
            min-width: 0;
            min-height: 0;
            overflow: hidden;

            background-color: #111820;
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;

            border: 1px solid #111820;
            outline: 1px solid #87939b;
        }

        .click-zone-side {
            flex: 0 0 12%;
            height: 100%;
            cursor: pointer;
            z-index: 10;
        }

        .click-zone-center {
            flex: 1;
            min-width: 0;
            height: 100%;
            cursor: pointer;
            z-index: 10;
        }

        .click-zone-side:hover,
        .click-zone-center:hover {
            background: rgba(255,255,255,.12);
        }

        #arrow-indicator {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-style: solid;
            pointer-events: none;
            filter: drop-shadow(0 1px 2px #000);
            z-index: 5;
        }

        .arrow-right {
            right: 4px;
            border-width: 5px 0 5px 7px;
            border-color: transparent transparent transparent var(--hud-yellow);
        }

        .arrow-left {
            left: 4px;
            border-width: 5px 7px 5px 0;
            border-color: transparent var(--hud-yellow) transparent transparent;
        }

        /* Lista de mapas */

        #visual-map-list {
            position: absolute;
            bottom: calc(100% + 10px);
            left: 0;

            display: none;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 8px;

            width: min(560px, 75vw);
            max-height: 55vh;
            overflow-y: auto;
            padding: 10px;

            background: #d0d4d2;
            border: 2px solid #414b53;
            border-radius: 5px;

            box-shadow: 0 5px 18px rgba(0,0,0,.45);
            z-index: 300;
        }

        #visual-map-list::-webkit-scrollbar {
            width: 7px;
        }

        #visual-map-list::-webkit-scrollbar-thumb {
            background: #687680;
            border-radius: 4px;
        }

        .map-item-card {
            min-width: 0;
            overflow: hidden;
            cursor: pointer;
            text-align: center;
            color: #1d2833;

            background: #edf0ed;
            border: 2px solid #899398;
            border-radius: 3px;

            transition: border-color .12s, background .12s;
        }

        .map-item-card:hover {
            border-color: #b28a00;
            background: #fff6cf;
        }

        .map-item-preview {
            width: 100%;
            aspect-ratio: 211 / 47;
            height: auto;

            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;

            border-bottom: 1px solid #8b9498;
        }

        .map-item-name {
            padding: 5px 4px;
            font-size: 11px;
            line-height: 1.2;
            font-weight: 700;
        }

        /* =========================================
           ROLETА CENTRAL
           ========================================= */

        .hud-section-center {
            position: relative;
            width: 166px;
            height: 124px;
            margin: -27px 0 0;

            display: flex;
            align-items: center;
            justify-content: center;
            justify-self: center;

            z-index: 250;
        }

        .main-dial {
            position: relative;
            flex: 0 0 auto;
            width: 124px;
            height: 124px;
            border-radius: 50%;

            background: linear-gradient(145deg, #e4e3d8, #a7afb2);
            border: 2px solid #35404a;

            box-shadow:
                inset 0 0 0 3px #d5d8d1,
                inset 0 -5px 10px rgba(0,0,0,.2),
                0 3px 6px rgba(0,0,0,.35);
        }

        .dial-dark-bg {
            position: absolute;
            inset: 0;
            border-radius: 50%;

            background: conic-gradient(
                from 215deg,
                #43576a,
                #263544 210deg,
                #526273
            );

            border: 3px solid #1b2732;
            z-index: 1;
        }

        /* Seletores alinhados em uma única fileira */

        .dial-button {
            position: absolute;
            top: 8px;
            width: 30px;
            height: 27px;
            padding: 0;

            display: flex;
            align-items: center;
            justify-content: center;

            background: linear-gradient(#f3f0df, #bfc5c4);
            color: #1b2835;

            border: 1px solid #17222d;
            border-radius: 4px;

            box-shadow:
                inset 0 1px 0 rgba(255,255,255,.9),
                0 1px 2px rgba(0,0,0,.4);

            cursor: pointer;
            z-index: 10;

            font-size: 14px;
            font-weight: 900;

            transition: background .1s, color .1s;
        }

        .btn-t1 {
            left: 9px;
            transform: none;
        }

        .btn-t2 {
            left: 45px;
            transform: none;
        }

        .btn-ss {
            left: 81px;
            transform: none;
        }

        .dial-button span {
            display: inline-block;
            transform: none;
        }

        .btn-ss span {
            font-size: 11px;
        }

        .dial-button:hover {
            background: #fff5c8;
        }

        .dial-button.active {
            background: linear-gradient(#ffe778, #f4bd00);
            color: #17212b;
            border-color: #7a5700;

            box-shadow:
                inset 0 1px 0 rgba(255,255,255,.9),
                0 0 0 1px #f8dc65,
                0 2px 4px rgba(0,0,0,.35);

            z-index: 12;
        }

        /* Círculo do vento */

        .wind-circle {
            position: absolute;
            left: 50%;
            top: 68px;
            transform: translate(-50%, -50%);

            width: 78px;
            height: 78px;
            border-radius: 50%;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            background: radial-gradient(
                circle at 35% 25%,
                #506276,
                #263543 65%,
                #141e29
            );

            border: 2px solid #111a23;

            box-shadow:
                inset 0 2px 3px rgba(255,255,255,.15),
                inset 0 -5px 9px rgba(0,0,0,.45),
                0 1px 3px rgba(0,0,0,.5);

            cursor: crosshair;
            z-index: 20;
            touch-action: none;
        }

        .wind-arrow-container {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
        }

        .wind-arrow {
            position: absolute;
            top: 6px;
            left: 50%;
            transform: translateX(-50%);

            width: 0;
            height: 0;

            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 10px solid #ff9b16;

            filter: drop-shadow(0 0 2px rgba(255,155,22,.7));
        }

        #wind-input {
            position: relative;
            z-index: 2;

            width: 52px;
            margin: 8px 0 0;
            padding: 0;

            background: transparent;
            border: none;
            outline: none;

            color: #fff;
            font-family: inherit;
            font-size: 27px;
            font-weight: 900;
            line-height: 1;
            text-align: center;
            text-shadow: 0 1px 3px #000;

            cursor: text;
            user-select: text;
        }

        #wind-input::-webkit-inner-spin-button,
        #wind-input::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        #wind-input[type="number"] {
            -moz-appearance: textfield;
            appearance: textfield;
        }

        /* Botões satélites */

        .satellite-btn {
            position: absolute;
            width: 23px;
            height: 23px;
            padding: 0;

            display: flex;
            align-items: center;
            justify-content: center;

            background: linear-gradient(#ffe36a, #e5ad00);
            color: #18232d;

            border: 1px solid #4b3c0b;
            border-radius: 50%;

            box-shadow:
                inset 0 1px 0 rgba(255,255,255,.85),
                0 2px 3px rgba(0,0,0,.35);

            cursor: pointer;
            z-index: 30;
        }

        .satellite-btn:hover {
            filter: brightness(1.08);
        }

        .satellite-btn:active {
            transform: scale(.94);
        }

        .sat-1 {
            top: 27px;
            right: -1px;
        }

        .sat-2 {
            top: 58px;
            right: -9px;
            width: 25px;
            height: 25px;
            background: linear-gradient(#fff, #cbd2d4);
        }

        .sat-3 {
            top: 88px;
            right: -1px;
        }

        .sat-options {
            right: 12px;
            bottom: -5px;
            top: auto;

            width: 29px;
            height: 22px;
            border-radius: 4px;

            background: linear-gradient(#e2e5e3, #9ba5aa);
            color: #293845;
            font-size: 9px;
            font-weight: 900;
        }

        /* =========================================
           FORÇA E MOBILE
           ========================================= */

        .hud-section-power {
            min-width: 0;
            width: 100%;
            height: 54px;
            margin: 0;
            padding: 7px 9px;

            display: flex;
            align-items: center;
            gap: 12px;

            background: linear-gradient(#d9dcda, #aeb6b8);
            border: 1px solid #59656d;
            border-radius: 4px;

            box-shadow:
                inset 0 1px 0 rgba(255,255,255,.8),
                0 2px 3px rgba(0,0,0,.2);
        }

        .power-bar-container {
            position: relative;
            flex: 1;
            min-width: 0;
            height: 20px;
            overflow: hidden;

            background: #27313a;
            border: 1px solid #18212a;
            border-radius: 2px;

            box-shadow:
                inset 0 2px 4px rgba(0,0,0,.5),
                0 1px 0 rgba(255,255,255,.4);
        }

        .power-marks {
            position: absolute;
            inset: 0;

            background: repeating-linear-gradient(
                to right,
                transparent 0,
                transparent calc(25% - 1px),
                rgba(255,255,255,.55) calc(25% - 1px),
                rgba(255,255,255,.55) 25%
            );

            pointer-events: none;
            z-index: 2;
        }

        .power-fill {
            width: 40%;
            height: 100%;

            background: linear-gradient(
                90deg,
                #e9d400,
                #f6a900 55%,
                #df3b22
            );

            box-shadow: inset 0 1px 0 rgba(255,255,255,.4);
            transition: width .1s linear;
        }

        .mobile-selector {
            flex: 0 0 66px;
            width: 66px;
            height: 38px;
            margin: 0;
            padding: 3px;

            display: flex;
            align-items: center;
            justify-content: center;

            overflow: hidden;

            background: linear-gradient(#f8f8ef, #c6ccca);
            color: #202b34;

            border: 1px solid #48535a;
            border-radius: 3px;

            box-shadow:
                inset 0 1px 0 #fff,
                0 1px 2px rgba(0,0,0,.25);

            font-size: 10px;
            font-weight: 900;
            text-align: center;
            text-overflow: ellipsis;
            white-space: nowrap;

            cursor: pointer;
        }

        .mobile-selector:hover {
            background: linear-gradient(#fff8ce, #e4d28a);
        }

        /* =========================================
           RESPONSIVIDADE
           ========================================= */

        @media (max-width: 760px) {
            #hud-wrapper {
                height: 86px;
                padding: 6px 8px;
                grid-template-columns: minmax(100px, 1fr) 130px minmax(115px, 1fr);
                gap: 6px;
            }

            .hud-section-center {
                transform: scale(.84);
                transform-origin: center center;
                margin-top: -22px;
            }

            .hud-section-power {
                height: 46px;
                padding: 5px;
                gap: 5px;
            }

            .mobile-selector {
                flex-basis: 48px;
                width: 48px;
                height: 32px;
                font-size: 9px;
            }

            #visual-map-list {
                width: min(420px, 88vw);
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }

        @media (max-width: 460px) {
            #hud-wrapper {
                grid-template-columns: minmax(0, 1fr) 112px minmax(0, 1fr);
                gap: 3px;
                padding-inline: 4px;
            }

            .hud-section-center {
                transform: scale(.72);
            }

            .mobile-selector {
                display: none;
            }
        }
    `,

    // =====================================================
    // 3. HTML
    // =====================================================
    html: `
        <div id="hud-wrapper">

            <!-- MAPA -->
            <div class="hud-section-left">
                <div id="map-controls">
                    <div id="visual-map-list"></div>

                    <div id="minimap-container">
                        <div
                            class="click-zone-side"
                            id="click-left"
                            onclick="window.GameApp.toggleSide('left')"
                            title="Lado B">
                        </div>

                        <div
                            class="click-zone-center"
                            onclick="window.GameApp.toggleMapList()"
                            title="Trocar mapa">
                        </div>

                        <div
                            class="click-zone-side"
                            id="click-right"
                            onclick="window.GameApp.toggleSide('right')"
                            title="Lado A">
                        </div>

                        <div id="arrow-indicator" class="arrow-right"></div>
                    </div>
                </div>
            </div>

            <!-- VENTO E TIROS -->
            <div class="hud-section-center">
                <div class="main-dial">
                    <div class="dial-dark-bg"></div>

                    <button
                        type="button"
                        class="dial-button btn-t1 active"
                        id="btn-t1"
                        onclick="GunboundHUD.selectShot(1)"
                        title="Tiro 1">
                        <span>1</span>
                    </button>

                    <button
                        type="button"
                        class="dial-button btn-t2"
                        id="btn-t2"
                        onclick="GunboundHUD.selectShot(2)"
                        title="Tiro 2">
                        <span>2</span>
                    </button>

                    <button
                        type="button"
                        class="dial-button btn-ss"
                        id="btn-tss"
                        onclick="GunboundHUD.selectShot('ss')"
                        title="Special Shot">
                        <span>SS</span>
                    </button>

                    <!-- Satélites -->
                    <button type="button" class="satellite-btn sat-1" title="Slot 1"></button>
                    <button type="button" class="satellite-btn sat-2" title="Slot 2"></button>
                    <button type="button" class="satellite-btn sat-3" title="Slot 3"></button>

                    <button
                        type="button"
                        class="satellite-btn sat-options"
                        title="Opções">
                        OPT
                    </button>

                    <!-- VENTO -->
                    <div
                        class="wind-circle"
                        id="wind-circle-zone"
                        title="Arraste para girar a seta">

                        <div
                            class="wind-arrow-container"
                            id="wind-arrow-rotator">
                            <div class="wind-arrow"></div>
                        </div>

                        <input
                            type="number"
                            id="wind-input"
                            value="07"
                            min="0"
                            max="26"
                            aria-label="Força do vento"
                            onchange="GunboundHUD.updateWindForce(this.value)"
                            onblur="GunboundHUD.updateWindForce(this.value)">
                    </div>
                </div>
            </div>

            <!-- FORÇA E MOBILE -->
            <div class="hud-section-power">
                <div class="power-bar-container">
                    <div class="power-marks"></div>
                    <div
                        class="power-fill"
                        id="power-bar-fill"
                        style="width:40%">
                    </div>
                </div>

                <div class="mobile-selector" title="Escolher mobile">
                    Armor
                </div>
            </div>
        </div>
    `,

    // =====================================================
    // 4. SELEÇÃO DE TIRO
    // =====================================================
    selectShot: function(shotType) {
        const buttons = {
            1: document.getElementById('btn-t1'),
            2: document.getElementById('btn-t2'),
            ss: document.getElementById('btn-tss')
        };

        if (!buttons[shotType]) return;

        Object.values(buttons).forEach(button => {
            if (button) button.classList.remove('active');
        });

        this.state.shot = shotType;
        buttons[shotType].classList.add('active');
    },

    // =====================================================
    // 5. FORÇA DO VENTO
    // =====================================================
    updateWindForce: function(val) {
        let force = parseInt(val, 10);

        if (isNaN(force)) force = 0;

        force = Math.max(0, Math.min(26, force));

        this.state.windForce = force;

        const input = document.getElementById('wind-input');

        if (input) {
            input.value = String(force).padStart(2, '0');
        }
    },

    // =====================================================
    // 6. DIREÇÃO DO VENTO
    // =====================================================
    initWindDrag: function() {
        const circle = document.getElementById('wind-circle-zone');
        const rotator = document.getElementById('wind-arrow-rotator');

        if (!circle || !rotator) return;

        // Evita instalar os mesmos eventos duas vezes.
        if (circle.dataset.windInitialized === 'true') return;
        circle.dataset.windInitialized = 'true';

        let isDragging = false;

        const renderAngle = () => {
            rotator.style.transform =
                `rotate(${this.state.windAngle}deg)`;
        };

        renderAngle();

        const calculateAngle = (event) => {
            const rect = circle.getBoundingClientRect();

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = event.clientX - centerX;
            const dy = event.clientY - centerY;

            // Mantém a convenção angular do código original.
            let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

            angle = (angle + 360) % 360;

            this.state.windAngle = Math.round(angle);
            renderAngle();
        };

        circle.addEventListener('pointerdown', (event) => {
            // Não iniciar o arraste ao editar o valor numérico.
            if (event.target.closest('#wind-input')) return;

            isDragging = true;

            if (circle.setPointerCapture) {
                circle.setPointerCapture(event.pointerId);
            }

            calculateAngle(event);
            event.preventDefault();
        });

        circle.addEventListener('pointermove', (event) => {
            if (!isDragging) return;
            calculateAngle(event);
        });

        const stopDragging = () => {
            isDragging = false;
        };

        circle.addEventListener('pointerup', stopDragging);
        circle.addEventListener('pointercancel', stopDragging);
        circle.addEventListener('lostpointercapture', stopDragging);
    },

    // =====================================================
    // 7. RENDERIZAÇÃO
    // =====================================================
    render: function(containerId) {
        const container = document.getElementById(containerId);

        if (!container) {
            console.error(
                'GunboundHUD: contêiner não encontrado:',
                containerId
            );
            return;
        }

        // Reutiliza a folha de estilos para evitar duplicações.
        let styleTag = document.getElementById('gunbound-hud-styles');

        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'gunbound-hud-styles';
            document.head.appendChild(styleTag);
        }

        styleTag.textContent = this.styles;

        // Monta o HUD.
        container.innerHTML = this.html;

        // Restaura o estado visual dos controles.
        this.selectShot(this.state.shot);
        this.updateWindForce(this.state.windForce);
        this.initWindDrag();
    }
};
