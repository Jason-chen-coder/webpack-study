/* eslint-disable no-console */
import '../css/index.less';
import '../iconfont/iconfont.css';

const add = (x, y) => x + y;
add(1, 2);

const promise = new Promise((resolve) => {
  setTimeout(() => {
    console.log('1s定时器执行完了');
    resolve('定时器执行完Promise传递的结果');
  }, 1000);
});
console.log(promise.then((res) => {
  console.log(res);
}));
