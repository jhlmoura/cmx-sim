const GunboundHUD = {
    // 1. O Estado do HUD (Variáveis que a Calculadora vai ler no futuro)
    state: {
        shot: 1,           // 1, 2 ou 'ss'
        windForce: 7,      // 0 a 26
        windAngle: 45      // Graus (0 é pra cima, 90 é direita, etc)
    },

    // 2. O CSS exclusivo do HUD - Totalmente Refinado
    styles: `
        #hud-wrapper {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            height: 90px;
            background: #232d3b; /* Tom azul-escuro mais fiel ao fundo da imagem */
            border-top: 2px solid #141a24;
            display: flex; align-items: center; justify-content: flex-start;
            padding: 0 10px; z-index: 200;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            user-select: none;
        }

        /* Controles de Mapa (Minimapa) */
        .hud-section-left { display: flex; align-items: center; width: 220px; }
        #map-controls { background: #0d1117; padding: 8px; border-radius: 6px; border: 1px solid #06080b; box-shadow: 0 2px 4px rgba(0,0,0,0.8); position: relative; }
        #minimap-container { position: relative; background-color: #000; border: 2px solid #3a4354; border-radius: 4px; background-size: 100% 100%; background-repeat: no-repeat; min-width: 180px; min-height: 42px; display: flex; overflow: hidden; }
        .click-zone-side { width: 25px; height: 100%; cursor: pointer; z-index: 10; }
        .click-zone-center { flex-grow: 1; height: 100%; cursor: pointer; z-index: 10; }
        #arrow-indicator { position: absolute; top: 50%; transform: translateY(-50%); width: 0; height: 0; border-style: solid; pointer-events: none; filter: drop-shadow(0px 0px 2px rgba(0,0,0,0.8)); z-index: 5; }
        .arrow-right { right: 4px; border-width: 5px 0 5px 7px; border-color: transparent transparent transparent #f2a900; }
        .arrow-left { left: 4px; border-width: 5px 7px 5px 0; border-color: transparent #f2a900 transparent transparent; }

        /* Lista de Mapas Suspensa */
        #visual-map-list { position: absolute; bottom: 100%; left: 0; margin-bottom: 5px; background: rgba(17, 21, 30, 0.95); border: 1px solid #3a4354; border-radius: 8px; padding: 10px; box-shadow: 0 -4px 15px rgba(0,0,0,0.8); display: none; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; width: max-content; max-width: 70vw; max-height: 50vh; overflow-y: auto; z-index: 300; }
        #visual-map-list::-webkit-scrollbar { width: 6px; }
        #visual-map-list::-webkit-scrollbar-thumb { background: #3a4354; border-radius: 4px; }
        .map-item-card { background: #000; border: 2px solid #2b3240; border-radius: 4px; cursor: pointer; text-align: center; color: #fff; }
        .map-item-card:hover { border-color: #f2a900; transform: translateY(-2px); }
        .map-item-preview { width: 100%; height: 35px; background-size: 100% 100%; border-bottom: 1px solid #2b3240; }
        .map-item-name { padding: 4px; font-size: 11px; color: #ccc; font-weight: bold; }

        /* ================================================= */
        /* Roleta Central (Vento, Tiros, Satélites) - REFINADA */
        /* ================================================= */
        .hud-section-center { position: relative; width: 160px; height: 120px; margin-top: -30px; margin-left: 20px; display: flex; justify-content: center; align-items: center; z-index: 250; }
        
        /* O Disco Bege Externo */
        .main-dial { 
            position: relative; 
            width: 140px; 
            height: 140px; 
            background: #d1cfc0; /* Cor bege exata da imagem */
            border-radius: 50%; 
            border: 1px solid #111; 
            box-shadow: 0 4px 8px rgba(0,0,0,0.5), inset 0 0 15px rgba(255,255,255,0.2); 
            display: flex; 
            justify-content: center; 
            align-items: center; 
        }
        
        /* Pedaço escuro da esquerda (Background dos Tiros) */
        .dial-dark-bg {
            position: absolute;
            left: 0;
            top: 50%;
            width: 50%;
            height: 50%;
            background: #475a6e;
            border-bottom-left-radius: 140px;
            z-index: 1;
        }

        /* Botões de Tiro (Fatias Arredondadas Harmoniosas) */
        .dial-button { 
            position: absolute; 
            /* Botões em formato de "pétala" gordinha para casar com o design */
            width: 55px; 
            height: 55px; 
            background: #e1decb; /* Bege claro dos botões inativos */
            border: 1px solid #222; 
            border-radius: 50% 50% 10% 10%; 
            display: flex; 
            justify-content: center; 
            align-items: flex-start; 
            padding-top: 5px; 
            font-size: 16px; 
            font-weight: 800; 
            color: #1a2a3a; 
            cursor: pointer; 
            transform-origin: center 70px; /* Eixo de rotação no centro do disco principal */
            box-shadow: inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(0,0,0,0.2); 
            z-index: 10; 
            transition: background 0.1s; 
        }
        
        .dial-button:hover { filter: brightness(1.05); }
        .dial-button.active { 
            background: #f8b800; /* Amarelo ouro exato da imagem */
            color: #111;
            z-index: 20; 
            box-shadow: inset 2px 2px 4px rgba(255,255,255,0.5), inset -2px -2px 6px rgba(0,0,0,0.3), 0 0 5px rgba(0,0,0,0.5);
            /* O botão ativo fica um pouquinho maior */
            transform-origin: center 72px; 
        } 
        
        /* Rotações precisas para encaixar igual à imagem */
        .btn-t1 { transform: rotate(-75deg); top: -15px; left: 42px; } .btn-t1 span { transform: rotate(75deg); }
        .btn-t2 { transform: rotate(-45deg); top: -15px; left: 42px; } .btn-t2 span { transform: rotate(45deg); }
        .btn-ss { transform: rotate(-10deg); top: -15px; left: 42px; } .btn-ss span { transform: rotate(10deg); font-size: 14px; }

        /* Botões de Satélites e Itens (Bolinhas Amarelas/Brancas) */
        .satellite-btn { 
            position: absolute; 
            width: 24px; 
            height: 24px; 
            background: #f8cc00; /* Amarelo dos satélites */
            border-radius: 50%; 
            border: 1px solid #111; 
            cursor: pointer; 
            box-shadow: inset 2px 2px 3px rgba(255,255,255,0.7), inset -2px -2px 4px rgba(0,0,0,0.4), 2px 2px 3px rgba(0,0,0,0.4); 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            color: #000; 
            z-index: 15;
            transition: transform 0.1s;
        }
        .satellite-btn:active { transform: scale(0.95); }
        
        /* Posições seguindo o arco direito */
        .sat-1 { top: 18px; right: 8px; }
        .sat-2 { top: 58px; right: -8px; background: #fff; width: 28px; height: 28px; } /* Satélite branco um pouco maior */
        .sat-3 { top: 100px; right: 5px; }
        
        /* Botão OPT menorzinho na base */
        .sat-options { 
            bottom: -5px; 
            right: 35px; 
            width: 32px; 
            height: 32px; 
            background: #b5bcc6; /* Cinza claro do botão OPT */
            font-weight: bold;
            color: #3e4a59;
            box-shadow: inset 2px 2px 3px rgba(255,255,255,0.9), inset -2px -2px 4px rgba(0,0,0,0.3), 1px 1px 3px rgba(0,0,0,0.5); 
        }

        /* Vento - Círculo Central Escuro */
        .wind-circle { 
            position: relative; 
            width: 95px; /* Tamanho maior, ocupando mais espaço do bege */
            height: 95px; 
            background: radial-gradient(circle at 30% 30%, #445163, #1e2733 80%); /* Gradiente esférico suave */
            border-radius: 50%; 
            border: 1px solid #000; 
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
            z-index: 30; 
            box-shadow: inset -5px -5px 15px rgba(0,0,0,0.8), inset 2px 2px 5px rgba(255,255,255,0.1), 0 0 8px rgba(0,0,0,0.6); 
            cursor: pointer; 
        }
        
        .wind-arrow-container { position: absolute; width: 100%; height: 100%; border-radius: 50%; transform: rotate(45deg); z-index: 15; pointer-events: none; }
        
        /* Setinha Laranja Estilo Imagem */
        .wind-arrow { 
            position: absolute; 
            top: 10px; 
            left: 50%; 
            transform: translateX(-50%); 
            width: 0; 
            height: 0; 
            border-left: 6px solid transparent; 
            border-right: 6px solid transparent; 
            border-bottom: 10px solid #f88c00; /* Laranja puxado pro vermelho */
            filter: drop-shadow(0px 0px 2px rgba(255, 150, 0, 0.8)); /* Brilho em volta da seta */
        }

        /* Input Numérico Brilhante Centralizado */
        #wind-input {
            width: 60px;
            background: transparent;
            border: none;
            color: #fff;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            font-size: 32px; /* Número bem grande e visível */
            font-weight: 900;
            text-align: center;
            text-shadow: 0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.5); /* Brilho forte da imagem */
            outline: none;
            z-index: 20;
            cursor: text;
        }
        #wind-input::-webkit-outer-spin-button, #wind-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        #wind-input[type=number] { -moz-appearance: textfield; }

        /* Barra de Força - Fixa, Proporcional e Menor */
        .hud-section-power { width: 350px; display: flex; align-items: center; margin-left: 20px; background: #2f3a47; padding: 6px 10px; border-radius: 2px; border: 1px solid #111; height: 35px; border-top: 1px solid #4a5a6a; }
        .power-bar-container { flex-grow: 1; height: 18px; background: #2a221b; border: 1px solid #fff; position: relative; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.8); }
        .power-marks { position: absolute; width: 100%; height: 100%; background: repeating-linear-gradient(to right, transparent, transparent 25%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.3) 25.5%); pointer-events: none; z-index: 10;}
        .power-fill { width: 0%; height: 100%; background: linear-gradient(to right, #f8cc00, #d82b00); }
        .mobile-selector { width: 45px; height: 45px; margin-left: 15px; background: #fff; border: 2px solid #000; border-radius: 4px; display: flex; justify-content: center; align-items: center; font-size: 10px; font-weight: bold; color: #000; cursor: pointer; }
    `,

    // 3. O HTML exclusivo do HUD
    html: `
        <div id="hud-wrapper">
            
            <!-- Esquerda: Minimapa -->
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

            <!-- Centro: Roleta e Vento Refinados -->
            <div class="hud-section-center">
                <div class="main-dial">
                    <!-- Fundo escuro atrás dos botões esquerdos -->
                    <div class="dial-dark-bg"></div>
                    
                    <!-- Botões de Tiro -->
                    <div class="dial-button btn-t1 active" id="btn-t1" onclick="GunboundHUD.selectShot(1)" title="Tiro 1"><span>1</span></div>
                    <div class="dial-button btn-t2" id="btn-t2" onclick="GunboundHUD.selectShot(2)" title="Tiro 2"><span>2</span></div>
                    <div class="dial-button btn-ss" id="btn-tss" onclick="GunboundHUD.selectShot('ss')" title="SS"><span>SS</span></div>

                    <!-- Botões de Satélites e Itens -->
                    <div class="satellite-btn sat-1" title="Slot 1"></div>
                    <div class="satellite-btn sat-2" title="Slot 2"></div>
                    <div class="satellite-btn sat-3" title="Slot 3"></div>
                    
                    <!-- Botão OPT (Opções) -->
                    <div class="satellite-btn sat-options" title="Opções"><span style="font-size:9px;">OPT</span></div>

                    <!-- Controle de Vento (Círculo Central) -->
                    <div class="wind-circle" id="wind-circle-zone" title="Arraste para girar a seta">
                        <div class="wind-arrow-container" id="wind-arrow-rotator"><div class="wind-arrow"></div></div>
                        <!-- Input editável do vento com brilho -->
                        <input type="number" id="wind-input" value="07" min="0" max="26" onchange="GunboundHUD.updateWindForce(this.value)" onblur="GunboundHUD.updateWindForce(this.value)">
                    </div>
                </div>
            </div>

            <!-- Direita: Força e Mobile (Tamanho reduzido e proporcional) -->
            <div class="hud-section-power">
                <div class="power-bar-container">
                    <div class="power-marks"></div>
                    <!-- Exemplo de barra preenchida para teste (mude o width depois) -->
                    <div class="power-fill" id="power-bar-fill" style="width: 40%;"></div>
                </div>
                <div class="mobile-selector" title="Escolher Mobile">Armor</div>
            </div>
        </div>
    `,

    // 4. Funções Lógicas do HUD
    
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

        // Inicia apontando para o ângulo salvo (No CSS, 0 graus = ponteiro para CIMA. Na matemática: 0 = DIREITA. Vamos ajustar para o visual do jogo onde 0 = direita)
        rotator.style.transform = `rotate(${this.state.windAngle}deg)`;

        const calculateAngle = (e) => {
            const rect = circle.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);

            // atan2 retorna de -PI a PI
            let MathAng = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
            
            // Corrige para o CSS onde Topo é 0deg e Direita é 90deg
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
