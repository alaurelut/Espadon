<?php

class SpaceHandler {
	function get($id){
		$db = db::instance();

		$sql = "SELECT `id_user`, `name`, `hash`, `color`, `description`, `created_at`, `updated_at` FROM `spd_spaces` WHERE `id` = $id;";
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

		if( isset($_POST['id_user']) && $_POST['id_user'] !== '' &&
			isset($_POST['name']) && $_POST['name'] !== '' &&
			isset($_POST['color']) && $_POST['color'] !== ''){

			if($this->check_valid_colorhex($_POST['color'])){
				$sql_count = "SELECT COUNT(`id`) as nb FROM `spd_spaces` WHERE `id_user` = '".$_POST['id_user']."' AND `name` = '".addslashes(stripslashes($_POST['name']))."';";
				$count = $db->dbh->query($sql_count);
				$count = $count->fetch(PDO::FETCH_ASSOC);

				if($count['nb'] == 0){

					$sql_select_user = "SELECT `username` FROM `spd_users` WHERE `id` = ".$_POST['id_user'].";";
					$stmt = $db->dbh->query($sql_select_user);
					$select_user = $stmt->fetch(PDO::FETCH_ASSOC);

					$sql_insert = "INSERT INTO `spd_spaces` (`id_user`, `name`, `hash`, `color`, `description`, `created_at`)
									VALUES (:id_user, :name, :hash, :color, :description, now());";

					$query_insert = $db->dbh->prepare($sql_insert);
					$query_insert->bindValue('id_user', $_POST['id_user'], PDO::PARAM_INT);
					$query_insert->bindValue('name', $_POST['name'], PDO::PARAM_STR);
					$query_insert->bindValue('hash', $select_user['username'].'/'.$this->toAscii(strtolower($_POST['name'])), PDO::PARAM_STR);
					$query_insert->bindValue('color', ltrim($_POST['color'],'#'), PDO::PARAM_STR);

					if(isset($_POST['description']) && $_POST['description'] != '')
						$query_insert->bindValue('description',	$_POST['description'],PDO::PARAM_STR);
					else
						$query_insert->bindValue('description',	'',PDO::PARAM_STR);

					$query_insert->execute();

					$sql_select_space = "SELECT `id`, `id_user`, `name`, `hash` FROM `spd_spaces` WHERE `id` = ".$db->dbh->lastInsertId().";";
					$stmt = $db->dbh->query($sql_select_space);
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
		$sql_count = "SELECT COUNT(`id`) as nb FROM `spd_spaces` WHERE `id` = ".$id.";";
		$count = $db->dbh->query($sql_count);
		$count = $count->fetch(PDO::FETCH_ASSOC);

		if($count['nb'] != 0) {
			parse_str(file_get_contents("php://input"), $PUT);

			$sql_update = "UPDATE `spd_spaces` SET";
			if(isset($PUT['name']) && $PUT['name'] != '')
				$sql_update .= " `name` = :name,";
			if(isset($PUT['color']) && $PUT['color'] != '')
				$sql_update .= " `color` = :color,";
			if(isset($PUT['description']))
				$sql_update .= " `description` = :description,";
			$sql_update .= " `updated_at` = now()";
			$sql_update .= " WHERE `id` = ".$id.";";

			$query_update = $db->dbh->prepare($sql_update);
			if(isset($PUT['name']) && $PUT['name'] != '')
				$query_update->bindValue('name', $PUT['name']);
			if(isset($PUT['color']) && $PUT['color'] != '')
				$query_update->bindValue('color', $PUT['color']);
			if(isset($PUT['description']) && $PUT['description'] != '')
				$query_update->bindValue('description', $PUT['description']);

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
		$sql_count = "SELECT COUNT(`id`) as nb FROM `spd_spaces` WHERE `id` = ".$id.";";
		$count = $db->dbh->query($sql_count);
		$count = $count->fetch(PDO::FETCH_ASSOC);

		if($count['nb'] != 0) {
			$db->dbh->beginTransaction();

			$sql_delete_space = "DELETE FROM `spd_spaces` WHERE `id` = :id;";
			$query_delete_space = $db->dbh->prepare($sql_delete_space);
			$query_delete_space->bindValue('id', $id);
			$query_delete_space->execute();

			$sql_delete_folders = "DELETE FROM `spd_folders` WHERE `id_space` = :id;";
			$query_delete_folders = $db->dbh->prepare($sql_delete_folders);
			$query_delete_folders->bindValue('id', $id);
			$query_delete_folders->execute();

			$sql_delete_partners = "DELETE FROM `spd_partners` WHERE `id_space` = :id;";
			$query_delete_partners = $db->dbh->prepare($sql_delete_partners);
			$query_delete_partners->bindValue('id', $id);
			$query_delete_partners->execute();

			$db->dbh->commit();

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

	function check_valid_colorhex($colorCode) {
		// If user accidentally passed along the # sign, strip it off
		$colorCode = ltrim($colorCode, '#');

		if (
			ctype_xdigit($colorCode) &&
			(strlen($colorCode) == 6 || strlen($colorCode) == 3))
			return true;

		else return false;
	}

	function toAscii($str, $replace=array(), $delimiter='-') {
		if( !empty($replace) ) {
			$str = str_replace((array)$replace, ' ', $str);
		}

		$clean = iconv('UTF-8', 'ASCII//TRANSLIT', $str);
		$clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $clean);
		$clean = strtolower(trim($clean, '-'));
		$clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);

		return $clean;
	}
}