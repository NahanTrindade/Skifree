(function () {

    const FPS = 50;
    const TAMX = 300;
    const TAMY = 400;
    const PROB_OBS = 5;

    let montanha;
    let skier;
    let painel;
    let gameLoop;
    let contMetros;
    let velocidade = 2;

    const obstaculos = [];

    function init() {
        montanha = new Montanha();
        skier = new Skier();
        painel = new Painel();

        gameLoop = setInterval(run, 1000 / FPS);
        contMetros = setInterval(() => {
            painel.atualizaMetros(velocidade)
        }, 1000);
    }

    function end() {
        clearInterval(gameLoop);
        clearInterval(contMetros);
        window.removeEventListener('keydown', controle);
    }

    window.addEventListener('keydown', controle = (e) => {
        if (e.key === 'ArrowLeft') {
            skier.mudarDirecao(-1);

        } else if (e.key === 'ArrowRight') {
            skier.mudarDirecao(+1);
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'f' && velocidade === 2) {
            ++velocidade;
        } else if (e.key === 'f' && velocidade === 3) {
            --velocidade;
        }
    });

    class Montanha {
        constructor() {
            this.element = document.getElementById('montanha');
            this.element.style.width = `${TAMX}px`
            this.element.style.height = `${TAMY}px`;
        }
    }

    class Skier {
        constructor() {
            this.element = document.getElementById('skier');
            this.direcoes = ['para-esquerda', 'para-frente', 'para-direita'];
            this.direcao = 1;
            this.element.className = this.direcoes[this.direcao];
            this.element.style.top = '20px';
            this.element.style.left = `${parseInt(TAMX / 2) - 8}px`;
            this.vidas = 3;

            this.top;
            this.left;
            this.right;
            this.bot;
        }

        mudarDirecao(giro) {
            if (this.direcao + giro >= 0 && this.direcao + giro <= 2) {
                this.direcao += giro;
                this.element.className = this.direcoes[this.direcao];
            }
        }

        andar() {
            if (this.direcao === 0) {
                this.element.style.left = `${parseInt(this.element.style.left) - velocidade}px`;
            }
            if (this.direcao === 2) {
                this.element.style.left = `${parseInt(this.element.style.left) + velocidade}px`;
            }
            this.top = parseInt(this.element.style.top);
            this.left = parseInt(this.element.style.left);
            this.right = parseInt(this.left) + parseInt(getComputedStyle(this.element).getPropertyValue('width'));
            this.bot = parseInt(this.top) + parseInt(getComputedStyle(this.element).getPropertyValue('height'));
        }

        controleLaterais() {
            if (parseInt(skier.element.style.left) <= 0 && this.direcao == 0) {
                this.direcao = 1;
                this.element.className = this.direcoes[this.direcao];
            }
            if (parseInt(skier.element.style.left) >= 285 && this.direcao == 2) {
                this.direcao = 1;
                this.element.className = this.direcoes[this.direcao];
            }
        }

        contato(a, painel) {
            let dir = parseInt(a.element.style.left) + parseInt(getComputedStyle(a.element).getPropertyValue('width'));
            if (parseInt(a.element.style.left) > this.right) {
                return false;
            } else if (dir < this.left) {
                return false;
            } else {
                if(a.element.className == 'cogumelo'){
                    a.element.className = '';
                    ++this.vidas;
                    painel.atualizaVida(this);
                    return false
                }
                return true;
            }
        }

        bateu(painel) {
            --this.vidas;

            if (this.vidas < 0) {
                this.element.className = 'morto';
                end();
            } else {
                this.element.className = 'caido';
                this.direcao = 1;
                setTimeout(() => { this.element.className = this.direcoes[this.direcao] }, 300);
                painel.atualizaVida(this);
            }
        }
    }

    class Painel {
        constructor() {
            this.element = document.getElementById('painel');
            this.marcador_vidas = document.getElementById('vidas');
            this.marcador_pontuacao = document.getElementById('pontuacao');
            this.vida = 3;
            this.pontuacao = 0;

            this.marcador_vidas.innerHTML = `Vidas: ${this.vida}`
            this.marcador_pontuacao.innerHTML = `Pontuação: ${this.pontuacao}`


        }

        atualizaVida(skier) {
            this.vida = skier.vidas;
            this.marcador_vidas.innerHTML = `Vidas: ${this.vida}`
        }

        atualizaMetros(velocidade) {
            this.pontuacao += velocidade * 10;
            this.marcador_pontuacao.innerHTML = `Pontuação: ${this.pontuacao}`
        }
    }

    class Obstaculo {
        constructor() {
            this.element = document.createElement('div');
            montanha.element.appendChild(this.element);
            this.randomObs = Math.floor( Math.random() * (7));
            this.tipos = ['arvore_N', 'arvore_G', 'arvore_chamas', 'rocha', 'toco', 'cogumelo', 'doguinho'];
            this.element.className = this.tipos[this.randomObs];
            this.element.style.top = `${TAMY}px`;
            this.element.style.left = `${Math.floor(Math.random() * TAMX)}px`;
        }

        derrubaObstaculo(obstaculos) {
            if (parseInt(this.element.style.top) < -50) {
                this.element.remove();
                obstaculos = obstaculos.splice(obstaculos.indexOf(this), obstaculos.indexOf(this));
            }
        }
    }


    function run() {

        const random = Math.random() * 100;
        if (random <= PROB_OBS) {
            const obstaculo = new Obstaculo();
            obstaculos.push(obstaculo);
        }
        obstaculos.forEach((a) => {
            a.element.style.top = `${parseInt(a.element.style.top) - velocidade}px`;
        })
        skier.controleLaterais();
        skier.andar();

        obstaculos.forEach((a) => a.derrubaObstaculo(obstaculos));
        obstaculos.forEach((a) => {
            if (parseInt(a.element.style.top) === skier.bot && skier.contato(a, painel)) {
                skier.bateu(painel);
            }
        })
    }


    init();
})();