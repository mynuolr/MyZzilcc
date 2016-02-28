// 初始化
if(typeof Cookies.get('type') === "undefined")
	Cookies.set('type', 'love', {expires: 365, path: '/'});
if(typeof Cookies.get('search_engine') === "undefined")
	Cookies.set('search_engine', 'baidu', {expires: 365, path: '/'});
if(typeof Cookies.get('notebooks') === "undefined")
	Cookies.set('notebooks', 'login', {expires: 365, path: '/'});

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
		$('#sakura').hide();
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

// 名言警句模块
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
$('#search').val('You are my zzilcc.');
$('#search').focus(function() {
	if($('#search').val() == 'You are my zzilcc.') $('#search').val('');
});

$('#search').blur(function() {
	if($('#search').val() == '') $('#search').val('You are my zzilcc.');
});

// Notebooks 页面
// login模块

// var api = "http://127.0.0.1/MyZzilcc/api.php";
var api = "http://myzzilcc.applinzi.com/api.php";
var posts_per_page = 5;

function gettime() {
	var time = new Date();
	var Month = time.getMonth()+1;
	var datetime = time.getFullYear().toString()+ '-' +
					(Month<10?'0'+Month:Month) + '-' +
					(time.getDate()<10?'0'+time.getDate():time.getDate()) + ' ' +
					(time.getHours()<10?'0'+time.getHours():time.getHours()) + ':' +
					(time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes()) + ':' +
					(time.getSeconds()<10?'0'+time.getSeconds():time.getSeconds());
	return datetime;
}

function show_avatar() {
	if(Cookies.get('notebooks') != "login") {
			$('#notebooks').html(
				'<div class="userinfo" id="userinfo">'+
					'<div class="user"><img src=' + Cookies.get('avatar') + ' class="avatar"></img>' +
					'<span class="username">' + Cookies.get('username') + '</span></div>' +
				'</div>'
			);
	}
}

