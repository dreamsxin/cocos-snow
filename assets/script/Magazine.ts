// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const {ccclass, property} = cc._decorator;

// 弹匣

@ccclass
export default class Magazine extends cc.Component {

    // 子弹图片
    @property(cc.SpriteFrame)
    bulletIcon : cc.SpriteFrame = null;

    capacity : number = 10; // 最大弹药
    count : number = 10; // 现有弹药数量

    onLoad () {

        // 子弹的水平间距
        let space: number = this.node.width / this.capacity;

        // 创建10个子弹
        let i : number = 0;
        for(i =0; i< this.capacity ; i++)
        {
            let bulletNode : cc.Node = new cc.Node();
            let bulletSprite  : cc.Sprite = bulletNode.addComponent(cc.Sprite);
            bulletSprite.spriteFrame = this.bulletIcon;
            this.node.addChild( bulletNode );

            bulletNode.x = space * i + 10; // 向右偏移一些
            bulletNode.y = 0;
        }
    }
    

    start () {

    }

    // update (dt) {}

    // 重置
    reset (){
        this.count = this.capacity;
        this.display();
    }

    // 消耗n个子弹
    consume ( n : number){
        this.count -= n;
        if(this.count < 0) 
            this.count = 0;
        
        this.display();
    }

    // 显示剩余的子弹
    // active的表示剩下的子弹
    display (){
        let nodes : cc.Node[] = this.node.children;

        let i : number = 0;
        for(i=0; i< nodes.length ; i++)
        {
            if(this.count > i)
                nodes[i].active = true;
            else
                nodes[i].active = false;
        }
    }
}
