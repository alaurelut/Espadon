<?php

require('handler/SpacesHandler.php');
require('handler/SpaceHandler.php');
require('handler/UsersHandler.php');
require('handler/UserHandler.php');
require('handler/PartnersHandler.php');
require('handler/PartnerHandler.php');
require('handler/CollectionsHandler.php');
require('handler/CollectionHandler.php');
require('handler/AlbumsHandler.php');
require('handler/AlbumHandler.php');
require('db.php');
require('Toro.php');

header('Content-Type: application/json');

ToroHook::add("404", function() {
    echo "Request not found";
});

Toro::serve(array(
	"1/spaces"					=> "SpacesHandler",			// GET
	"1/spaces/:number"			=> "SpacesHandler",			// GET [id_user]
	"1/space/:number"			=> "SpaceHandler",			// GET, POST, PUT, DELETE
	"1/space"					=> "SpaceHandler",			// POST
	"1/collections/:number" 	=> "CollectionsHandler",	// GET
	"1/collection/:number"		=> "CollectionHandler", 	// GET, PUT, DELETE
	"1/collection" 				=> "CollectionHandler", 	// POST
	"1/albums/:number" 			=> "AlbumsHandler",			// GET
	"1/album/:number"			=> "AlbumHandler", 			// GET, PUT, DELETE
	"1/album" 					=> "AlbumHandler", 			// POST
	"1/users"					=> "UsersHandler",			// GET
	"1/user"					=> "UserHandler",			// POST
	"1/user/([0-9@a-zA-Z]+)"	=> "UserHandler",			// GET, PUT, DELETE
	"1/partners/:number"		=> "PartnersHandler",		// GET
	"1/partner/:number" 		=> "PartnerHandler",		// GET, PUT, DELETE
	"1/partner" 				=> "PartnerHandler"	,		// POST
	"1/beta"					=> "BetaHandler"			// GET, POST
));
