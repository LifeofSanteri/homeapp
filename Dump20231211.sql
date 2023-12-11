-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: localhost    Database: homeapp
-- ------------------------------------------------------
-- Server version	8.0.35-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `home`
--

DROP TABLE IF EXISTS `home`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `home` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(10) DEFAULT NULL,
  `tag` varchar(45) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tag_UNIQUE` (`tag`),
  KEY `fk_home_1_idx` (`user_id`),
  CONSTRAINT `fk_home_userid` FOREIGN KEY (`user_id`) REFERENCES `login` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `home`
--

LOCK TABLES `home` WRITE;
/*!40000 ALTER TABLE `home` DISABLE KEYS */;
INSERT INTO `home` VALUES (1,'Hima','1234',43),(26,'Juu koti','2664',44),(27,'Kotini','7729',45),(28,'Alen koti','1104',48),(29,'Alen koti2','9535',48),(32,'Kallenkoti','7681',50),(33,'Kallenkoti','7784',50),(34,'Jaminkoti','7553',51),(35,'Tippacasa','5719',52),(36,'Bottitalo','8786',53),(37,'koti32','2203',53),(38,'trapluola','8266',49);
/*!40000 ALTER TABLE `home` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(72) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES (1,'example','exa.mple@example.com','example123'),(43,'Santeri','santeri.savo1@gmail.com','$2b$10$Uh1TflzzexvB9iMlwfLHZORfUa/ThUrJAeq7fSIZuPm9BhMrQiNry'),(44,'Juuso','juso@gmai.com','$2b$10$v3Wc6e1n.4Eu.jGfz2Y.B.C/yjhv6hVAxZBdXtpVKYkn5SR3Mvbsi'),(45,'Aleksi','aleksi.k@gmail.com','$2b$10$J4Nf1kixUgfoswomc58r/euDu6H7CsGEuKhItjNgxvuIphrXTnXye'),(48,'Ale','ale@hotmail.com','$2b$10$g.2.Zuf1djpVLx2osuTFSeAasftZQkJjL2SUeKUDxarSmTKpBstZG'),(49,'Oscar','oscar@gmail.com','$2b$10$VV0fonO0WnM9Lr6a89b5Oe8jkbrQBSfhpFQCDyB45hclCAPIwyMtO'),(50,'Kalle','kalle@gmail.com','$2b$10$b1cQzO6N5dFSCrpU8wDPru96WHa835Zn4NLdA/734qmY6X26qdNOa'),(51,'Jami','jami@gmail.com','$2b$10$HMV/5khBe764ROjQyVUM6ugE384dPZZs8tPZ5eYGPI4YtWChiO.9i'),(52,'tippa','tippa@gmail.com','$2b$10$xj/DHVksvqjNxTqE37wbKu5vjXMAf5MmKpdS4c8PfnOQlb7hOuaBq'),(53,'botti','botti@gmail.com','$2b$10$MDLVOjyFdzu/9wsi/hqi8OSUmm29HljkwVSj2G6t6PnX5BqCMs4WW');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `home_id` int DEFAULT NULL,
  `note_text` varchar(40) DEFAULT NULL,
  `checked` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_notes_1_idx` (`home_id`),
  CONSTRAINT `fk_notes_1` FOREIGN KEY (`home_id`) REFERENCES `home` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES (24,1,'maito',1),(25,1,'ketsupop',0),(26,1,'rauta',1),(27,1,'kalja',0),(52,NULL,'dsasdadsa',1),(53,NULL,'dsadas',1);
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `todos`
--

DROP TABLE IF EXISTS `todos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `todos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `home_id` int DEFAULT NULL,
  `task` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_todos_1_idx` (`home_id`),
  CONSTRAINT `fk_todos_1` FOREIGN KEY (`home_id`) REFERENCES `home` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `todos`
--

LOCK TABLES `todos` WRITE;
/*!40000 ALTER TABLE `todos` DISABLE KEYS */;
INSERT INTO `todos` VALUES (27,NULL,NULL),(40,26,'moi'),(50,27,'mene töihin'),(55,32,'ḱaljaaaa'),(56,32,'sadasdsa'),(58,34,'tee läksyt'),(65,1,'tee koulutehtävii ja tällee gäng gäng'),(66,1,'siivoa'),(67,1,'mee kouluu'),(68,35,'pelaa runee'),(71,35,'mennä nukkuu'),(72,36,'mee töihi'),(73,36,'lataa '),(84,NULL,'moi'),(85,NULL,'sadasd');
/*!40000 ALTER TABLE `todos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'homeapp'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-11 12:12:43
