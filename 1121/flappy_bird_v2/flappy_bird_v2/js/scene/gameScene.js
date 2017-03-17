/*
* 游戏场景复杂创建游戏运行时所需的所有角色，
* 然后提供一个方法，支配所有的角色执行。
* */
(function( w ) {

    /*
    * constructor { GameScene } 游戏运行的场景对象
    * param { options } 对象配置
    * param { options.ctx: Context } 绘图上下文
    * param { options.imgs: Object } 创建角色所需的所有图像
    * */
    function GameScene( options ) {

        this.ctx = options.ctx;
        this.imgs = options.imgs;

        // 存储游戏运行时所需的所有角色
        this.roles = [];

        // 小鸟死亡时，要执行的所有回调函数
        this.birdDieCallbackList = [];

        this.createRoles();
    }

    /*
    * 给游戏场景对象的原型添加方法：
    * 1、创建角色的方法
    * 2、支配所有角色的方法
    * 3、小鸟是否死亡的方法（死亡要通知游戏主函数，解决方式一会再说）
    * */
    util.extend( GameScene.prototype, {

        // 创建该场景所需的角色
        createRoles: function() {

            // 创建2个背景对象
            for( var i = 0; i < 2; i++ ) {
                this.roles.push( new Sky( { ctx: this.ctx, img: this.imgs.sky } ) );
            }

            // 创建7个管道对象
            for( var i = 0; i < 7; i++ ) {
                this.roles.push(new Pipe( { ctx: this.ctx, imgDown: this.imgs.pipeDown, imgUp: this.imgs.pipeUp,
                    pipeTBSpace: 150, pipeLRSpace: 100, minHeight: 50,
                    maxHeight: this.ctx.canvas.height - this.imgs.land.height - 50 - 150 } ));
            }

            // 创建4个大地对象
            for( var i = 0; i < 4; i++ ) {
                this.roles.push( new Land( { ctx: this.ctx, img: this.imgs.land } ) );
            }

            // 创建1个计时器对象
            this.roles.push( new Timer( { ctx: this.ctx } ) );

            // 创建1个鸟对象
            this.roles.push( new Bird( { ctx: this.ctx, img: this.imgs.bird, widthFrame: 3, heightFrame: 1 } ) );
        },

        // 让所有的角色依据游戏的延迟时间进行响应
        run: function( delaySecond ) {
            this.roles.forEach( function( role ) {
                role.draw();
                role.update( delaySecond );
            });

            // 每次绘制完毕后，看看小鸟有没有死亡，如果死亡了，
            // 执行所有的小鸟死亡回调
            if( this.isBirdDie() ) {
                this.runBirdDieCbk();
            }
        },

        // 判断小鸟是否死亡
        isBirdDie: function() {
            var bird = this.roles[ this.roles.length - 1 ];
            var birdCoreX = bird.x + bird.width / 2;
            var birdCoreY = bird.y + bird.height / 2;
            if( birdCoreY < 0 || birdCoreY > ( this.ctx.canvas.height - this.imgs.land.height) ||
                this.ctx.isPointInPath( birdCoreX, birdCoreY ) ) {
                return true;
            }
            return false;
        },

        // 执行小鸟死亡时所有的回调
        runBirdDieCbk: function() {
            this.birdDieCallbackList.forEach( function( fn ) {
                fn();
            });
        },

        // 添加小鸟死亡的回调
        addBirdDieCbk: function( fn ) {
            this.birdDieCallbackList.push( fn );
        }

    } );

    w.GameScene = GameScene;

}( window ));