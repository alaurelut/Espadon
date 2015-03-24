<?php

class PartnerHandler {
	function get($id){
		$db = db::instance();

		$sql = "SELECT `id_space`, `name`, `function`, `photo`, `url_flickr`, `username`  FROM `spd_partners` WHERE `id` = $id;";
		$stmt = $db->dbh->query($sql);
		$data = $stmt->fetch(PDO::FETCH_ASSOC);

		$return = array(
			'code'		=> 200,
			'message'	=> 'OK',
			'data'		=> $data
		);

		echo json_encode($return);
	}

	function post(){
		if(isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
			$_POST = array_merge($_POST, (array) json_decode(trim(file_get_contents('php://input')), true));
		}

		$db = db::instance();

		if( isset($_POST['id_space']) && $_POST['id_space'] !== '' &&
			isset($_POST['name']) && $_POST['name'] !== ''){

			$sql_count = "SELECT COUNT(`id`) as nb FROM `spd_partners` WHERE `id_space` = '".$_POST['id_space']."' AND `name` = '".$_POST['name']."';";
			$count = $db->dbh->query($sql_count);
			$count = $count->fetch(PDO::FETCH_ASSOC);

			if($count['nb'] == 0){

				$sql_insert = "INSERT INTO `spd_partners` (`id_space`, `name`, `function`, `photo`, `url_flickr`, `username`,  `created_at`)
								VALUES (:id_space, :name, :function, :photo, :url_flickr, :username, now());";

				$query_insert = $db->dbh->prepare($sql_insert);
				$query_insert->bindValue('id_space', $_POST['id_space'], PDO::PARAM_STR);
				$query_insert->bindValue('name', $_POST['name'], PDO::PARAM_STR);

				if(isset($_POST['function']))
					$query_insert->bindValue('function', $_POST['function'], PDO::PARAM_STR);
				else
					$query_insert->bindValue('function', '', PDO::PARAM_STR);

				if(isset($_POST['photo']))
					$query_insert->bindValue('photo', $_POST['photo'], PDO::PARAM_STR);
				else
					$query_insert->bindValue('photo', '', PDO::PARAM_STR);

				if(isset($_POST['url_flickr']))
					$query_insert->bindValue('url_flickr', $_POST['url_flickr'], PDO::PARAM_STR);
				else
					$query_insert->bindValue('url_flickr', '', PDO::PARAM_STR);

				if(isset($_POST['username']))
					$query_insert->bindValue('username', $_POST['username'], PDO::PARAM_STR);
				else
					$query_insert->bindValue('username', '', PDO::PARAM_STR);

				$query_insert->execute();

				$sql_select_user = "SELECT `id`, `id_space`, `name`, `function`, `photo`, `url_flickr`, `username` FROM `spd_partners` WHERE `id` = ".$db->dbh->lastInsertId().";";
				$stmt = $db->dbh->query($sql_select_user);
				$data = $stmt->fetch(PDO::FETCH_ASSOC);

				$return = array(
					'code'		=> 200,
					'message'	=> 'OK',
					'data'		=> $data
				);
			} else {
				header("HTTP/1.0 400 Bad Request");
				$return = array(
					'code'		=> 400,
					'message'	=> 'Bad Request'
				);
			}

		} else {
			header("HTTP/1.0 400 Bad Request");
			$return = array(
				'code'		=> 400,
				'message'	=> 'Bad Request'
			);
		}

		echo json_encode($return);
	}

	function put($id){
		$db = db::instance();
		$sql_count = "SELECT COUNT(`id`) as nb FROM `spd_partners` WHERE `id` = ".$id.";";
		$count = $db->dbh->query($sql_count);
		$count = $count->fetch(PDO::FETCH_ASSOC);

		if($count['nb'] != 0) {
			parse_str(file_get_contents("php://input"), $PUT);

			$sql_update = "UPDATE `spd_partners` SET";
			if(isset($PUT['name']) && $PUT['name'] != '')
				$sql_update .= " `name` = :name,";
			if(isset($PUT['function']) && $PUT['function'] != '')
				$sql_update .= " `function` = :function,";
			if(isset($PUT['id_flickr']) && $PUT['id_flickr'] != '')
				$sql_update .= " `id_flickr` = :id_flickr,";
			if(isset($PUT['url_flickr']) && $PUT['url_flickr'] != '')
				$sql_update .= " `url_flickr` = :url_flickr,";
			if(isset($PUT['username']) && $PUT['username'] != '')
				$sql_update .= " `username` = :username,";
			$sql_update .= " `updated_at` = now()";
			$sql_update .= " WHERE `id` = ".$id.";";

			$query_update = $db->dbh->prepare($sql_update);
			if(isset($PUT['name']) && $PUT['name'] != '')
				$query_update->bindValue('name', $PUT['name']);
			if(isset($PUT['function']) && $PUT['function'] != '')
				$query_update->bindValue('function', $PUT['function']);
			if(isset($PUT['id_flickr']) && $PUT['id_flickr'] != '')
				$query_update->bindValue('id_flickr', $PUT['id_flickr']);
			if(isset($PUT['url_flickr']) && $PUT['url_flickr'] != '')
				$query_update->bindValue('url_flickr', $PUT['url_flickr']);
			if(isset($PUT['username']) && $PUT['username'] != '')
				$query_update->bindValue('username', $PUT['username']);

			$query_update->execute();

			$return = array(
				'code'		=> 200,
				'message'	=> 'OK'
			);

		} else {
			header("HTTP/1.0 400 Bad Request");
			$return = array(
				'code'		=> 400,
				'message'	=> 'Bad Request'
			);
		}

		echo json_encode($return);
	}

	function delete($id){
		$db = db::instance();
		$sql_count = "SELECT COUNT(`id`) as nb FROM `spd_partners` WHERE `id` = ".$id.";";
		$count = $db->dbh->query($sql_count);
		$count = $count->fetch(PDO::FETCH_ASSOC);

		if($count['nb'] != 0) {
			$sql_delete = "DELETE FROM `spd_partners` WHERE `id` = :id;";
			$query_delete = $db->dbh->prepare($sql_delete);
			$query_delete->bindValue('id', $id);
			$query_delete->execute();

			$return = array(
				'code'		=> 200,
				'message'	=> 'OK'
			);

		} else {
			header("HTTP/1.0 400 Bad Request");
			$return = array(
				'code'		=> 400,
				'message'	=> 'Bad Request'
			);
		}

		echo json_encode($return);
	}
}