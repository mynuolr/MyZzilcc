// 初始化
if(typeof Cookies.get('type') === "undefined")
	Cookies.set('type', 'love', {expires: 365, path: '/'});
if(typeof Cookies.get('search_engine') === "undefined")
	Cookies.set('search_engine', 'baidu', {expires: 365, path: '/'});
if($(window).width() < $(window).height()) // 竖屏
	$('#sakura').remove();

// 显示按钮文字
switch(Cookies.get('type')) {
	case "love":
		$('#toggle').attr("value", "Love");
		$('#myzzilcc').show(0);
		$('#tools').hide(0);
		$('#notebooks').hide(0);
		break;
	case "tools":
		$('#toggle').attr("value", "Tools");
		$('#myzzilcc').hide(0);
		$('#tools').show(0);
		$('#notebooks').hide(0);
		break;
	case "notebooks":
		$('#toggle').attr("value", "Notebooks");
		$('#myzzilcc').hide(0);
		$('#tools').hide(0);
		$('#notebooks').show(0);
		break;
}

// 默认引擎
$('#search_engine').val(Cookies.get('search_engine'));
switch($('#search_engine').val()) {
	case 'baidu':
		$('#search_bar').attr('action', 'http://www.baidu.com/s');
		$('#search').attr('name', 'wd');
		break;
	case 'google':
		$('#search_bar').attr('action', 'https://www.google.com/search');
		$('#search').attr('name', 'q');
		break;
}

// 按钮点击事件
$('#toggle').click(function() {
	switch(Cookies.get('type')) {
		case "love": // 如果当前状态是love
			$('#toggle').attr("value", "Tools");
			Cookies.set('type', 'tools', {expires: 365, path: '/'}); // 切换到tools
			$('#myzzilcc').hide(0);
			$('#tools').show(300);
			$('#notebooks').hide(0);
			break;
		case "tools": // 如果当前状态是tools
			$('#toggle').attr("value", "Notebooks");
			Cookies.set('type', 'notebooks', {expires: 365, path: '/'}); // 切换到notebooks
			$('#myzzilcc').hide(0);
			$('#tools').hide(0);
			$('#notebooks').show(300);
			break;
		case "notebooks":
			$('#toggle').attr("value", "Love");
			Cookies.set('type', 'love', {expires: 365, path: '/'}); // 切换到love
			$('#myzzilcc').show(300);
			$('#tools').hide(0);
			$('#notebooks').hide(0);
	}
});

// 切换引擎事件
$('#search_engine').change(function(){
	switch($('#search_engine').val()) {
		case 'baidu':
			Cookies.set('search_engine', 'baidu', {expires: 365, path: '/'});
			$('#search_bar').attr('action', 'http://www.baidu.com/s');
			$('#search').attr('name', 'wd');
			break;
		case 'google':
			Cookies.set('search_engine', 'google', {expires: 365, path: '/'});
			$('#search_bar').attr('action', 'https://www.google.com/search');
			$('#search').attr('name', 'q');
			break;
	}
});

// 名言警句
// $.getJSON("http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback=", function(a) {
	// $(".quote").append(a[0].content + "<p>— " + a[0].title + "</p>")
// });
// set timeout
$.ajax({
	url: "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback=",
	context: $("#quote"),
	success: function(a) {
		$(this).append(a[0].content + "<p>— " + a[0].title + "</p>");
	},
	timeout: 1000
});

// 搜索框默认文字
$('#search').val('I am here waiting for you...');
$('#search').focus(function() {
	if($('#search').val() == 'I am here waiting for you...') $('#search').val('');
});

$('#search').blur(function() {
	if($('#search').val() == '') $('#search').val('I am here waiting for you...');
});

