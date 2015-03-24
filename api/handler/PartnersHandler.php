<?php

class PartnersHandler {
	function get($id){
		$db = db::instance();

		$sql = "SELECT `id_space`, `name`, `username`,  `function`, `photo`, `url_flickr` FROM `spd_partners` WHERE `id_space` = ".$id.";";
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