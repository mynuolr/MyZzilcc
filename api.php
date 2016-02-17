<?php
header("Access-Control-Allow-Origin: *");

define("MYSQL_HOST", SAE_MYSQL_HOST_M);
define("MYSQL_PORT", SAE_MYSQL_PORT);
define("MYSQL_ADMIN", SAE_MYSQL_USER);
define("MYSQL_PASSWORD", SAE_MYSQL_PASS);
define("MYSQL_DATABASE", 'app_myzzilcc');

$db = mysqli_connect(MYSQL_HOST, MYSQL_ADMIN, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT);

mysqli_query($db, "set names utf8");

function varify_login($user, $pwd) {
	global $db;
	$qpwd = mysqli_fetch_assoc(mysqli_query($db, "SELECT password FROM `accounts` WHERE name LIKE '$user'"));
	return $qpwd['password'] == $pwd;
}

function get_avatar($user) {
	global $db;
	$avatar = mysqli_fetch_assoc(mysqli_query($db, "SELECT avatar FROM `accounts` WHERE name LIKE '$user'"));
	return $avatar['avatar'];
}

function get_post($id) {
	global $db;
	$query_posts_info = mysqli_query($db, "SELECT  `id` , `author`, `post_date`, `content` FROM posts where id=".$id);
	$post = mysqli_fetch_assoc($query_posts_info);
	$post['content'] = addslashes($post['content']);
	$post['content'] = str_replace("\'", "'", $post['content']);

	$res .= '{' . '"id":"' . $post['id'] . '", "author":"' . $post['author'] . '", "avatar":"' . get_avatar($post['author']) . '", "post_date":"' . $post['post_date'] . '", "content":"' . $post['content'] .'"}';
	return $res;
}

function post_modify($username, $id, $content, $datetime) {
	global $db;
	$query = mysqli_fetch_assoc(mysqli_query($db, "SELECT author FROM `posts` WHERE id LIKE '$id'"));
	if($query['author'] != $username) return false;
	else {
		$content = addslashes($content);
		$content = str_replace("\n", "<p>", $content);
		mysqli_query($db, "UPDATE  `posts` SET  `content` =  '$content', `post_date` = '$datetime' WHERE  `posts`.`id` =$id");
		return true;
	}
}

function add_post($author, $content, $datetime) {
	global $db;
	$content = addslashes($content);
	$content = str_replace("\n", "<p>", $content);
	mysqli_query($db, "INSERT INTO `posts` (`id`, `author`, `post_date`, `content`) VALUES (NULL, '$author', '$datetime', '$content')");
}

function remove_post($username, $id) {
	global $db;
	$query = mysqli_fetch_assoc(mysqli_query($db, "SELECT author FROM `posts` WHERE id LIKE '$id'"));
	if($query['author'] != $username) return false;
	else mysqli_query($db, "DELETE FROM `posts` WHERE `posts`.`id` = $id");
}

function posts_info($start, $cnts) {
	global $db;
	$query_posts_info = mysqli_query($db, "SELECT  `id` , `author`, `post_date`, `content` FROM posts ORDER BY  `posts`.`post_date` DESC LIMIT $start , $cnts");

	$res = "{\n\"posts_info\": [\n";
	for($i=mysqli_num_rows($query_posts_info); $i > 0; --$i) {
		$posti = mysqli_fetch_assoc($query_posts_info);
		$posti['content'] = addslashes($posti['content']);
		$posti['content'] = str_replace("\'", "'", $posti['content']);
		$posti['content'] = str_replace("<p>", "\\n", $posti['content']);
		if(strlen($posti['content']) > 130) $posti['content'] = mb_strcut($posti['content'], 0, 130, 'utf-8') . '...';
		$res .= '{' . '"id":"' . $posti['id'] . '", "author":"' . $posti['author'] . '", "avatar":"' . get_avatar($posti['author']) . '", "post_date":"' . $posti['post_date'] . '", "content":"' . $posti['content'] .'"}' . ($i != 1?",\n":"\n");
	}
	$res .= "]\n" . ', "posts_cnt":"' . mysqli_num_rows($query_posts_info) . '"}';
	return $res;
}

// add_post('测试', '2016-02-14 22:12:07', '2016-02-14 22:19:07', '233');

if(isset($_GET['login'])) {
	if(isset($_POST['username']) && varify_login($_POST['username'], $_POST['password']))
		echo '{ "login":"1", "username":"' . $_POST['username'] . '", "avatar":"' . get_avatar($_POST['username']) . '" }';
	else
		echo '{ "login":"0" }';
}

if(isset($_GET['posts_list'])) {
	if(isset($_POST['username']) && varify_login($_POST['username'], $_POST['password']))
		echo posts_info($_GET['start'], $_GET['cnt']);
}

if(isset($_GET['get_post'])) {
	if(isset($_POST['username']) && varify_login($_POST['username'], $_POST['password']))
		echo get_post($_GET['post_id']);
}


if(isset($_GET['modify'])) {
	if(isset($_GET['post_id']) && varify_login($_POST['username'], $_POST['password']))
		post_modify($_POST['username'], $_GET['post_id'], $_POST['content'], $_POST['postdate']);
	echo "{}";
}

if(isset($_GET['add_post'])) {
	if(isset($_POST['username']) && varify_login($_POST['username'], $_POST['password']))
		add_post($_POST['username'], $_POST['content'], $_POST['postdate']);
	echo "{}";
}

if(isset($_GET['remove_post'])) {
	if(isset($_POST['username']) && varify_login($_POST['username'], $_POST['password']))
		remove_post($_POST['username'], $_GET['post_id']);
	echo "{}";
}


?>
