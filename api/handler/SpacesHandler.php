<?php

class SpacesHandler {
	function get($id = null){
		$db = db::instance();

		if($id === null)
			$sql = "SELECT `id`, `id_user`, `name`, `hash`, `color`, `description` FROM `spd_spaces`;";
		else
			$sql = "SELECT `id`, `id_user`, `name`, `hash`, `color`, `description` FROM `spd_spaces` WHERE `id_user` = ".$id.";";

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