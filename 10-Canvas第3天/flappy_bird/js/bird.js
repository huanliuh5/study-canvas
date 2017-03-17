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

        // 定义小鸟1单位速度对应的旋转角度
        this.unitAngle = 0.5;
        // 小鸟旋转的角度
        this.rotateAngle = 0;
        // 小鸟旋转的最大角度
        this.maxRotateAngle = 40;
        // 小鸟旋转的最小角度
        this.minRotateAngle = -30;

        this.bind();
    }

    // 置换原型
    Bird.prototype = {
        constructor: Bird,

        // 绘制鸟
        draw: function() {
            this.ctx.save();

            // 平移到小鸟的中心点
            var birdCoreX = this.x + this.width / 2;
            var birdCoreY = this.y + this.height / 2; 
            this.ctx.translate( birdCoreX, birdCoreY );
            
            // 旋转的角度 = 1单位速度旋转的角度 * 速度
            this.rotateAngle = this.unitAngle * this.speedSecond;
            this.rotateAngle = this.rotateAngle > this.maxRotateAngle? this.maxRotateAngle: this.rotateAngle;
            this.rotateAngle = this.rotateAngle < this.minRotateAngle? this.minRotateAngle: this.rotateAngle;

            // 旋转指定的弧度
            this.ctx.rotate( util.angleToRadian( this.rotateAngle ) );

            // 绘制旋转的小鸟
            this.ctx.drawImage( this.img,
                this.width * this.index, 0, this.width, this.height,
                -this.width / 2, -this.height / 2, this.width, this.height);

            this.ctx.restore();
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