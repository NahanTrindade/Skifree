(function () {

    const FPS = 50;
    const TAMX = 300;
    const TAMY = 400;
    const PROB_ARVORE = 5;

    let montanha;
    let skier;
    let painel;
    let gameLoop;
    let contMetros;
    let velocidade = 2;

    const arvores = [];

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

        contato(a) {
            let dir = parseInt(a.element.style.left) + parseInt(getComputedStyle(a.element).getPropertyValue('width'));
            if (parseInt(a.element.style.left) > this.right) {
                return false;
            } else if (dir < this.left) {
                return false;
            } else {
                return true;
            }
        }

        bateu(painel) {
            --this.vidas;

            if (this.vidas < 0) {
                this.element.className = 'morto' ;
                end();
            } else {
                this.element.className = 'caido';
                this.direcao = 1;
                setTimeout(()=> {this.element.className = this.direcoes[this.direcao]},300);
                painel.atualizaVida();
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

        atualizaVida() {
            --this.vida;
            this.marcador_vidas.innerHTML = `Vidas: ${this.vida}`
        }

        atualizaMetros(velocidade) {
            this.pontuacao += velocidade * 10;
            this.marcador_pontuacao.innerHTML = `Pontuação: ${this.pontuacao}`
        }
    }

    class Arvore {
        constructor() {
            this.element = document.createElement('div');
            montanha.element.appendChild(this.element);
            this.element.className = 'arvore_N';
            this.element.style.top = `${TAMY}px`;
            this.element.style.left = `${Math.floor(Math.random() * TAMX)}px`;
        }

        derrubaArvore(arvores) {
            if (parseInt(this.element.style.top) < -50) {
                this.element.remove();
                arvores = arvores.splice(arvores.indexOf(this), arvores.indexOf(this));
            }
        }
    }


    function run() {

        const random = Math.random() * 100;
        if (random <= PROB_ARVORE) {
            const arvore = new Arvore();
            arvores.push(arvore);
        }
        arvores.forEach((a) => {
            a.element.style.top = `${parseInt(a.element.style.top) - velocidade}px`;
        })
        skier.controleLaterais();
        skier.andar();

        arvores.forEach((a) => a.derrubaArvore(arvores));
        arvores.forEach((a) => {
            if (parseInt(a.element.style.top) === skier.bot && skier.contato(a)) {
                skier.bateu(painel);
            }
        })
    }


    init();
})();