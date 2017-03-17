(function( w ) {

    /*
     * constrctor { Bird } 鸟
     * param { options } 参数配置
     * patam { options.ctx: Context } 绘图环境
     * patam { options.img: Image } 鸟图片
     * patam { options.widthFrame: nunber } 一排有多少帧
     * patam { options.heightFrame: nunber } 一排有多少帧
     * */
    function Bird( options ) {

        this.ctx = options.ctx;
        this.img = options.img;

        // 小鸟的宽和高
        this.width = this.img.width / options.widthFrame;
        this.height = this.img.height / options.heightFrame;

        // 小鸟的坐标
        this.x = this.width;
        this.y = this.height;

        // 小鸟每秒运行的初始速度
        this.speedSecond = 100;
        this.a = 300;

        // 当前小鸟飞翔的第几个动作
        this.index = 0;

        this.bind();
    }

    // 置换原型
    Bird.prototype = {
        constructor: Bird,

        // 绘制鸟
        draw: function() {
            this.ctx.drawImage( this.img,
                this.width * this.index, 0, this.width, this.height,
                this.x, this.y, this.width, this.height);
        },

        // 更新下一次鸟的数据
        update: function( delaySecond ) {
            this.index = ++this.index % 3;

            // 总路程 = 初始速度 * 时间 + 加速度 * 时间 * 时间 / 2
            // 小鸟最新的位置 = 当前位置 + 总路程
            this.y += this.speedSecond * delaySecond + this.a * delaySecond * delaySecond / 2;

            // 更新下落的速度，因为加速度的存在，下落越来越快
            // 新的速度 = 初始速度 + 加速度 * 时间
            this.speedSecond = this.speedSecond + this.a * delaySecond;
        },

        // 绑定点击事件，点击小鸟上飞
        bind: function() {
            var self = this;
            this.ctx.canvas.addEventListener( 'click', function() {
                self.speedSecond = -100;
            });
        }
    }

    w.Bird = Bird;

}( window ));