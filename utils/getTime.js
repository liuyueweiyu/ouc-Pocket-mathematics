function getTime(str) {
  const time = new Date(str),
    now = new Date(new Date().setHours(0, 0, 0, 0)),
    //本周一0点时间戳
    Monday = new Date(new Date().setDate(now.getDate() - (now.getDay() - 1))).setHours(0, 0, 0, 0);
  const spacing = (now.valueOf() - time.valueOf()) / 1000;
  if (spacing <= 0) { //当天显示具体时间
    return str.substr(10, 6);
  }
  else if (spacing < 86400) {  //昨天
    return '昨天';
  }
  else if (time - Monday.valueOf() > 0) {    //本周
    return getDay(time.getDay());
  }
  else
    return str.substr(0, 10);
  function getDay(index) {
    switch (index) {
      case 1: return '周一';
      case 2: return '周二';
      case 3: return '周三';
      case 4: return '周四';
      case 5: return '周五';
      case 6: return '周六';
      case 7: return '周日';
    }
  }
}

module.exports = {
  getTime,
}