<?php

class CollectionsHandler {
	function get($id){
		$db = db::instance();

		$sql = "SELECT `id`, `id_flickr`, `id_space` FROM `spd_collections` WHERE `id_space` = ".$id.";";

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