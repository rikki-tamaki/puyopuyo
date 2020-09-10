class Stage {
    // static stageElement;
    // static scoreElement;
    // static zenkeshiImage;
    // static board;
    // static puyoCount;
    // static fallingPuyoList = [];
    // static eraseStartFrame;
    // static erasingPuyoInfoList = [];

    static initialize() {
        // HTML からステージの元となる要素を取得し、大きさを設定する
        const stageElement = document.getElementById("stage");
        stageElement.style.width = Config.puyoImgWidth * Config.stageCols + 'px';
        stageElement.style.height = Config.puyoImgHeight * Config.stageRows + 'px';
        stageElement.style.backgroundColor = Config.stageBackgroundColor;
        this.stageElement = stageElement;

        const zenkeshiImage = document.getElementById("zenkeshi");
        zenkeshiImage.width = Config.puyoImgWidth * 6;
        zenkeshiImage.style.position = 'absolute';
        zenkeshiImage.style.display = 'none';
        this.zenkeshiImage = zenkeshiImage;
        stageElement.appendChild(zenkeshiImage);

        const scoreElement = document.getElementById("score");
        scoreElement.style.backgroundColor = Config.scoreBackgroundColor;
        scoreElement.style.top = Config.puyoImgHeight * Config.stageRows + 'px';
        scoreElement.style.width = Config.puyoImgWidth * Config.stageCols + 'px';
        scoreElement.style.height = Config.fontHeight + "px";
        this.scoreElement = scoreElement;

        // メモリを準備する
        this.board = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ];
        let puyoCount = 0;
        for(let y = 0; y < Config.stageRows; y++) {
            const line = this.board[y] || (this.board[y] = []);
            for(let x = 0; x < Config.stageCols; x++) {
                const puyo = line[x];
                if(puyo >= 1 && puyo <= 5) {
                    // line[x] = {puyo: puyo, element: this.setPuyo(x, y, puyo)};
                    this.setPuyo(x, y, puyo);
                    puyoCount++;
                } else {
                    line[x] = null;
                }
            }
        }
        this.puyoCount = puyoCount;
    }

    // 画面とメモリ両方に puyo をセットする
    static setPuyo(x, y, puyo) {
        // 画像を作成し配置する
        const puyoImage = PuyoImage.getPuyo(puyo);
        puyoImage.style.left = x * Config.puyoImgWidth + "px";
        puyoImage.style.top = y * Config.puyoImgHeight + "px";
        this.stageElement.appendChild(puyoImage);
        // メモリにセットする
        this.board[y][x] = {
            puyo: puyo,
            element: puyoImage
        }
    }

    // 自由落下をチェックする
    static checkFall() {
        this.fallingPuyoList.length = 0;
        let isFalling = false;
        // 下の行から上の行を見ていく
        for(let y = Config.stageRows -2; y >= 0; y--) {
            const line = this.board[y];
            for(let x = 0; x < line.length; x++) {
                if(!this.board[y][x]) {
                    // このマスにぷよがなければ次
                    continue;
                }
                if(!this.board[y + 1][x]) {
                    // このぷよは落ちるので、取り除く
                    let cell = this.board[y][x];
                    this.board[y][x] = null;
                    let dst = y;
                    while(dst + 1 < Config.stageRows && this.board[dst + 1][x] == null) {
                        dst++;
                    }
                    // 最終目的地に置く
                    this.board[dxt][x] = cell;
                    // 落ちるリストに入れる
                    this.fallingPuyoList.push({
                        element: cell.element,
                        position: y * Config.puyoImgHeight,
                        destination: dst * Config.puyoImgHeight,
                        falling: true
                    });
                    // 落ちるものがったことを記録しておく
                    isFalling = true;
                }
            }
        }
    }
}