<?php

class CollectionHandler {
	function get($id){
		$db = db::instance();

		$sql = "SELECT `id_flickr`, `id_space` FROM `spd_collections` WHERE `id` = $id;";
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

		if( isset($_POST['id_flickr']) && $_POST['id_flickr'] !== '' &&
			isset($_POST['id_space']) && $_POST['id_space'] !== '' &&
			isset($_POST['color']) && $_POST['color']){

			$sql_count = "SELECT COUNT(`id`) as nb FROM `spd_collections` WHERE `id_space` = '".$_POST['id_space']."' AND `id_flickr` = '".$_POST['id_flickr']."';";
			$count = $db->dbh->query($sql_count);
			$count = $count->fetch(PDO::FETCH_ASSOC);

			if($count['nb'] == 0){

				$sql_insert = "INSERT INTO `spd_collections` (`id_flickr`, `id_space`, `color`, `created_at`)
								VALUES (:id_flickr, :id_space, :color, now());";

				$query_insert = $db->dbh->prepare($sql_insert);
				$query_insert->bindValue('id_flickr', $_POST['id_flickr'], PDO::PARAM_STR);
				$query_insert->bindValue('id_space', $_POST['id_space'], PDO::PARAM_STR);
				$query_insert->bindValue('color', ltrim($_POST['color'],'#'), PDO::PARAM_STR);

				$query_insert->execute();

				$sql_select = "SELECT `id`, `id_flickr`, `id_space`, `color` FROM `spd_collections` WHERE `id` = ".$db->dbh->lastInsertId().";";
				$stmt = $db->dbh->query($sql_select);
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
		$sql_count = "SELECT COUNT(`id`) as nb FROM `spd_collections` WHERE `id` = ".$id.";";
		$count = $db->dbh->query($sql_count);
		$count = $count->fetch(PDO::FETCH_ASSOC);

		if($count['nb'] != 0) {
			parse_str(file_get_contents("php://input"), $PUT);

			$sql_update = "UPDATE `spd_collections` SET";
			if(isset($PUT['id_flickr']) && $PUT['id_flickr'] != '')
				$sql_update .= " `id_flickr` = :id_flickr,";
			if(isset($PUT['id_space']) && $PUT['id_space'] != '')
				$sql_update .= " `id_space` = :id_space,";
			if(isset($PUT['color']) && $PUT['color'] != '')
				$sql_update .= " `color` = :color,";
			$sql_update .= " `updated_at` = now()";
			$sql_update .= " WHERE `id` = ".$id.";";

			$query_update = $db->dbh->prepare($sql_update);
			if(isset($PUT['id_flickr']) && $PUT['id_flickr'] != '')
				$query_update->bindValue('id_flickr', $PUT['id_flickr']);
			if(isset($PUT['id_space']) && $PUT['id_space'] != '')
				$query_update->bindValue('id_space', $PUT['id_space']);
			if(isset($PUT['color']) && $PUT['color'] != '')
				$query_update->bindValue('color', $PUT['color']);

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
		$sql_count = "SELECT COUNT(`id`) as nb FROM `spd_collections` WHERE `id` = ".$id.";";
		$count = $db->dbh->query($sql_count);
		$count = $count->fetch(PDO::FETCH_ASSOC);

		if($count['nb'] != 0) {
			$sql_albums = "DELETE FROM `spd_albums` WHERE `id_parent` = :id;";
			$query_albums = $db->dbh->prepare($sql_albums);
			$query_albums->bindValue('id', $id);
			$query_albums->execute();

			$sql_delete = "DELETE FROM `spd_collections` WHERE `id` = :id;";
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