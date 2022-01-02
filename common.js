/***
 * 
 * 创建21*25列空白table
 * 
 */
function createTable(){
	var a = document.getElementById('generate-table');
	var tbody_html = "";
	for ( var i = 0 ; i < 22 ; i++){
		var tr_html = "";
		var colNum = 25;
		if (i == 21) {
			colNum = 23;
		}
		for ( var j = 0; j < colNum ; j++){
			tr_html += "<td></td>";
		}
		tr_html = "<tr>" + tr_html + "</tr>";
		tbody_html += tr_html;
	}
	a.innerHTML = tbody_html;
} 
/*
 *根据初始金额和间隔金额回填表格
 */
function fillNumber(firstNum, numInterval){
	var commonNum = firstNum - numInterval;
	var temp = 1;
	for ( var i = 0; i < 22; i++){
		var a = document.getElementById('generate-table').getElementsByTagName('tr')[i].getElementsByTagName('td');
		if (i < 3) {
			for ( var j = 0; j < 25; j++){
				var isFill = false;
				if (i == 0 ) {
					if ( (j > 3 && j < 10) || ( j > 13 && j < 20) ){
						isFill = true;
					}
				} else if (i == 1){
					if ( (j > 2 && j < 10) || ( j > 13 && j < 22) ){
						isFill = true;
					} 
				} else if (i == 2) {
					if ( (j > 0 && j < 11) || ( j > 12 && j < 23) ){
						isFill = true;
					} 
				}
				if (isFill) {
					commonNum = commonFill(commonNum, numInterval, a, j);
				}
			}
		} else if(i<10){
			for ( var j = 0; j < 25; j++){
				commonNum = commonFill(commonNum, numInterval, a, j);
			}
		}  else if (i < 21) {
			for ( var j = temp; j < 25 - temp; j++){
				commonNum = commonFill(commonNum, numInterval, a, j);
			}
			temp = temp + 1;
		} else {
			a[11].innerHTML = "End";
			a[11].setAttribute('colspan', '3');
		}
	}
}

/**
 * 操作回填数值的方法
 * @param commonNum 数值
 * @param numInterval 间隔金额
 * @param a 当前tr这个行的对象
 * @param j 当前tr对应的td下标
 * @returns {number} 重新返回当前的数值
 */
function commonFill(commonNum, numInterval, a, j) {
	commonNum = (commonNum*10+ numInterval*10) / 10;
	a[j].innerHTML = "<a onclick='changeColor(this)'>" + commonNum + '</a>';
	return commonNum
}

function getStartAndIntervalMoney(){
	var myselect1=document.getElementsByClassName("startMoney")[0];
	var index1=myselect1.selectedIndex; 
	var selectStartMoney = myselect1.options[index1].value;

	var myselect2=document.getElementsByClassName("intervalMoney")[0];
	var index2=myselect2.selectedIndex; 
	var selectIntervalMoney = myselect2.options[index2].value;
	// console.log('selectStartMoney' + selectStartMoney, "selectIntervalMoney" + selectIntervalMoney)
	return {
		"selectStartMoney":selectStartMoney,
		"selectIntervalMoney":selectIntervalMoney
	};
}

//下拉菜单改变初始金额和间隔金额并由此修改表格中的数字
function changeNumber() {
	var getMoney= getStartAndIntervalMoney();
	fillNumber(getMoney.selectStartMoney,getMoney.selectIntervalMoney);
	// 修改初始金额和间隔金额之后都重置目标金额
	calMoney();
}

//点击金额单元格，出现确认弹窗，改变单元格背景颜色
function changeColor(obj) {
	// 先获取当前对象父元素td的class，判断是否为clicked，如果为clicked，弹窗出现，取消该单元格的颜色
	var result_now = obj.parentNode.getAttribute('class');
	if (result_now == 'clicked') {
		var result = confirm("不存"+obj.innerHTML+"了吗？？");
		if (result){
			obj.parentNode.setAttribute('class','');
		}
	} else {
		var result = confirm("真的要存"+obj.innerHTML+"吗");
		if (result){
			obj.parentNode.setAttribute('class','clicked');
		}
	}	
}

//1.已经填过了，想要取消  ✅
//2. 30次， 100次，200次，300次，365次存完钱有温馨提示 先放一放
//3.标题，日期，金额随着设定的初始金额和间隔金额而变化，已存金额 ✅
//4.优化下拉列表
//5.兼容浏览器窗口大小，自适应，滚动条
//6.****保存历史记录，若当日无存款更新，23:00钉钉机器人提示
//7.加速模式，自己选

//回填起始日和终止日
function getDate() {
	var d = new Date();
	var year = d.getFullYear(); 
	var fullStartDate = year + "-01-01";
	var fullEndDate = year + "-12-31";
	document.getElementsByClassName("startDate")[0].innerHTML = fullStartDate;
	document.getElementsByClassName("endDate")[0].innerHTML = fullEndDate;
}

 //计算目标金额
function calMoney() {
	var sum = 0 ;
	var getMoney= getStartAndIntervalMoney();
	// n为项数，a1为首项，d为差
	sum = 365 * getMoney.selectStartMoney + 365 * ( 365 - 1 ) * getMoney.selectIntervalMoney / 2;
	document.getElementsByClassName("targetMoney")[0].innerHTML = sum + ' 元';

}