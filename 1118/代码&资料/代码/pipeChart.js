(function( w ) {
    // 角度转换为弧度
    function angleToRadian( angle ) {
        return Math.PI / 180 * angle;
    }

    /*
     * constructor { PipeChart } 饼图构造函数
     * param { ctx: Context } 绘图上下文
     * param { data: Array } 绘制饼图所需的数据
     * param { x: number } 圆心x坐标
     * param { y: number } 圆心y坐标
     * param { r: number } 饼图半径
     * */
    function PipeChart( ctx, data, x, y, r ) {

        this.ctx = ctx;
        this.data = data;
        this.x = x;
        this.y = y;
        this.r = r;

        // 文字衬托线到圆的距离
        this.lineSpace = 20;

        // 扇形和文字的杨色
        this.colors = 'blue,hotpink,green,deeppink,ivory,skyblue,lavender,lavenderblush'.split(',');

        // 把数据转换为对应的角度
        this.processData();
    }

    // 置换原型
    PipeChart.prototype = {

        constructor: PipeChart,

        // 绘制饼图
        draw: function() {
            this.drawPipe();
            this.drawText();
        },

        // 根据数据转换成对应的角度
        processData: function() {
            /*
             * 实现思路：
             * 1、求单位数据所占用的角度 ==> 360 / 数据总和
             * 2、使用单位数据所占用角度 * 每一份数据值得到每一份数据所占用的角度
             * 3、把计算好的角度使用一个数据存储起来，供其他方法使用
             * */
            var self = this;

            // 求数据总和
            var num = 0;
            this.data.forEach( function( obj ) {
                num += obj.val;
            });

            // 求单位数据所占用的角度
            var unitAngle = 360 / num;

            // 用来存储数据所占用饼图的角度
            this.processArr = [];

            this.data.forEach( function( obj ) {
                // 这里的this不是饼图实例，所以使用self
                self.processArr.push( unitAngle * obj.val );
            });
        },

        // 绘制饼中的扇
        drawPipe: function() {

            // 扇形默认起点和结束点
            var startAngle = 0;
            var endAngle = 0;

            /*
             * 实现思路：
             * 1、遍历所有计算好的角度
             * 2、beginPath、moveTo到饼图圆心
             * 3、画对应扇形的弧
             * 3.1、弧的起点位置 = 上一个弧的结束点
             * 3.2、弧的结束点位置 = 上一个弧的结束点 + 自己的角度
             * 4、closePath
             * 5、修改填充色
             * 6、fill
             * */

            // 遍历所有计算好的角度，绘制成不同颜色的扇形
            for( var i = 0, len = this.processArr.length; i < len; i++ ) {

                // 当前扇形弧的起点位置 = 上一个扇形弧的结束点
                // 当前扇形弧的结束点位置 = 上一个扇形弧的结束点 + 自己扇形所占用的角度
                startAngle = endAngle;
                endAngle = endAngle + this.processArr[i];

                this.ctx.beginPath();
                this.ctx.moveTo( this.x, this.y );
                this.ctx.arc( this.x, this.y, this.r, angleToRadian( startAngle ), angleToRadian( endAngle ) );
                this.ctx.closePath();
                this.ctx.fillStyle = this.colors[ i ];
                this.ctx.fill();
            }
        },

        // 绘制文字
        drawText: function() {

            // 扇形默认起点和结束点
            var startAngle = 0;
            var endAngle = 0;

            // 扇形平分线的角度
            var lineAngle = 0;
            var lineX = 0;
            var lineY = 0;

            // 遍历所有计算好的角度，绘制成不同颜色的扇形
            for( var i = 0, len = this.processArr.length; i < len; i++ ) {

                // 当前扇形弧的起点位置 = 上一个扇形弧的结束点
                // 当前扇形弧的结束点位置 = 上一个扇形弧的结束点 + 自己扇形所占用的角度
                startAngle = endAngle;
                lineAngle = startAngle + this.processArr[i] / 2;
                endAngle = endAngle + this.processArr[i];

                /*
                 * 求平分线的x&y坐标
                 * x: 圆心x + r * Math.cos( angleToRadian(45) )
                 * y: 圆心y +  r * Math.sin( angleToRadian(45) )
                 * */
                lineX = this.x + (this.r + this.lineSpace) * Math.cos( angleToRadian(lineAngle) );
                lineY = this.y + (this.r + this.lineSpace) * Math.sin( angleToRadian(lineAngle) );

                // 画扇形平分线
                this.ctx.beginPath();
                this.ctx.moveTo( this.x, this.y );
                this.ctx.lineTo( lineX, lineY );
                this.ctx.strokeStyle = this.colors[i];
                this.ctx.stroke();

                // 添加文字描述
                if( lineAngle >= 90 & lineAngle <= 270 ) {
                    this.ctx.textAlign = 'right';
                    this.ctx.moveTo( lineX, lineY );
                    this.ctx.lineTo( lineX - this.ctx.measureText( this.data[i].msg ).width, lineY );
                }else {
                    this.ctx.textAlign = 'left';
                    this.ctx.moveTo( lineX, lineY );
                    this.ctx.lineTo( lineX + this.ctx.measureText( this.data[i].msg ).width, lineY );
                }
                this.ctx.textBaseline = 'bottom';
                this.ctx.fillStyle = this.colors[i];
                this.ctx.fillText( this.data[i].msg, lineX, lineY - 5 );
                this.ctx.stroke();
            }
        }
    };

    w.PipeChart = PipeChart;
}( window ));