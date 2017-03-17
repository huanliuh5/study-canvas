/*
* 实现思路：
* 1、要绘制一个填出遮盖层( 一个半透膜的矩形 )
* 2、再在画布的中间绘制提示文字：GAMEOVER！！！
* */
( function( w ) {

    function OverScene() {

    }

    util.extend( OverScene.prototype, {

        // 绘制游戏结束场景
        run: function() {

        }

    } );

    w.OverScene = OverScene;

}( window ));
