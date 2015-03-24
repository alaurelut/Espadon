<?php

class AlbumsHandler {
	function get($id){
		$db = db::instance();

		$sql = "SELECT `id`, `id_flickr`, `id_parent` FROM `spd_albums` WHERE `id_parent` = ".$id.";";

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