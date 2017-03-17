/*
* 管道的特性：
* 1、上下管道是成对出现的，所以x轴坐标可以共享
* 2、上下管道之间的间距是固定的，由用户自由调节
* 3、管道的高度是随机生成的，随机生成上管道的高度，那么下管道的高度就可以计算出来了
* 4、当一对管道走出画布的时候，从右边出来时高度需要重新随机生成
* 5、需要指定管道的最小高度和最大高度
* */

(function( w ) {

    /*
    * constructor { Pipe } 管道构造函数
    * param { options: Object } 参数配置
    * param { options.ctx: Context } 绘制上下文
    * param { options.imgDown: Image } 口朝下的管道，在画布的上面
    * param { options.imgUp: Image } 口朝上的管道，在画布的下面
    * param { options.pipeTBSpace: number } 上下管道之间的间隔
    * param { options.pipeLRSpace: number } 管道与管道之间的间隔
    * param { options.minHeight: number } 管道最小高度
    * param { options.maxHeight: number } 管道最大高度
    * */
    function Pipe( options ) {
        // 记录管道创建的总数
        Pipe.len++;

        this.ctx = options.ctx;
        this.imgDown = options.imgDown;
        this.imgUp = options.imgUp;

        // 管道图像的宽和高
        this.imgWidth = this.imgDown.width;
        this.imgHeight = this.imgDown.height;

        // 管道上下间距和管道左右间距
        this.pipeTBSpace = options.pipeTBSpace || 150;
        this.pipeLRSpace = options.pipeLRSpace;

        // 管道的坐标
        this.x = 400 + (this.imgWidth + this.pipeLRSpace) * (Pipe.len - 1);
        this.y = 0;

        // 管道最小高度和最大高度
        this.minHeight = options.minHeight;
        this.maxHeight = options.maxHeight;

        // 管道每秒运行的速度
        this.speedSecond = 100;

        // 管道每秒的加速度
        this.a = 10;

        this.computePipeY();
    }

    // 记录管道的数量
    Pipe.len = 0;

    // 置换原型
    Pipe.prototype = {
        constructor: Pipe,

        // 计算上下管道y轴的坐标
        // 创建管道对象的时候，需要随机生成管道的高，然后计算上下管道的y轴坐标
        // 以后管道走出画布的时候，还需要再次随机生成管道的高，然后计算上下管道的y轴坐标
        computePipeY: function() {

            // 随机生成上管道的高度
            var pipeUpViewHeight = util.random( this.minHeight, this.maxHeight );

            // 上管道的Y轴坐标
            this.downY = pipeUpViewHeight - this.imgHeight;

            // 下管道的Y轴坐标
            this.upY = pipeUpViewHeight + this.pipeTBSpace;
        },

        // 绘制管道
        draw: function() {
            this.ctx.drawImage( this.imgDown, this.x, this.downY );
            this.ctx.drawImage( this.imgUp, this.x, this.upY );
            this.drawPath();
        },

        // 绘制管道对应的矩形路径
        drawPath: function() {
            this.ctx.rect( this.x, this.downY, this.imgWidth, this.imgHeight );
            this.ctx.rect( this.x, this.upY, this.imgWidth, this.imgHeight );
        },

        // 更新下一次管道绘制时的数据
        update: function( delaySecond ) {

            // 下一次绘制的x坐标 = 当前坐标 - 总路程
            this.x -= this.speedSecond * delaySecond + this.a * delaySecond * delaySecond / 2;
            
            // 根据时间和加速度，更新速度
            this.speedSecond += this.a * delaySecond;

            // 如果管道走出画布，向右拼接
            if( this.x < -this.imgWidth ) {
                this.x += (this.imgWidth + this.pipeLRSpace) * Pipe.len;
                this.computePipeY();
            }
        }
    };

    w.Pipe = Pipe;

}( window ));