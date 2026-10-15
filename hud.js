const GunboundHUD = {
    // 1. O Estado do HUD
    state: {
        shot: 1,           
        windForce: 7,      
        windAngle: 45      
    },

    // 2. O CSS exclusivo do HUD - Consertando a Harmonia dos Botões
    styles: `
        #hud-wrapper {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            height: 90px;
            background: #232d3b; 
            border-top: 2px solid #141a24;
            display: flex; align-items: center; justify-content: flex-start;
            padding: 0 10px; z-index: 200;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            user-select: none;
        }

        /* --- Esquerda --- */
        .hud-section-left { display: flex; align-items: center; width: 220px; }
        #map-controls { background: #0d1117; padding: 8px; border-radius: 6px; border: 1px solid #06080b; box-shadow: 0 2px 4px rgba(0,0,0,0.8); position: relative; }
        #minimap-container { position: relative; background-color: #000; border: 2px solid #3a4354; border-radius: 4px; background-size: 100% 100%; background-repeat: no-repeat; min-width: 180px; min-height: 42px; display: flex; overflow: hidden; }
        .click-zone-side { width: 25px; height: 100%; cursor: pointer; z-index: 10; }
        .click-zone-center { flex-grow: 1; height: 100%; cursor: pointer; z-index: 10; }
        #arrow-indicator { position: absolute; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-style: solid; pointer-events: none; filter: drop-shadow(0px 0px 2px rgba(0,0,0,0.8)); z-index: 5; }
        .arrow-right { right: 4px; border-width: 5px 0 5px 7px; border-color: transparent transparent transparent #f2a900; }
        .arrow-left { left: 4px; border-width: 5px 7px 5px 0; border-color: transparent #f2a900 transparent transparent; }

        /* --- Menu Visual --- */
        #visual-map-list { position: absolute; bottom: 100%; left: 0; margin-bottom: 5px; background: rgba(17, 21, 30, 0.95); border: 1px solid #3a4354; border-radius: 8px; padding: 10px; box-shadow: 0 -4px 15px rgba(0,0,0,0.8); display: none; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; width: max-content; max-width: 70vw; max-height: 50vh; overflow-y: auto; z-index: 300; }
        #visual-map-list::-webkit-scrollbar { width: 6px; }
        #visual-map-list::-webkit-scrollbar-thumb { background: #3a4354; border-radius: 4px; }
        .map-item-card { background: #000; border: 2px solid #2b3240; border-radius: 4px; cursor: pointer; text-align: center; color: #fff; }
        .map-item-card:hover { border-color: #f2a900; transform: translateY(-2px); }
        .map-item-preview { width: 100%; height: 35px; background-size: 100% 100%; border-bottom: 1px solid #2b3240; }
        .map-item-name { padding: 4px; font-size: 11px; color: #ccc; font-weight: bold; }

        /* ================================================= */
        /* --- Roleta Central (CORRIGINDO A HARMONIA) ---    */
        /* ================================================= */
        .hud-section-center { position: relative; width: 160px; height: 120px; margin-top: -30px; margin-left: 20px; display: flex; justify-content: center; align-items: center; z-index: 250; }
        
        .main-dial { 
            position: relative; 
            width: 140px; 
            height: 140px; 
            background: #d1cfc0; 
            border-radius: 50%; 
            border: 1px solid #111; 
            box-shadow: 0 4px 8px rgba(0,0,0,0.5), inset 0 0 15px rgba(255,255,255,0.2); 
            display: flex; 
            justify-content: center; 
            align-items: center; 
        }
        
        .dial-dark-bg { position: absolute; left: 0; top: 50%; width: 50%; height: 50%; background: #475a6e; border-bottom-left-radius: 140px; z-index: 1; }

        /* Base para os botões "espremidos" (Efeito Leque) */
        .dial-button { 
            position: absolute; 
            width: 55px; 
            height: 60px; /* Um pouco mais altos para serem cortados pelo círculo negro */
            background: #e1decb; 
            border: 2px solid #222; /* Borda mais grossa igual à imagem */
            border-radius: 50% 50% 0 0; /* A base fica quadrada pois o círculo escuro cobre */
            display: flex; 
            justify-content: center; 
            align-items: flex-start; 
            padding-top: 6px; 
            font-size: 16px; 
            font-weight: 900; /* Mais negrito */
            color: #1a2a3a; 
            cursor: pointer; 
            transform-origin: center 70px; 
            box-shadow: inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(0,0,0,0.2); 
            /* Importante: Botões inativos ficam atrás do centro escuro */
            z-index: 10; 
            transition: none; /* Remoção da transição para o clique ser instantâneo como no jogo */
        }
        
        .dial-button:hover { filter: brightness(1.1); }
        
        /* O Botão ATIVO pula para a frente e engole os outros */
        .dial-button.active { 
            background: #f8b800; 
            color: #111;
            z-index: 40; /* Pula para cima de tudo, incluindo o círculo central */
            box-shadow: inset 2px 2px 4px rgba(255,255,255,0.6), inset -2px -2px 6px rgba(0,0,0,0.3), 2px 2px 5px rgba(0,0,0,0.6);
            /* Escala um pouquinho pra criar a ilusão de sobreposição perfeita */
            transform-origin: center 70px; 
        } 
        
        /* Ângulos espremidos para o Efeito Leque */
        .btn-t1 { transform: rotate(-70deg) scale(1.05); top: -10px; left: 42px; } .btn-t1 span { transform: rotate(70deg); }
        .btn-t2 { transform: rotate(-35deg) scale(1); top: -10px; left: 42px; z-index: 9;} .btn-t2 span { transform: rotate(35deg); }
        .btn-ss { transform: rotate(0deg) scale(1); top: -10px; left: 42px; z-index: 8; } .btn-ss span { transform: rotate(0deg); font-size: 14px; }

        /* Satélites (Direita) */
        .satellite-btn { position: absolute; width: 24px; height: 24px; background: #f8cc00; border-radius: 50%; border: 1px solid #111; cursor: pointer; box-shadow: inset 2px 2px 3px rgba(255,255,255,0.7), inset -2px -2px 4px rgba(0,0,0,0.4), 2px 2px 3px rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; color: #000; z-index: 15; }
        .satellite-btn:active { transform: scale(0.95); }
        .sat-1 { top: 18px; right: 8px; }
        .sat-2 { top: 58px; right: -8px; background: #fff; width: 28px; height: 28px; }
        .sat-3 { top: 100px; right: 5px; }
        .sat-options { bottom: -5px; right: 35px; width: 32px; height: 32px; background: #b5bcc6; font-weight: bold; color: #3e4a59; box-shadow: inset 2px 2px 3px rgba(255,255,255,0.9), inset -2px -2px 4px rgba(0,0,0,0.3), 1px 1px 3px rgba(0,0,0,0.5); }

        /* Centro Escuro (Cresceu para sobrepor a base dos botões de Tiro) */
        .wind-circle { 
            position: relative; 
            width: 105px; /* Aumentado */
            height: 105px; /* Aumentado */
            background: radial-gradient(circle at 30% 30%, #445163, #1e2733 80%); 
            border-radius: 50%; 
            border: 2px solid #111; /* Borda mais grossa isolando do resto */
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
            z-index: 30; /* Fica acima dos botões inativos */
            box-shadow: inset -5px -5px 15px rgba(0,0,0,0.8), inset 2px 2px 5px rgba(255,255,255,0.1), 0 0 8px rgba(0,0,0,0.8); 
            cursor: pointer; 
        }
        
        .wind-arrow-container { position: absolute; width: 100%; height: 100%; border-radius: 50%; transform: rotate(45deg); z-index: 15; pointer-events: none; }
        .wind-arrow { position: absolute; top: 12px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 10px solid #f88c00; filter: drop-shadow(0px 0px 2px rgba(255, 150, 0, 0.8)); }

        #wind-input { width: 60px; background: transparent; border: none; color: #fff; font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 36px; font-weight: 900; text-align: center; text-shadow: 0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.5); outline: none; z-index: 20; cursor: text; margin-top: 5px; }
        #wind-input::-webkit-outer-spin-button, #wind-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        #wind-input[type=number] { -moz-appearance: textfield; }

        /* --- Direita --- */
        .hud-section-power { width: 350px; display: flex; align-items: center; margin-left: 20px; background: #2f3a47; padding: 6px 10px; border-radius: 2px; border: 1px solid #111; height: 35px; border-top: 1px solid #4a5a6a; }
        .power-bar-container { flex-grow: 1; height: 18px; background: #2a221b; border: 1px solid #fff; position: relative; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.8); }
        .power-marks { position: absolute; width: 100%; height: 100%; background: repeating-linear-gradient(to right, transparent, transparent 25%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.3) 25.5%); pointer-events: none; z-index: 10;}
        .power-fill { width: 0%; height: 100%; background: linear-gradient(to right, #f8cc00, #d82b00); }
        .mobile-selector { width: 45px; height: 45px; margin-left: 15px; background: #fff; border: 2px solid #000; border-radius: 4px; display: flex; justify-content: center; align-items: center; font-size: 10px; font-weight: bold; color: #000; cursor: pointer; }
    `,

    // 3. O HTML exclusivo do HUD
    html: `
        <div id="hud-wrapper">
            
            <div class="hud-section-left">
                <div id="map-controls">
                    <div id="visual-map-list"></div>
                    <div id="minimap-container">
                        <div class="click-zone-side" id="click-left" onclick="window.GameApp.toggleSide('left')" title="Lado B"></div>
                        <div class="click-zone-center" onclick="window.GameApp.toggleMapList()" title="Trocar Mapa"></div>
                        <div class="click-zone-side" id="click-right" onclick="window.GameApp.toggleSide('right')" title="Lado A"></div>
                        <div id="arrow-indicator" class="arrow-right"></div>
                    </div>
                </div>
            </div>

            <div class="hud-section-center">
                <div class="main-dial">
                    <div class="dial-dark-bg"></div>
                    
                    <!-- Botões de Tiro: O ativo (amarelo) engole os outros -->
                    <div class="dial-button btn-t1 active" id="btn-t1" onclick="GunboundHUD.selectShot(1)" title="Tiro 1"><span>1</span></div>
                    <div class="dial-button btn-t2" id="btn-t2" onclick="GunboundHUD.selectShot(2)" title="Tiro 2"><span>2</span></div>
                    <div class="dial-button btn-ss" id="btn-tss" onclick="GunboundHUD.selectShot('ss')" title="SS"><span>SS</span></div>

                    <!-- Satélites -->
                    <div class="satellite-btn sat-1" title="Slot 1"></div>
                    <div class="satellite-btn sat-2" title="Slot 2"></div>
                    <div class="satellite-btn sat-3" title="Slot 3"></div>
                    <div class="satellite-btn sat-options" title="Opções"><span style="font-size:9px;">OPT</span></div>

                    <!-- Círculo Central Escuro (Aumentado) -->
                    <div class="wind-circle" id="wind-circle-zone" title="Arraste para girar a seta">
                        <div class="wind-arrow-container" id="wind-arrow-rotator"><div class="wind-arrow"></div></div>
                        <input type="number" id="wind-input" value="07" min="0" max="26" onchange="GunboundHUD.updateWindForce(this.value)" onblur="GunboundHUD.updateWindForce(this.value)">
                    </div>
                </div>
            </div>

            <div class="hud-section-power">
                <div class="power-bar-container">
                    <div class="power-marks"></div>
                    <div class="power-fill" id="power-bar-fill" style="width: 40%;"></div>
                </div>
                <div class="mobile-selector" title="Escolher Mobile">Armor</div>
            </div>
        </div>
    `,

    // 4. Funções Lógicas
    selectShot: function(shotType) {
        document.getElementById('btn-t1').classList.remove('active');
        document.getElementById('btn-t2').classList.remove('active');
        document.getElementById('btn-tss').classList.remove('active');
        
        this.state.shot = shotType;
        
        if(shotType === 1) document.getElementById('btn-t1').classList.add('active');
        if(shotType === 2) document.getElementById('btn-t2').classList.add('active');
        if(shotType === 'ss') document.getElementById('btn-tss').classList.add('active');
    },

    updateWindForce: function(val) {
        let force = parseInt(val);
        if(isNaN(force)) force = 0;
        if(force < 0) force = 0;
        if(force > 26) force = 26; 
        
        this.state.windForce = force;
        
        let displayVal = force < 10 ? '0' + force : force.toString();
        document.getElementById('wind-input').value = displayVal;
    },

    initWindDrag: function() {
        const circle = document.getElementById('wind-circle-zone');
        const rotator = document.getElementById('wind-arrow-rotator');
        let isDragging = false;

        rotator.style.transform = `rotate(${this.state.windAngle}deg)`;

        const calculateAngle = (e) => {
            const rect = circle.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);

            let MathAng = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
            
            let cssAng = MathAng + 90;
            if (cssAng < 0) cssAng += 360;

            this.state.windAngle = Math.round(cssAng);
            rotator.style.transform = `rotate(${this.state.windAngle}deg)`;
        };

        const onDown = (e) => {
            if (e.target.id === 'wind-input') return; 
            isDragging = true;
            calculateAngle(e);
        };
        const onMove = (e) => {
            if (!isDragging) return;
            calculateAngle(e);
        };
        const onUp = () => { isDragging = false; };

        circle.addEventListener('mousedown', onDown);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);

        circle.addEventListener('touchstart', onDown, {passive: false});
        window.addEventListener('touchmove', (e) => {
            if(isDragging) { e.preventDefault(); onMove(e); }
        }, {passive: false});
        window.addEventListener('touchend', onUp);
    },

    render: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const styleTag = document.createElement('style');
        styleTag.innerHTML = this.styles;
        document.head.appendChild(styleTag);

        container.innerHTML = this.html;
        this.initWindDrag();
    }
};
