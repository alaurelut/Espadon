<?php

class UserHandler {
	function get($id){
		$db = db::instance();

		$sql_user = "SELECT `id`, `username`, `email`, `active`, `created_at`, `updated_at` FROM `spd_users` WHERE `id_flickr` = '".$id."';";
		$stmt = $db->dbh->query($sql_user);
		$data = $stmt->fetch(PDO::FETCH_ASSOC);

		// var_dump($data);

		if($data != false){
			$sql_spaces = "SELECT `id`, `name`, `hash`, `color`, `description` FROM `spd_spaces` WHERE `id_user` = '".$id."';";
			$stmt = $db->dbh->query($sql_spaces);
			$data['spaces'] = $stmt->fetchAll(PDO::FETCH_ASSOC);


			$return = array(
				'code'		=> 200,
				'message'	=> 'OK',
				'data'		=> $data
			);
		} else {
			$return = array(
				'code'		=> 400,
				'message'	=> 'Bad Request'
			);
		}

		echo json_encode($return);
	}

	function post(){
		$db = db::instance();

		if(isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
		    $_POST = array_merge($_POST, (array) json_decode(trim(file_get_contents('php://input')), true));
		}

		if( isset($_POST['id_flickr']) && $_POST['id_flickr'] !== '' &&
			isset($_POST['username']) && $_POST['username'] !== '' &&
			isset($_POST['email']) && $_POST['email'] !== ''){

			$sql_count = "SELECT COUNT(`id`) as nb FROM `spd_users` WHERE `id_flickr` = '".$_POST['id_flickr']."';";
			$count = $db->dbh->query($sql_count);
			$count = $count->fetch(PDO::FETCH_ASSOC);

			if($count['nb'] == 0){

				$sql_insert = "INSERT INTO `spd_users` (`id_flickr`, `username`, `email`, `active`, `created_at`)
								VALUES (:id_flickr, :username, :email, 1, now());";

				$query_insert = $db->dbh->prepare($sql_insert);
				$query_insert->bindValue('id_flickr', $_POST['id_flickr'], PDO::PARAM_INT);
				$query_insert->bindValue('username', $_POST['username'], PDO::PARAM_STR);
				$query_insert->bindValue('email', $_POST['email'], PDO::PARAM_STR);

				$query_insert->execute();

				$sql_select_user = "SELECT `id`, `id_flickr`, `username`, `email`, `active` FROM `spd_users` WHERE `id` = ".$db->dbh->lastInsertId().";";
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
		$sql_count = "SELECT COUNT(`id`) as nb FROM `spd_users` WHERE `id_flickr` = '".$id."';";
		$count = $db->dbh->query($sql_count);
		$count = $count->fetch(PDO::FETCH_ASSOC);

		if($count['nb'] != 0) {
			parse_str(file_get_contents("php://input"), $PUT);

			$sql_update = "UPDATE `spd_users` SET";
			if(isset($PUT['email']) && $PUT['email'] != '')
				$sql_update .= " `email` = :email,";
			if(isset($PUT['active']) && $PUT['active'] != '')
				$sql_update .= " `active` = :active,";
			$sql_update .= " `updated_at` = now()";
			$sql_update .= " WHERE `id_flickr` = '".$id."'';";

			$query_update = $db->dbh->prepare($sql_update);
			if(isset($PUT['email']) && $PUT['email'] != '')
				$query_update->bindValue('email', $PUT['email']);
			if(isset($PUT['active']) && $PUT['active'] != '')
				$query_update->bindValue('active', $PUT['active']);

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
		$sql_count = "SELECT COUNT(`id`) as nb FROM `spd_users` WHERE `id_flickr` = '".$id."';";
		$count = $db->dbh->query($sql_count);
		$count = $count->fetch(PDO::FETCH_ASSOC);

		if($count['nb'] != 0) {
			$db->dbh->beginTransaction();

			$sql_id_user = "SELECT `id` FROM `spd_users` WHERE `id_flickr` = '".$id."';";
			$id_user = $db->dbh->query($sql_id_user);
			$id_user = $count->fetch(PDO::FETCH_ASSOC);

			$sql_select_spaces = "SELECT `id` FROM `spd_spaces` WHERE `id_user` = ".$id_user['id'].";";
			$query_select_spaces = $db->dbh->query($sql_select_spaces);
			$spaces_id = $query_select_spaces->fetch(PDO::FETCH_ASSOC);

			foreach($spaces_id as $space_id){
				$sql_delete_spaces = "DELETE FROM `spd_spaces` WHERE `id_user` = :id;";
				$query_delete_spaces = $db->dbh->prepare($sql_delete_spaces);
				$query_delete_spaces->bindValue('id', $space_id['id']);
				$query_delete_spaces->execute();

				$sql_delete_folders = "DELETE FROM `spd_folders` WHERE `id_space` = :id;";
				$query_delete_folders = $db->dbh->prepare($sql_delete_folders);
				$query_delete_folders->bindValue('id', $space_id['id']);
				$query_delete_folders->execute();

				$sql_delete_partners = "DELETE FROM `spd_partners` WHERE `id_space` = :id;";
				$query_delete_partners = $db->dbh->prepare($sql_delete_partners);
				$query_delete_partners->bindValue('id', $space_id['id']);
				$query_delete_partners->execute();
			}

			$sql_delete_user = "DELETE FROM `spd_users` WHERE `id_flickr` = :id;";
			$query_delete_user = $db->dbh->prepare($sql_delete_user);
			$query_delete_user->bindValue('id', $id);
			$query_delete_user->execute();

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
}