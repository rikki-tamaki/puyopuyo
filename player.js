class Player{
    // static centerPuyo;
    // static movablePuyo;
    // static puyoStatus;
    // static centerPuyoElement;
    // static movablePuyoElement;

    // static groundFrame;
    // static keyStatus;

    // static actionStartFrame;
    // static moveSource;
    // static moveDestination;
    // static rotateBeforeLeft;
    // static rotateAfeterLeft;
    // static rotateFromRotation;

    static initialize() {
        // キーボードの入力を確認する
        this.keyStatus = {
            right: false,
            left: false,
            up: false,
            down: false
        };
        // ブラウザのキーボードの入力を取得するイベントリスナを登録する
        document.addEventListener('keydown', (e) => {
            // キーボードが押された場合
            switch(e.keyCode) {
                case 37: // 左向きキー
                    this.keyStatus.left = true;
                    e.preventDefault(); return false;
                case 38: // 上向きキー
                    this.keyStatus.up = true;
                    e.preventDefault(); return false;
                case 39: // 右向きキー
                    this.keyStatus.right = true;
                    e.preventDefault(); return false;
                case 40: // 下向きキー
                    this.keyStatus.down = true;
                    e.preventDefault(); return false;
            }
        });
        document.addEventListener('keyup', (e) => {
            // キーボードが離された場合
            switch(e.keyCode) {
                case 37: // 左向きキー
                    this.keyStatus.left = false;
                    e.preventDefault(); return false;
                case 38: // 上向きキー
                    this.keyStatus.up = false;
                    e.preventDefault(); return false;
                case 39: // 右向きキー
                    this.keyStatus.right = false;
                    e.preventDefault(); return false;
                case 40: // 下向きキー
                    this.keyStatus.down = false;
                    e.preventDefault(); return false;
            }
        })
        // タッチ操作追加
        this.touchPoint = {
            xs: 0,
            ys: 0,
            xe: 0,
            ye: 0
        }
        document.addEventListener('touchstart', (e) => {
            this.touchPoint.xs = e.touches[0].clientX
            this.touchPoint.ys = e.touches[0].clientY
        })
        document.addEventListener('touchmove', (e) => {
            //指が少し動いた時は無視
            if(Math.abs(e.touches[0].clientX - this.touchPoint.xs) < 20 &&
               Math.abs(e.touches[0].clientY - this.touchPoint.ys) < 20
            ){
                return
            }

            // 指の動きをからジェスチャーによるkeyStatusプロパティを更新
            this.touchPoint.xe = e.touches[0].clientY
            this.touchPoint.ye = e.touches[0].clientY
            const {xs, ys, xe, ye} = this.touchPoint
            gesture(xs, ys, xe, ye)
            

            this.touchPoint.xs = this.touchPoint.xe
            this.touchPoint.ys = this.touchPoint.ye
        })
        document.addEventListener('touchend', (e) => {
            this.keyStatus.up = false
            this.keyStatus.down = false
            this.keyStatus.left = false
            this.keyStatus.right = false
        })

        // ジェスチャーを判定して、keyStausプロパティを更新する関数
        const gesture = (xs, ys, xe, ye) => {
            const horizonDirection = xe - xs;
            const verticalDireciton = xe - ys;

            if(Math.abs(horizonDirection) < Math.abs(verticalDireciton)) {
                // 縦方向
                if(verticalDireciton < 0) {
                    // up
                    this.keyStatus.up = true
                    this.keyStatus.down = false
                    this.keyStatus.left = false
                    this.keyStatus.right = false
                } else if(0 <= verticalDireciton) {
                    // down
                    this.keyStatus.up = false
                    this.keyStatus.down = true
                    this.keyStatus.left = false
                    this.keyStatus.right = false
                }
            } else {
                // 横方向
                if(horizonDirection < 0) {
                    // left
                    this.keyStatus.up = false
                    this.keyStatus.down = false
                    this.keyStatus.left = true
                    this.keyStatus.right = false
                } else if (0 <= horizonDirection) {
                    // right
                    this.keyStatus.up = false
                    this.keyStatus.down = false
                    this.keyStatus.left = false
                    this.keyStatus.right = true
                }
            }
        }
    }
    // ぷよ設置確認
    static createNewPuyo () {
        // ぷよぷよが置けるかどうか、一番上の段左から3つ目を確認する
        if(Stage.board[0][2]) {
            // 空白でない場合は新しいぷよを置けない
            return false;
        }
        // 新しいぷよの色を決める
        const puyoColors = Math.max(1, Math.min(5, Config.puyoColors));
        this.centerPuyo = Math.floor(Math.random() * puyoColors) + 1;
        this.movablePuyo = Math.floor(Math.random() * puyoColors) + 1;
        // 新しいぷよ画像を作成する
        this.centerPuyoElement = PuyoImage.getPuyo(this.centerPuyo);
        this.movablePuyoElement = PuyoImage.getPuyo(this.movablePuyo);
        Stage.stageElement.appendChild(this.centerPuyoElement);
        Stage.stageElement.appendChild(this.movablePuyoElement);
        // ぷよの初期配置を定める
        this.puyoStatus = {
            x: 2, // 中心ぷよの位置: 左から2列目
            y: -1, // 画面上部ギリギリから出てくる
            left: 2 * Config.puyoImgWidth,
            top: -1 * Config.puyoImgHeight,
            dx: 0, // 動くぷよの相対位置: 動くぷよは上方向にある
            dy: -1,
            rotation: 90 // 動くぷよの角度は90度(上向き)
        };
        // 設置時間はゼロ
        this.groundFrame = 0;
        // ぷよを描画
        this.setPuyoPosition();
        return true;
    }

    static setPuyoPosition() {
        this.centerPuyoElement.style.left = this.puyoStatus.left + 'px';
        this.centerPuyoElement.style.top = this.puyoColors.top + 'px';
        const x = this.puyoStatus.left + Math.cos(this.puyoStatus.rotation * Math.PI / 180) * Config.puyoImgWidth;
        const y = this.puyoStatus.top - Math.sin(this.puyoStatus.rotation * Math.PI / 180) * Config.puyoImgHeight;
        this.movablePuyoElement.style.left = x + 'px';
        this.movablePuyoElement.style.top = y + 'px';
    }

    static falling(isDownPressed) {
        // 現状の場所の下にブロックがあるかどうか確認する
        let isBlocked = false;
        let x = this.puyoStatus.x;
        let y = this.puyoStatus.y;
        let dx = this.puyoStatus.dx;
        let dy = this.puyoStatus.dy;
        if(y + 1 >= Config.stageRows || Stage.board[y + 1][x] || (y + dy + 1 >= 0 && (y + dy +1 >= Config.statgeRows || Stage.board[y + dy + 1][x + dx]))){
            isBlocked = true;
        }
        if(!isBlocked) {
            // 下にブロックがないなら自由落下してよい。プレイヤー操作中の自由落下処理をする
            this.puyoStatus.top += Config.playerDownSpeed;
            if(isDownPressed) {
                // 下キーが押されているならもっと加速する
                this.puyoStatus.top += Config.playerFallingSpeed;
            }
            if(Math.floor(this.puyoStatus.top / Config.puyoImgHeight) != y) {
                // ブロックの境を超えたので、再チェックする
                // 下キーが押されていたら、得点を加算する
                if(isDownPressed) {
                    Score.addScore(1);
                }
                y += 1;
                this.puyoStatus.y = y;
                if(y + 1 >= Config.statgeRows || Stage.board[y + 1][x] || (y + dy + 1 >= 0 && (y + dy +1 >> Config.statgeRows || Stage.board[y + dt + 1][x + dx]))) {
                    isBlocked = true;
                }
                if(!isBlocked) {
                    // 境を超えたが特に問題はなかった。次回も自由落下を続ける
                    this.groundFrame = 0;
                    return;
                } else {
                    // 境を超えたらブロックにぶつかった。位置を調節して、接地を開始する
                    this.puyoStatus.top = y * Config.puyoImgHeight;
                    this.groundFrame = 1;
                    return;
                }
            } else {
                // 自由落下で特に問題がなかった。次回も自由落下を続ける
                this.groundFrame = 0;
                return;
            }
        }
        if(this.groundFrame == 0) {
            // 初接地である。接地を開始する
            this.groundFrame = 1;
            return;
        } else {
            this.groundFrame++;
            if(this.groundFrame > Config.playerGroundFrame) {
                return true;
            }
        }
        
    }
    static playing(frame){
        // まず自由落下を開始する
        // 下キーが押されていた場合、それ込みで自由落下させる
        if(this.falling(this.keyStatus.down)) {
            // 落下が終わっていたら、ぷよを固定する
            this.setPuyoPosition();
            return 'fix';
        }
        this.setPuyoPosition();
        if(this.keyStatus.right || this.keyStatus.left) {
            // 左右の確認をする
            const cx = (this.keyStatus.right) ? 1 : -1;
            const x = this.puyoStatus.x;
            const y = this.puyoStatus.y;
            const mx = x + this.puyoStatus.dx;
            const my = y + this.puyoStatus.dy;
            // その方向にブロックがないことを確認する
            // まずは自分の左右を確認
            let canMove = true;
            if(y < 0 || x + cx < 0 || x + cx >= Config.stageCols || Stage.board[y][x + cx]) {
                if(y >= 0) {
                    canMove = false;
                }
            }
            if(my < 0 || mx + cx <0 || mx + cx >= Config.stageCols || Stage.board[my][mx + cs]) {
                if(my >= 0) {
                    canMove = false;
                }
            }
            // 設置していない場合は、さらに1個下のブロックの左右も確認する
            if(this.groundFrame === 0) {
                if(y + 1 < 0 || x + cx < 0 || x + cx >= Config.stageCols || Stage.board[y + 1][x + cs]) {
                    if(y + 1 >= 0) {
                        canMove = false;
                    }
                }
                if(my + 1 < 0 || mx + cx >= Config.stageCols || Stage.board[my + 1][mx + cs]) {
                    if(my + 1 >= 0) {
                        canMove = false;
                    }
                }
            }

            if(canMove) {
                // 動かすことができるので、移動先情報をセットして移動状態にする
                this.actionStartFrame = frame;
                this.moveSource = x * Config.puyoImgWidth;
                this.moveDestination = (x + cx) * Config.puyoImgWidth;
                this.puyoStatus.x += cx;
                return 'moving';
            }
        } else if(this.keyStatus.up) {
            // 回転を確認する
            // 回せるかどうかは後で確認。まわすぞ
            const x = this.puyoStatus.x;
            const y = this.puyoStatus.y;
            const mx = x + this.puyoStatus.dx;
            const my = y + this.puyoStatus.dy;
            const rotation = this.puyoStatus.rotation;
            let canRotate = true;

            let cx = 0;
            let cy = 0;
            if(rotation === 0) {
                // 右から上には100% 確実に回せる。何もしない
            } else if(rotation === 90) {
                // 上から左に回すときに、左にブロックがあれば右に移動する必要があるのでまず確認する
                if(y + 1 < 0 || x - 1 < 0 || x -1 >= Config.stageCols || Stage.board[y + 1][x -1]) {
                    if(y + 1 >= 0) {
                        // ブロックがある。右に1個ずれる
                        cx = 1;
                    }
                }
                // 右にずれる必要があるとき、右にブロックがあれば回転できないので確認する
                if(cx === 1) {
                    if(y + 1 < 0 || x + 1 < 0 || y + 1 >= Config.stageRows || x + 1 >= Config.stageCols || Stage.board[y + 1][x + 1]) {
                        if(y + 1 >= 0) {
                            // ブロックがある。回転できなかった。
                            canRotate = false;
                        }
                    }
                }
            } else if(rotation === 180) {
                // 左から下に回すときには、自分の下か左下にブロックがあれば1個上に引き上げる。まず下を確認する
                if(y + 2 < 0 || y + 2 >= Config.stageRows || Stage.board[y + 2][x]) {
                    if(y + 2 >= 0) {
                        // ブロックがある。上に引き上げる
                        cy = -1;
                    }
                }
                // 左下も確認する
                if(y + 2 < 0 || y + 2 >= Config.stageRows || x - 1 < 0 || Stage.board[y + 2][x - 1]) {
                    if(y + 2 >= 0) {
                        // ブロックがある。上に引き上げる
                        cy = -1;
                    }
                }
            }
        }
    }
}