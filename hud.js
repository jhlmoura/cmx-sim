
/* =====================================================
   GUNBOUND HUD — REFINAMENTO VISUAL
   Layout equilibrado, compacto e responsivo
   ===================================================== */

#hud-wrapper {
    --hud-bg: #c5c9c8;
    --hud-panel: #a9b0b3;
    --hud-border: #41494f;
    --hud-dark: #263442;
    --hud-text: #17212b;
    --hud-yellow: #f6c400;
    --hud-highlight: #fff0a6;

    position: absolute;
    inset: auto 0 0;
    z-index: 200;

    height: 96px;
    box-sizing: border-box;
    padding: 8px 16px;

    display: grid;
    grid-template-columns: minmax(190px, 1fr) 166px minmax(250px, 1.35fr);
    align-items: center;
    gap: 18px;

    background: linear-gradient(
        180deg,
        #d0d3d0 0%,
        #b9c0c1 12%,
        #969fa4 100%
    );

    border-top: 2px solid #edf0e9;
    box-shadow:
        0 -2px 0 #626d74,
        0 -5px 14px rgb(0 0 0 / 25%);

    font-family: "Segoe UI", Tahoma, sans-serif;
    color: var(--hud-text);
    user-select: none;
    box-sizing: border-box;
}

#hud-wrapper *,
#hud-wrapper *::before,
#hud-wrapper *::after {
    box-sizing: border-box;
}

/* =====================================================
   PAINEL ESQUERDO — MAPA
   ===================================================== */

.hud-section-left {
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
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
        inset 0 1px 0 rgb(255 255 255 / 25%),
        0 2px 3px rgb(0 0 0 / 30%);
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
    transition: background 100ms ease;
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
    background: rgb(255 255 255 / 12%);
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

    box-shadow: 0 5px 18px rgb(0 0 0 / 45%);
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

    transition: border-color 120ms ease,
                background 120ms ease;
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

/* =====================================================
   CENTRO — CONTROLE DE VENTO E TIROS
   ===================================================== */

.hud-section-center {
    position: relative;
    width: 166px;
    height: 124px;
    margin: -27px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
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
        inset 0 -5px 10px rgb(0 0 0 / 20%),
        0 3px 6px rgb(0 0 0 / 35%);
}

/* Base escura atrás dos seletores */

.dial-dark-bg {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(
        from 215deg,
        #43576a 0deg,
        #263544 210deg,
        #526273 360deg
    );
    border: 3px solid #1b2732;
    z-index: 1;
}

/* Três seletores com o mesmo tamanho e espaçamento */

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
        inset 0 1px 0 rgb(255 255 255 / 90%),
        0 1px 2px rgb(0 0 0 / 40%);

    cursor: pointer;
    z-index: 10;

    font-size: 14px;
    font-weight: 900;

    transition: background 100ms ease,
                color 100ms ease;
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
        inset 0 1px 0 rgb(255 255 255 / 90%),
        0 0 0 1px #f8dc65,
        0 2px 4px rgb(0 0 0 / 35%);

    z-index: 12;
}

/* Vento: círculo perfeitamente centralizado */

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
        inset 0 2px 3px rgb(255 255 255 / 15%),
        inset 0 -5px 9px rgb(0 0 0 / 45%),
        0 1px 3px rgb(0 0 0 / 50%);

    cursor: crosshair;
    z-index: 20;
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

    filter: drop-shadow(0 0 2px rgb(255 155 22 / 70%));
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

/* Satélites distribuídos sem empurrar a roleta */

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
        inset 0 1px 0 rgb(255 255 255 / 85%),
        0 2px 3px rgb(0 0 0 / 35%);

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

/* =====================================================
   DIREITA — FORÇA E MOBILE
   ===================================================== */

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
        inset 0 1px 0 rgb(255 255 255 / 80%),
        0 2px 3px rgb(0 0 0 / 20%);
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
        inset 0 2px 4px rgb(0 0 0 / 50%),
        0 1px 0 rgb(255 255 255 / 40%);
}

.power-marks {
    position: absolute;
    inset: 0;

    background: repeating-linear-gradient(
        to right,
        transparent 0,
        transparent calc(25% - 1px),
        rgb(255 255 255 / 55%) calc(25% - 1px),
        rgb(255 255 255 / 55%) 25%
    );

    pointer-events: none;
    z-index: 2;
}

.power-fill {
    width: 0%;
    height: 100%;

    background: linear-gradient(
        90deg,
        #e9d400 0%,
        #f6a900 55%,
        #df3b22 100%
    );

    box-shadow: inset 0 1px 0 rgb(255 255 255 / 40%);
    transition: width 100ms linear;
}

.mobile-selector {
    flex: 0 0 66px;
    width: 66px;
    height: 38px;
    margin: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;
    padding: 3px;

    background: linear-gradient(#f8f8ef, #c6ccca);
    color: #202b34;

    border: 1px solid #48535a;
    border-radius: 3px;

    box-shadow:
        inset 0 1px 0 #fff,
        0 1px 2px rgb(0 0 0 / 25%);

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

/* =====================================================
   RESPONSIVIDADE
   ===================================================== */

@media (max-width: 760px) {
    #hud-wrapper {
        height: 86px;
        padding: 6px 8px;
        grid-template-columns: minmax(105px, 1fr) 130px minmax(125px, 1fr);
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
        grid-template-columns: 1fr 112px 1fr;
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
