/* eslint-disable no-console */
import '../css/index.less';
import '../iconfont/iconfont.css';
import print from './print';

const add = (x, y) => x + y;
add(1, 2);

print();

const promise = new Promise((resolve) => {
  setTimeout(() => {
    console.log('1s定时器执行完了');
    resolve('定时器执行完Promise传递的结果');
  }, 1000);
});
console.log(promise.then((res) => {
  console.log(res);
}));
if (module.hot) {
  // 一旦 module.hot 为true，说明开启了HMR功能。 --> 让HMR功能代码生效
  module.hot.accept('./print.js', () => {
    // 方法会监听 print.js 文件的变化，一旦发生变化，只有这个模块会重新打包构建，其他模块不会。
    // 会执行后面的回调函数
    print();
  });
}

// js懒加载+预加载
document.getElementById('btn').onclick = function () {
  // 将import的内容放在异步回调函数中使用，点击按钮，test.js才会被加载(不会重复加载)
  // webpackPrefetch: true表示开启预加载
  import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test').then(({ mul }) => {
    console.log(mul(4, 5));
  });
  import('./test').then(({ mul }) => {
    console.log(mul(2, 5))
  })
};

// if ('serviceWorker' in navigator) { // 处理兼容性问题
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('/service-worker.js') // 注册serviceWorker
//       .then(() => {
//         console.log('sw注册成功了~');
//       })
//       .catch(() => {
//         console.log('sw注册失败了~');
//       });
//   });
// }
