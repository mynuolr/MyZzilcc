function mettime() {
	var MetTime = new Date('2015/10/19 00:00:00');
	var LoveTime = new Date('2016/02/14 00:00:00');
	var NowTime = new Date();
	var mt = NowTime.getTime() - MetTime.getTime();
	var lt = NowTime.getTime() - LoveTime.getTime();
	var	md=Math.floor(mt/1000/60/60/24);
	var	ld=Math.floor(lt/1000/60/60/24);

	$('#metdays').text(md<10?"0"+md:md);
	$('#lovedays').text(ld<10?"0"+ld:ld);
}
setInterval(mettime, 400);
