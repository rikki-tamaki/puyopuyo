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
    }
}