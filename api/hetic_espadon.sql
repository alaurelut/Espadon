# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Hôte: localhost (MySQL 5.6.21)
# Base de données: hetic_espadon
# Temps de génération: 2015-03-01 09:26:09 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Affichage de la table spd_albums
# ------------------------------------------------------------

DROP TABLE IF EXISTS `spd_albums`;

CREATE TABLE `spd_albums` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_flickr` int(11) NOT NULL,
  `id_parent` int(11) NOT NULL,
  `color` varchar(6) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table spd_collections
# ------------------------------------------------------------

DROP TABLE IF EXISTS `spd_collections`;

CREATE TABLE `spd_collections` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id_flickr` int(11) DEFAULT NULL,
  `id_space` int(11) DEFAULT NULL,
  `color` varchar(6) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table spd_partners
# ------------------------------------------------------------

DROP TABLE IF EXISTS `spd_partners`;

CREATE TABLE `spd_partners` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id_space` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `function` varchar(100) DEFAULT NULL,
  `id_flickr` varchar(20) DEFAULT NULL,
  `updated_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table spd_spaces
# ------------------------------------------------------------

DROP TABLE IF EXISTS `spd_spaces`;

CREATE TABLE `spd_spaces` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id_user` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `hash` varchar(255) DEFAULT NULL,
  `color` varchar(6) DEFAULT NULL,
  `description` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Affichage de la table spd_users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `spd_users`;

CREATE TABLE `spd_users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id_flickr` varchar(20) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
