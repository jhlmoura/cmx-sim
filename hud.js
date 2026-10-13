const GunboundHUD = {
    // 1. O Estado do HUD (Variáveis que a Calculadora vai ler no futuro)
    state: {
        shot: 1,           // 1, 2 ou 'ss'
        windForce: 7,      // 0 a 26
        windAngle: 45      // Graus (0 é pra cima, 90 é direita, etc)
    },

    // 2. O CSS exclusivo do HUD
    styles: `
        #hud-wrapper {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            height: 90px;
            background: #2b394a;
            border-top: 2px solid #1a222c;
            display: flex; align-items: center; justify-content: flex-start;
            padding: 0 10px; z-index: 200;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            user-select: none;
        }

        /* Controles de Mapa */
        .hud-section-left { display: flex; align-items: center; width: 220px; }
        #map-controls { background: #0d1117; padding: 8px; border-radius: 6px; border: 1px solid #06080b; box-shadow: 0 2px 4px rgba(0,0,0,0.8); position: relative; }
        #minimap-container { position: relative; background-color: #000; border: 2px solid #3a4354; border-radius: 4px; background-size: 100% 100%; background-repeat: no-repeat; min-width: 180px; min-height: 42px; display: flex; overflow: hidden; }
        .click-zone-side { width: 25px; height: 100%; cursor: pointer; z-index: 10; }
        .click-zone-center { flex-grow: 1; height: 100%; cursor: pointer; z-index: 10; }
        #arrow-indicator { position: absolute; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-style: solid; pointer-events: none; filter: drop-shadow(0px 0px 2px rgba(0,0,0,0.8)); z-index: 5; }
        .arrow-right { right: 4px; border-width: 5px 0 5px 7px; border-color: transparent transparent transparent #ffaa00; }
        .arrow-left { left: 4px; border-width: 5px 7px 5px 0; border-color: transparent #ffaa00 transparent transparent; }

        /* Lista de Mapas Suspensa */
        #visual-map-list { position: absolute; bottom: 100%; left: 0; margin-bottom: 5px; background: rgba(17, 21, 30, 0.95); border: 1px solid #3a4354; border-radius: 8px; padding: 10px; box-shadow: 0 -4px 15px rgba(0,0,0,0.8); display: none; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; width: max-content; max-width: 70vw; max-height: 50vh; overflow-y: auto; z-index: 300; }
        #visual-map-list::-webkit-scrollbar { width: 6px; }
        #visual-map-list::-webkit-scrollbar-thumb { background: #3a4354; border-radius: 4px; }
        .map-item-card { background: #000; border: 2px solid #2b3240; border-radius: 4px; cursor: pointer; text-align: center; color: #fff; }
        .map-item-card:hover { border-color: #ffaa00; transform: translateY(-2px); }
        .map-item-preview { width: 100%; height: 35px; background-size: 100% 100%; border-bottom: 1px solid #2b3240; }
        .map-item-name { padding: 4px; font-size: 11px; color: #ccc; font-weight: bold; }

        /* Roleta Central */
        .hud-section-center { position: relative; width: 200px; height: 120px; margin-top: -30px; margin-left: 20px; display: flex; justify-content: center; align-items: center; z-index: 250; }
        .main-dial { position: relative; width: 130px; height: 130px; background: #cfcdbe; border-radius: 50%; border: 2px solid #111; box-shadow: inset 0 0 10px rgba(0,0,0,0.5), 0 4px 6px rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; }
        .angle-protractor { position: absolute; width: 100%; height: 100%; border-radius: 50%; background: conic-gradient(from 270deg, #44596b 0deg, #44596b 40deg, transparent 40deg); }
        
        /* Botões de Tiro - Ajuste de Camadas (z-index) para o botão ativo sobrepor os outros */
        .dial-button { position: absolute; width: 40px; height: 40px; background: #d4cfae; border: 1px solid #333; border-radius: 50% 50% 0 0; display: flex; justify-content: center; align-items: flex-start; padding-top: 5px; font-size: 14px; font-weight: bold; color: #333; cursor: pointer; transform-origin: center 65px; box-shadow: inset 1px 1px 2px rgba(255,255,255,0.6), inset -1px -1px 2px rgba(0,0,0,0.4); z-index: 10; transition: background 0.2s, z-index 0s; }
        .dial-button:hover { filter: brightness(1.1); }
        .dial-button.active { background: #ffcc00; z-index: 20; } /* Cor amarela do tiro selecionado */
        
        .btn-t1 { transform: rotate(-75deg); top: -20px; left: 45px; } .btn-t1 span { transform: rotate(75deg); }
        .btn-t2 { transform: rotate(-40deg); top: -20px; left: 45px; background: #e0dbba; } .btn-t2 span { transform: rotate(40deg); }
        .btn-ss { transform: rotate(-5deg); top: -20px; left: 45px; } .btn-ss span { transform: rotate(5deg); font-size: 12px; }

        .satellite-btn { position: absolute; width: 25px; height: 25px; background: #ffd700; border-radius: 50%; border: 1px solid #333; cursor: pointer; box-shadow: inset 1px 1px 2px rgba(255,255,255,0.8), inset -1px -1px 2px rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; color: #000; z-index: 15;}
        .sat-moon { top: 10px; right: 10px; }
        .sat-tornado { top: 40px; right: -10px; background: #fff; }
        .sat-force { top: 75px; right: -15px; }
        .sat-options { bottom: 0px; right: 5px; width: 30px; height: 30px; background: #aeb5be; }

        /* Vento - Input Transparente e Seta Giratória */
        .wind-circle { position: relative; width: 80px; height: 80px; background: radial-gradient(circle, #4a545e, #1a222c); border-radius: 50%; border: 3px solid #111; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 30; box-shadow: inset 0 0 10px rgba(0,0,0,0.8); cursor: pointer; }
        
        .wind-arrow-container { position: absolute; width: 100%; height: 100%; border-radius: 50%; transform: rotate(45deg); z-index: 15; pointer-events: none; }
        .wind-arrow { position: absolute; top: 6px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 9px solid #ffaa00; }

        /* Estilizando o Input Numérico para parecer texto normal brilhante */
        #wind-input {
            width: 45px;
            background: transparent;
            border: none;
            color: #fff;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            text-shadow: 0 0 6px rgba(255,255,255,0.8), 0 0 2px #fff;
            outline: none;
            z-index: 20;
            cursor: text;
        }
        /* Ocultando as setinhas do input type number */
        #wind-input::-webkit-outer-spin-button, #wind-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        #wind-input[type=number] { -moz-appearance: textfield; }

        /* Barra de Força - Agora com tamanho FIXO e MENOR */
        .hud-section-power { width: 300px; display: flex; align-items: center; margin-left: 30px; background: #394757; padding: 10px; border-radius: 4px; border: 1px solid #111; height: 45px; }
        .power-bar-container { flex-grow: 1; height: 20px; background: #2a221b; border: 2px solid #fff; position: relative; overflow: hidden; }
        .power-marks { position: absolute; width: 100%; height: 100%; background: repeating-linear-gradient(to right, transparent, transparent 25%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.2) 25.5%); pointer-events: none; }
        .power-fill { width: 0%; height: 100%; background: linear-gradient(to right, #ffcc00, #ff0000); }
        .mobile-selector { width: 50px; height: 50px; margin-left: 15px; background: #fff; border: 2px solid #000; border-radius: 4px; display: flex; justify-content: center; align-items: center; font-size: 10px; font-weight: bold; color: #000; cursor: pointer; }
    `,

    // 3. O HTML exclusivo do HUD
    html: `
        <div id="hud-wrapper">
            
            <!-- Esquerda -->
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

            <!-- Centro: Roleta e Vento -->
            <div class="hud-section-center">
                <div class="main-dial">
                    <div class="angle-protractor"></div>
                    
                    <!-- Botões de Tiro (Eventos de clique chamam a função selectShot) -->
                    <div class="dial-button btn-t1 active" id="btn-t1" onclick="GunboundHUD.selectShot(1)" title="Tiro 1"><span>1</span></div>
                    <div class="dial-button btn-t2" id="btn-t2" onclick="GunboundHUD.selectShot(2)" title="Tiro 2"><span>2</span></div>
                    <div class="dial-button btn-ss" id="btn-tss" onclick="GunboundHUD.selectShot('ss')" title="SS"><span>SS</span></div>

                    <div class="satellite-btn sat-moon" title="Força Moon/Lua"></div>
                    <div class="satellite-btn sat-tornado" title="Tornado"></div>
                    <div class="satellite-btn sat-force" title="Pilar de Força"></div>
                    <div class="satellite-btn sat-options" title="Opções"><span style="font-size:8px;">OPT</span></div>

                    <!-- Controle de Vento -->
                    <div class="wind-circle" id="wind-circle-zone" title="Arraste para girar a seta">
                        <div class="wind-arrow-container" id="wind-arrow-rotator"><div class="wind-arrow"></div></div>
                        <!-- Input editável do vento -->
                        <input type="number" id="wind-input" value="07" min="0" max="26" onchange="GunboundHUD.updateWindForce(this.value)" onblur="GunboundHUD.updateWindForce(this.value)">
                    </div>
                </div>
            </div>

            <!-- Direita: Força e Mobile -->
            <div class="hud-section-power">
                <div class="power-bar-container">
                    <div class="power-marks"></div>
                    <div class="power-fill" id="power-bar-fill"></div>
                </div>
                <div class="mobile-selector" title="Escolher Mobile">Armor</div>
            </div>
        </div>
    `,

    // 4. Funções Lógicas do HUD
    
    // Troca a classe visual e o estado do Tiro
    selectShot: function(shotType) {
        document.getElementById('btn-t1').classList.remove('active');
        document.getElementById('btn-t2').classList.remove('active');
        document.getElementById('btn-tss').classList.remove('active');
        
        this.state.shot = shotType;
        
        if(shotType === 1) document.getElementById('btn-t1').classList.add('active');
        if(shotType === 2) document.getElementById('btn-t2').classList.add('active');
        if(shotType === 'ss') document.getElementById('btn-tss').classList.add('active');
    },

    // Valida o input do vento (limita a 26 e formata com dois dígitos "0X")
    updateWindForce: function(val) {
        let force = parseInt(val);
        if(isNaN(force)) force = 0;
        if(force < 0) force = 0;
        if(force > 26) force = 26; // Limite padrão do Gunbound
        
        this.state.windForce = force;
        
        // Formata visualmente para ter sempre 2 dígitos
        let displayVal = force < 10 ? '0' + force : force.toString();
        document.getElementById('wind-input').value = displayVal;
    },

    // Cria a mecânica de arrastar para girar a setinha do vento
    initWindDrag: function() {
        const circle = document.getElementById('wind-circle-zone');
        const rotator = document.getElementById('wind-arrow-rotator');
        let isDragging = false;

        // Atualiza a posição inicial da seta baseada no State
        rotator.style.transform = `rotate(${this.state.windAngle}deg)`;

        const calculateAngle = (e) => {
            const rect = circle.getBoundingClientRect();
            // Ponto central exato do disco de vento
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);

            // Calcula o ângulo em radianos usando arco-tangente e converte pra graus
            let rad = Math.atan2(clientY - centerY, clientX - centerX);
            let deg = rad * (180 / Math.PI);
            
            // Ajusta o eixo (No CSS o 0 graus aponta para cima)
            deg = deg + 90;
            if (deg < 0) deg += 360;

            this.state.windAngle = Math.round(deg);
            rotator.style.transform = `rotate(${this.state.windAngle}deg)`;
        };

        const onDown = (e) => {
            // Se clicou no input de texto, não inicia o arraste para não bugar a digitação
            if (e.target.id === 'wind-input') return; 
            isDragging = true;
            calculateAngle(e);
        };
        const onMove = (e) => {
            if (!isDragging) return;
            calculateAngle(e);
        };
        const onUp = () => { isDragging = false; };

        // Mouse (PC)
        circle.addEventListener('mousedown', onDown);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);

        // Touch (Mobile)
        circle.addEventListener('touchstart', onDown, {passive: false});
        window.addEventListener('touchmove', (e) => {
            if(isDragging) { e.preventDefault(); onMove(e); }
        }, {passive: false});
        window.addEventListener('touchend', onUp);
    },

    // 5. Método principal que monta tudo na tela
    render: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Injeta o CSS dinamicamente
        const styleTag = document.createElement('style');
        styleTag.innerHTML = this.styles;
        document.head.appendChild(styleTag);

        // Injeta o HTML
        container.innerHTML = this.html;

        // Ativa a mecânica do Vento assim que o HTML for criado
        this.initWindDrag();
    }
};
