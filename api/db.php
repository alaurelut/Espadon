<?php

class db {
	private static $instance;

	private $host 		= 'localhost';
	private $port 		= '3306';
	private $dbname 	= 'hetic_espadon';
	private $username 	= 'root';
	private $passwd 	= '';

	public $dbh;
	private $error;


	private function __construct(){
		$dsn = 'mysql:host='.$this->host.';port='.$this->port.';dbname='.$this->dbname;

		$options = array(
			PDO::ATTR_PERSISTENT    		=> true,
			PDO::ATTR_ERRMODE       		=> PDO::ERRMODE_EXCEPTION,
			PDO::MYSQL_ATTR_INIT_COMMAND	=> "SET NAMES utf8"
		);
		try{
			$this->dbh = new PDO($dsn, $this->username, $this->passwd, $options);
		}
		catch(PDOException $e){
			$this->error = $e->getMessage();

			header("HTTP/1.1 500 Internal Server Error");
			print("<b>Fatal error</b>: The web server did not finish its request<br/>");
			print("La connexion à la base de données à échouée. Si le problème persiste, contactez votre administrateur.");
			exit;
		}
	}
	public static function instance(){
		if(!self::$instance instanceof self){
			self::$instance = new self;
		}

		return self::$instance;
	}
}