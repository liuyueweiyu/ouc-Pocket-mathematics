function ComCategory(type){
  switch(type){
    case "线性代数":return 1;
    case "高等数学":return 2;
    case "概率统计":return 3;
    case "数学分析":return 4;
    case "高等代数":return 5;
    case "其他":return 6;
  }
}

module.exports = {
  ComCategory
}