function notebooks() {
	show_avatar();
	switch(Cookies.get('notebooks')) {
		case "login":
			$('#notebooks').html(
				'<div id="login" class="login">' +
				'Our Memories:<br>' +
					'Username: <input type="text" class="inputbox" id="username"></input><br>' +
					'Password: <input type="password" class="inputbox" id="password"></input><br>' +
					'<button type="button" class="button" id="loginsub">Login</button>' +
					'<div id="login_info"></div>' +
				'</div>'
			);

			$('#loginsub').click(function() {
				Cookies.set('username', $('#username').val());
				Cookies.set('password', md5($('#password').val()));
				$.ajax({
					url: api+"?login",
					success: function(a) {
						Cookies.set('notebooks', a.login==1?"posts_list":"login");
						Cookies.set('posts_start', 0);
						if(Cookies.get('notebooks') != "login") {
							Cookies.set('avatar', a.avatar);
							$('#login').hide(300);
							notebooks();
						}
						else $('#login_info').text("Login failed!Incorrect username or password...");
					},
					type: "POST",
					data: {username: Cookies.get('username'), password: Cookies.get('password')},
					dataType: "json"
				});
			});
			break;
		case "posts_list":
			$('#notebooks').append(
				'<div id="posts_list" class="posts_list">' +
				'</div>'
			);
			$.ajax({
				url: api+"?posts_list&start="+Cookies.get('posts_start')+'&cnt='+posts_per_page,
				success: function(a) {
					for(var i=0; i<a.posts_cnt; ++i) {
						$('#posts_list').append(
							'<div id="post" class="post" data-postid='+
							a.posts_info[i].id +
							'><div class="post_header"><img src=' +
							a.posts_info[i].avatar + ' class="avatar">' +
							a.posts_info[i].author + '<span class="post_date"><i class="fa fa-calendar"></i>' +
							a.posts_info[i].post_date +
							'</span></div>' +
							'<div class="post_content">' +
							a.posts_info[i].content +
							'</div></div>'
						);
					}
					$('#notebooks').append(
						'<div class="center">' +
							'<button class="button" id="prevp">Prev.</button>' +
							'<button class="button" id="nextp">Next.</button>' +
						'</div>'
					);
					$('#userinfo').append(
						'<div class="write_button"><button class="button" id="refresh">Refresh.</button><button class="button" id="write">Write.</button></div>'
					);
					if(a.posts_cnt < posts_per_page) $('#nextp').hide();
					if(Cookies.get('posts_start') == '0') $('#prevp').hide();
					// 事件检测，点击读取内容，因为是异步处理，所以需要在回调函数中执行。
					$('.post').click(function(){
						Cookies.set('notebooks', 'read');
						Cookies.set('post_id', $(this).attr('data-postid'));
						notebooks();
					});

					$("#refresh").click(function() {
						notebooks();
					});

					$("#nextp").click(function() {
						Cookies.set('posts_start', parseInt(Cookies.get('posts_start'))+posts_per_page);
						notebooks();
					});
					$("#prevp").click(function() {
						var p = parseInt(Cookies.get('posts_start'))-posts_per_page;
						if(p < 0) p = 0;
						Cookies.set('posts_start', p);
						notebooks();
					});
					$('#write').click(function(){
						Cookies.set('notebooks', 'write');
						notebooks();
					})

				},
				type: "POST",
				data: {username: Cookies.get('username'), password: Cookies.get('password')},
				dataType: "json"
			});
			break;
		case "read":
			$.ajax({
				url: api+"?get_post&post_id=" + Cookies.get('post_id'),
				success: function(a) {
					localStorage.post_date = a.post_date;
					localStorage.content = a.content;
					$('#notebooks').append(
						'<div id="read" class="read">' +
						'</div>'
					);
					$('#read').append(
						'<div id="post" class="post"><div class="post_header"><img src=' +
						a.avatar + ' class="avatar">' +
						a.author + '<span class="post_date"><i class="fa fa-calendar"></i>' +
						a.post_date +
						'</span></div>' +
						'<div class="post_content">' +
						a.content +
						'</div></div>'
					);
					$('#read').append(
						'<div class="center">' +
							'<button class="button" id="return">Return</button>' +
							'<button class="button" id="modify">Modify</button>' +
							'<button class="button" id="delete">Delete</button>' +
						'</div>' +
						'<div id="delete_dialog"></div>'
					);
					if(Cookies.get('username') != a.author) {
						$('#delete').remove();
						$('#modify').remove();
					}
					$('#return').click(function() {
						Cookies.set('notebooks', 'posts_list');
						notebooks();
					});
					$('#modify').click(function(){
						Cookies.set('notebooks', 'modify');
						notebooks();
					});
					$('#delete').click(function() {
						$('#delete_dialog').html(
							'<div class="center">' +
								'<p>Are you sure?</p>' +
								'<button class="button" id="delete_yes">Yes</button>' +
								'<button class="button" id="delete_no">No</button>' +
							'</div>'
						);
						$('#delete_no').click(function() {
							$('#delete_dialog').html('');
						})
						$('#delete_yes').click(function() {
							$.ajax({
								url: api+"?remove_post&post_id=" + Cookies.get('post_id'),
								type: "POST",
								success: function() {
									Cookies.set('notebooks', 'posts_list');
									notebooks();
								},
								data: {username: Cookies.get('username'), password: Cookies.get('password')},
								dataType: "json"
							});
						});
					});

				},
				type: "POST",
				data: {username: Cookies.get('username'), password: Cookies.get('password')},
				dataType: "json"
			});
			break;
		case "modify":
			$('#notebooks').append(
				'<div class="center">' +
				'Date: <input id="modify_post_date" class="inputbox" value="'+ localStorage.post_date + '"></input><br>' +
				'Conte:<textarea id="modify_post_content" class="inputbox" rows="20">' +
					localStorage.content.replace(/<p>/g, '\n') +
				'</textarea>'+
				'</div>'
			);
			$('#notebooks').append(
				'<div class="center">' +
					'<button class="button" id="return">Return</button>' +
					'<button class="button" id="modify">Modify</button>' +
				'</div>'
			);

			$('#return').click(function() {
				Cookies.set('notebooks', 'read');
				notebooks();
			});
			$('#modify').click(function(){
				$.ajax({
					url: api+"?modify&post_id=" + Cookies.get('post_id'),
					type: "POST",
					data: {username: Cookies.get('username'), password: Cookies.get('password'), content: $('#modify_post_content').val(), postdate: $('#modify_post_date').val()},
					dataType: "json"
				});
				Cookies.set('notebooks', 'read');
				notebooks();
			});

			// 2s保存一下
			setInterval(function() {
				if(Cookies.get('notebooks') == "modify") {
					localStorage.post_date = $('#modify_post_date').val();
					localStorage.content = $('#modify_post_content').val();
				}
			}, 2000);
			break;
		case "write":
			if(typeof localStorage.write_time === "undefined" || localStorage.write_time === "undefined") { // 未定义
				localStorage.write_time = gettime();
				localStorage.write_content = '';
			}

			$('#notebooks').append(
				'<div class="center">' +
				'Date: <input id="post_date" class="inputbox" value="'+ localStorage.write_time + '"></input><br>' +
				'Conte:<textarea id="post_content" class="inputbox" rows="20">' +
				localStorage.write_content +
				'</textarea>'+
				'</div>'
			);
			$('#notebooks').append(
				'<div class="center">' +
					'<button class="button" id="write_return">Return</button>' +
					'<button class="button" id="write_submit">Submit</button>' +
				'</div><p id="submit_status" class="center"></p>'
			);

			$('#write_return').click(function() {
				Cookies.set('notebooks', 'posts_list');
				notebooks();
			});
			$('#write_submit').click(function() {
				$.ajax({
					url: api+"?add_post",
					type: "POST",
					success: function() {
						localStorage.write_time = undefined;
						Cookies.set('notebooks', 'posts_list');
						notebooks();
					},
					data: {username: Cookies.get('username'), password: Cookies.get('password'), content: $('#post_content').val(), postdate: $('#post_date').val()},
					dataType: "json"
				});
				$('#submit_status').text('Submit...Please Wait..')
			});

			setInterval(function() {
				if(Cookies.get('notebooks') == "write") {
					localStorage.write_time = $('#post_date').val();
					localStorage.write_content = $('#post_content').val();
				}
			}, 2000);

			break;
	}
}
notebooks();

// 事件检测



