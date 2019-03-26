<template>
  <div class="puzzle">
    <!--拼图 demo-->
    <div class="my">{{ game.time==0?'我的成绩': game.time }}</div>

    <!--拼图区域 -->
    <div class="game">
      <div
        ref="puzzleImg"
        :style="{top:item.position[0]*size+'px',left:item.position[1]*size+'px'}"
        class="item"
        v-for="item in puzzle"
        :key="item.id"
        @touchstart="touchstart(item, $event)"
        @touchmove="touchmove(item, $event)"
        @touchend="touchend(item, $event)"
      >
        <img :src="item.src">
      </div>

      <div class="drag" :style="{top:drag.top+'px',left:drag.left+'px',display:drag.show}">
        <img :src="drag.src" alt>
      </div>
      <div v-if="game.end" class="end-block"></div>
      <div v-if="!game.start" class="block">
        <img v-tap="{methods:start}" class="start" src="../assets/img/puzzle/push.png" alt>
      </div>
    </div>

    <div class="car-name">斯柯达</div>

    <!--按钮区域 -->
    <div class="btns">
      <img
        v-if="game.replayShow"
        v-tap="{methods:replay}"
        class="replay"
        src="../assets/img/puzzle/replay.png"
        alt
      >
    </div>
  </div>
</template>

<script>

import { TYPE } from '../constant' //游戏类型  暂时为3*3
import { shuffle, timeIncrement } from '../util'

//test data
import img1 from '../assets/democar/1.png'
import img2 from '../assets/democar/2.png'
import img3 from '../assets/democar/3.png'
import img4 from '../assets/democar/4.png'
import img5 from '../assets/democar/5.png'
import img6 from '../assets/democar/6.png'
import img7 from '../assets/democar/7.png'
import img8 from '../assets/democar/8.png'
import img9 from '../assets/democar/9.png'
import defaultImg from '../assets/img/puzzle/push.png'

let imgs = [img1, img2, img3, img4, img5, img6, img7, img8, img9]


let timeInterval = null;
let startTime = 0; //记录开始时间


