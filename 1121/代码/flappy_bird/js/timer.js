(function( w ) {

    /*
     * constrctor { Timer } 游戏计时器
     * param { options } 参数配置
     * patam { options.ctx: Context } 绘图环境
     * patam { options.color: Color } 文字绘制的颜色
     * */
    function Timer( options ) {

        this.ctx = options.ctx;
        this.color = options.color || 'deeppink';

        // 默认文字绘制到画布的右上角
        this.x = this.ctx.canvas.width;
        this.y = 0;

        // 记录游戏的运行总时长
        this.gameRunTime = 0;
        this.text = '';
    }

    // 置换原型
    Timer.prototype = {
        constructor: Timer,

        // 把运行时长以可读性更强的文本展示到画布中
        draw: function() {
            this.ctx.save();

            this.ctx.font = '900 20px 微软雅黑';
            this.ctx.textAlign = 'right';
            this.ctx.textBaseline = 'top';
            this.ctx.fillStyle = this.color;
            this.ctx.fillText( this.text, this.x , this.y );

            this.ctx.restore();
        },

        // 更新下一次绘制的文字内容
        update: function( delaySecond ) {

            // 更新游戏总时长
            this.gameRunTime += delaySecond;

            // 把总时长转换为可读性更强的时间描述
            //gameRuntime = 3800 ==> 1小时，3分钟，20秒
            // 小时：3800 / (60 * 60) = Math.floor(1.xx) = 1
            // 分钟：3800 % (60 * 60) / 60 = Math.floor(3.xx) = 3
            // 秒：3800 % 60 = 20
            var hours = Math.floor( this.gameRunTime / (60 * 60) );
            var minutes = Math.floor( this.gameRunTime % (60 * 60) / 60 );
            var seconds = Math.floor( this.gameRunTime % 60 );
            this.text = '游戏运行了' + hours + '小时' + minutes + '分钟' + seconds + '秒!!!';
        }
    };

    w.Timer = Timer;
}( window ));