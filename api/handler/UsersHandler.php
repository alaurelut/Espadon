<?php

class UsersHandler {
	function get(){
		$db = db::instance();

		$sql = "SELECT `id`, `id_flickr`, `username`, `email`, `active` FROM `spd_users`;";

		$stmt = $db->dbh->query($sql);
		$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

		$return = array(
			'code'		=> 200,
			'message'	=> 'OK',
			'data'		=> $data
		);

		echo json_encode($return);
	}
}