export default {

  data() {
    return {
      game: {
        start: false,
        time: 0,      //格式化后的时间
        msTime: 0,     //总的毫秒数
        replayShow: false,
      },

      //渲染完后 每个拼图的实际尺寸
      size: 0,

      correct: '1,2,3,4,5,6,7,8,9',
      //correct: '',

      //拼图数据
      puzzle: [
        {
          id: 1,
          src: defaultImg,
          position: [0, 0],   // 对应位置 [y,x]

        },
        {
          id: 2,
          src: defaultImg,
          position: [0, 1]
        },
        {
          id: 3,
          src: defaultImg,
          position: [0, 2]
        },
        {
          id: 4,
          src: defaultImg,
          position: [1, 0]
        },

        {
          id: 5,
          src: defaultImg,
          position: [1, 1]
        },
        {
          id: 6,
          src: defaultImg,
          position: [1, 2]
        },
        {
          id: 7,
          src: defaultImg,
          position: [2, 0]
        },
        {
          id: 8,
          src: defaultImg,
          position: [2, 1]
        },
        {
          id: 9,
          src: defaultImg,
          position: [2, 2]
        }
      ],

      //拖动模块
      drag: {
        top: 0,
        left: 0,
        show: 'none',
        src: ''
      },

      //点击初始 XY 坐标
      touchXY: {
        top: 0,
        left: 0,
        isEnough: false  //是否滑动足够的距离
      },

      //点击结束 XY坐标
      touchEndXY: {
        top: 0,
        left: 0,
      },
    }
  },


  methods: {

    init() {
      //初始化
      //获取关卡信息 排名信息
      this.game.replayShow = false

      let puzzle = imgs.map((item, index) => ({
        id: index + 1,
        src: item,
        position: [parseInt(index / TYPE), (index) % TYPE]
      }))
      this.puzzle = puzzle

    },


    replay() {
      //再玩一次
      this.game.time = 0
      this.start()
    },

    //开始拼图
    start() {
      //console.log('kaishi')
      //打乱顺序
      this.random()
      this.game.start = true
      this.game.msTime = 0
      this.game.time = 0
      this.recordTime()
      this.game.end = false
      this.game.replayShow = false
    },

    //开始计时
    recordTime() {
      startTime = new Date().getTime()
      timeInterval = setInterval(() => {
        let time = timeIncrement(startTime)
        this.game.msTime = time.total
        this.game.time = time.m + ':' + time.s + ':' + time.ms
      }, 10)
    },
    touchstart(current, e) {
      e.stopPropagation()

      this.drag.left = this.size * current.position[1]
      this.drag.top = this.size * current.position[0]
      this.drag.show = 'block'
      this.drag.src = current.src
      this.touchXY.top = e.touches[0].pageY
      this.touchXY.left = e.touches[0].pageX
      this.touchEndXY.left = e.touches[0].pageX
      this.touchEndXY.top = e.touches[0].pageY

    },
    touchend(current, e) {
      console.log(e)
      e.stopPropagation()
      this.drag.show = 'none'
      //判断最终的位置

      //如果移动的距离小于 每块拼图的一半 则回到原位置
      let left = this.touchEndXY.left - this.touchXY.left
      let top = this.touchEndXY.top - this.touchXY.top

      if (!(Math.abs(left) > this.size / 2 || Math.abs(top) > this.size / 2)) {
        return false
      }


      if (TYPE == 3) {
        //3*3拼图 
        //超出边界
        if (this.drag.left > 3 * this.size || this.drag.left < -this.size || this.drag.top > 3 * this.size || this.drag.top < -this.size) {
          return false
        }

        //判断目标方块位置

        let _position = [];
        _position.push(Math.round(Math.abs(this.drag.top / this.size)));
        _position.push(Math.round(Math.abs(this.drag.left / this.size)));

        let des = _position[0] * TYPE + _position[1]

        //交换目标位置和ID
        let tempId = current.id;
        let tempPosition = [...current.position]

        let index = this.puzzle.findIndex(v => v.id == des + 1)
        let currentIndex = this.puzzle.findIndex(v => v.id == current.id)

        this.puzzle[currentIndex].id = this.puzzle[index].id
        this.puzzle[currentIndex].position = this.puzzle[index].position

        this.puzzle[index].id = tempId
        this.puzzle[index].position = tempPosition

        //结果
        let result = this.puzzle.map(i => i.id)

        if (result.toString() == this.correct) {

          clearInterval(timeInterval)
          this.$toast.center('恭喜你,挑战成功!')

          this.game.replayShow = true
          this.game.end = true
        }

        //console.log(result.toString())
      }


    },
    touchmove(current, e) {
      //渲染drag的位置
      e.stopPropagation()
      let left = e.touches[0].pageX - this.touchXY.left
      let top = (e.touches[0].pageY - this.touchXY.top)

      if (navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('iPad') > -1) {
        //IOS 真机
        //top = top * 2 
      }

      this.touchEndXY.left = e.touches[0].pageX
      this.touchEndXY.top = e.touches[0].pageY
      this.drag.left = left + current.position[1] * this.size
      this.drag.top = top + current.position[0] * this.size

    },

    random() {
      let indexArr = []
      for (let i = 0; i < TYPE * TYPE; i++) {
        indexArr.push(i)
      }

      this.correct = indexArr.map(item => item + 1).toString()

      let randomArr = shuffle(indexArr)

      let result = randomArr.map(item => {
        return {
          position: [parseInt(item / TYPE), item % TYPE],
          //position: [item % TYPE, parseInt(item / TYPE)],
          id: item + 1
        }
      })

      let temp = this.puzzle.map((item, index) => {
        return {
          ...item,
          position: result[index].position,
          id: result[index].id
        }
      })
      this.puzzle = temp
    }
  },

  created() {
    //获取
    this.init()

    this.$nextTick(function () {
      //渲染每个拼图的位置
      this.size = this.$refs.puzzleImg[0].offsetWidth
    })

  },

}
</script>

<style lang="less" scoped>
.puzzle {
  width: 750px;
  height: 100vh;
  background-image: url("../assets/img/puzzle/bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding-top: 1px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  user-select: none;

  .car-name {
    font-size: 24px;
    height: 28rpx;
    text-align: center;
    margin: 14px 0 24px 0;
  }

  .drag {
    width: 204px;
    height: 204px;
    line-height: 204px;
    // background-color: red;
    position: absolute;
    top: 0;
    text-align: center;
    color: #fff;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .my {
    width: 690px;
    height: 150px;
    margin: 30px auto 0 auto;
    font-size: 46px;
    color: rgb(89, 87, 87);
    display: flex;
    justify-content: center;
    align-items: center;

    background: url("../assets/img/puzzle/box.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .game {
    width: 620px;
    height: 620px;
    box-sizing: border-box;
    border: 8px solid rgb(85, 176, 255);
    margin: 50px auto 0 auto;
    border-radius: 5px;
    position: relative;
    overflow: hidden;

    .end-block {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .block {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      top: 0;
      left: 0;
      .start {
        position: absolute;
        top: 210px;
        left: 210px;
        height: 186px;
        width: 186px;
      }
    }

    .item {
      width: 204px;
      height: 204px;
      position: absolute;
      font-size: 30px;
      color: #000;
      line-height: 204px;
      text-align: center;
      margin: 0;
      padding: 0;
      img {
        width: 100%;
        height: 100%;
        display: block;
        margin: 0;
        padding: 0;
      }
    }
  }

  .btns {
    img {
      width: 212px;
      height: 72px;

      &.back {
        margin-left: 68px;
      }
      &.replay {
        // margin-left: 14px;
        display: block;
        margin: 0 auto;
      }
      &.next {
        width: 164px;
        margin-left: 20px;
      }
    }
  }
}
</style>
