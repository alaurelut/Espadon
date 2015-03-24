<?php

class BetaHandler {
	function get(){
		$db = db::instance();

		$sql_user = "SELECT `id`, `url`, `email`, `created_at`, `updated_at` FROM `spd_beta`;";
		$stmt = $db->dbh->query($sql_user);
		$data = $stmt->fetch(PDO::FETCH_ASSOC);


		$return = array(
			'code'		=> 200,
			'message'	=> 'OK',
			'data'		=> $data
		);

		echo json_encode($return);
	}

	function post(){
		$db = db::instance();

		if(isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
			$_POST = array_merge($_POST, (array) json_decode(trim(file_get_contents('php://input')), true));
		}

		if( isset($_POST['url']) && $_POST['url'] !== '' &&
			isset($_POST['email']) && $_POST['email'] !== ''){

			$sql_count = "SELECT COUNT(`id`) as nb FROM `spd_beta` WHERE `email` = '".$_POST['email']."';";
			$count = $db->dbh->query($sql_count);
			$count = $count->fetch(PDO::FETCH_ASSOC);

			if($count['nb'] == 0){

				$sql_insert = "INSERT INTO `spd_beta` (`url`, `email`, `created_at`)
								VALUES (:url, :email, now());";

				$query_insert = $db->dbh->prepare($sql_insert);
				$query_insert->bindValue('url', $_POST['url'], PDO::PARAM_STR);
				$query_insert->bindValue('email', $_POST['email'], PDO::PARAM_STR);

				$query_insert->execute();

				$sql_select_beta = "SELECT `id`, `url`, `email` FROM `spd_beta` WHERE `id` = ".$db->dbh->lastInsertId().";";
				$stmt = $db->dbh->query($sql_select_beta);
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
}