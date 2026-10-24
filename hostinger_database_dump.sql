-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: annapoorna_canteen
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
INSERT INTO `cache` VALUES ('annapoorna-canteen-cache-admin@weddinguniverse.luxury|127.0.0.1','i:1;',1792871135),('annapoorna-canteen-cache-admin@weddinguniverse.luxury|127.0.0.1:timer','i:1792871135;',1792871135),('annapoorna-canteen-cache-password@123|127.0.0.1','i:1;',1792871199),('annapoorna-canteen-cache-password@123|127.0.0.1:timer','i:1792871199;',1792871199);
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `canteens`
--

DROP TABLE IF EXISTS `canteens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `canteens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `page_title` varchar(255) DEFAULT NULL,
  `slug` varchar(150) NOT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `favicon_url` varchar(1000) DEFAULT NULL,
  `primary_color` varchar(30) NOT NULL DEFAULT '#062D1F',
  `secondary_color` varchar(30) NOT NULL DEFAULT '#07402A',
  `accent_color` varchar(30) NOT NULL DEFAULT '#E8C928',
  `bg_color` varchar(30) NOT NULL DEFAULT '#F8F6F0',
  `theme_preset` varchar(50) NOT NULL DEFAULT 'emerald',
  `dietary_type` varchar(50) NOT NULL DEFAULT 'pure_veg',
  `pure_veg_label` varchar(100) NOT NULL DEFAULT '100% Pure Vegetarian',
  `address` text DEFAULT NULL,
  `location_landmark` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `whatsapp` varchar(50) DEFAULT NULL,
  `opening_hours` varchar(255) DEFAULT NULL,
  `hero_heading` varchar(255) DEFAULT NULL,
  `hero_subheading` text DEFAULT NULL,
  `announcement_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `announcement_text` text DEFAULT NULL,
  `discount_badge_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `discount_badge_title` varchar(100) NOT NULL DEFAULT 'Armed Forces 10% Off',
  `discount_badge_text` text DEFAULT NULL,
  `qr_target_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `hero_badge` varchar(100) DEFAULT 'Today''s Specials',
  `hero_trio` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`hero_trio`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `canteens_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canteens`
--

LOCK TABLES `canteens` WRITE;
/*!40000 ALTER TABLE `canteens` DISABLE KEYS */;
INSERT INTO `canteens` VALUES (1,'Annapoorna Canteen',NULL,'annapoorna-canteen','Good Food. Made Fresh. Served with Respect.','/logo.png',NULL,'#063D29','#075C35','#E8C928','#FAF8F1','emerald_heritage','pure_veg','100% Pure Vegetarian','Basement Parking, Gaur City Mall, Sector 4, Greater Noida West - 201009','Gaur City Mall, Basement Parking','+91 98765 43210','+91 98765 43210','08:00 AM - 10:30 PM (Everyday)','Artisan Delights & Hot Brews','Authentic North Indian savouries, hearty homestyle thalis, freshly toasted parathas, and refreshing shakes made daily with utmost purity and hygiene.',1,'Welcome to Annapoorna Canteen! Hot breakfast, fresh parathas, and homestyle lunch thalis served daily.',1,'Armed Forces 10% Off','10% Discount for Indian Armed Forces personnel & veterans with valid ID.','http://localhost:5173/menu',1,1,'2026-10-19 14:24:56','2026-10-24 13:15:33','Chef Specials','[{\"id\":\"left\",\"name\":\"Double Melt Burger\",\"price\":\"?95\",\"searchTerm\":\"burger\",\"stickerUrl\":\"\\/stickers\\/burger.jpg\"},{\"id\":\"center\",\"name\":\"Kulhad Masala Chai\",\"price\":\"?25\",\"searchTerm\":\"tea\",\"stickerUrl\":\"\\/stickers\\/tea.jpg\",\"showSteam\":true},{\"id\":\"right\",\"name\":\"Punjabi Samosa\",\"price\":\"?30\",\"searchTerm\":\"samosa\",\"stickerUrl\":\"\\/stickers\\/samosa.jpg\"}]'),(2,'Chai & Bytes Cafe','Chai & Bytes Cafe | Tech Park Artisan Brews','chai-bytes-cafe','Artisan Brews, Fresh Bites & Quick Tech Lunches.','https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80','https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&w=64','#09090B','#18181B','#D97706','#FAFAFA','midnight_luxe','veg_nonveg','Multi-Cuisine & Cafe','Ground Floor Tower B, Logix Cyber Park, Sector 62, Noida - 201301','Logix Cyber Park Tower B','+91 99887 76655','+91 99887 76655','07:30 AM – 11:00 PM (Mon-Sat)','Fueling Noida\'s Tech Workday with Great Chai & Quick Meals.','Specialty kulhad teas, gourmet sandwiches, loaded rice bowls, and artisan brewed coffees delivered to your office desk.',1,'Desk Delivery Active: Use WhatsApp to order directly to your office reception in Logix Park!',1,'Corporate IT 10% Off','10% Flat Discount for all Tech Park employees on showing company ID card.','http://localhost:5173/menu?canteen=chai-bytes-cafe',1,0,'2026-10-19 14:24:56','2026-10-24 14:45:33','Today\'s Specials','[{\"id\":\"left\",\"name\":\"Burger\",\"price\":\"\\u20b985\",\"searchTerm\":\"burger\",\"stickerUrl\":\"\\/stickers\\/burger.jpg\"},{\"id\":\"center\",\"name\":\"Hot Chai\",\"price\":\"\\u20b920\",\"searchTerm\":\"tea\",\"stickerUrl\":\"\\/stickers\\/tea.jpg\",\"showSteam\":true},{\"id\":\"right\",\"name\":\"Samosa\",\"price\":\"\\u20b925 \\/ pc\",\"searchTerm\":\"samosa\",\"stickerUrl\":\"\\/stickers\\/samosa.jpg\"}]'),(5,'Madan Sweets & Restaurant','Madan Sweets & Restaurant | Sweets, Restaurant & Bakery Since 1985','madan-sweets-restaurant','Log Anek Swad Ek - The traditional taste of India','https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=300&q=80','https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=64&q=80','#8B1E1E','#6B1414','#D97706','#FDFBF7','burgundy','pure_veg','100% Pure Vegetarian & Sweets','Sector-4, Central Plaza Market, Shahberi Road, Greater Noida West - 201009, G.B. Nagar','Central Plaza Market, Shahberi Road, Sector-4','+91 77718 68686','+91 77738 68686','08:00 AM – 11:00 PM (Everyday)','Log Anek Swad Ek — Authentic Desi Taste Since 1985','Legendary desi ghee sweets, fresh morning puri sabji, tandoori delicacies, live eggless bakery cakes, and homestyle North Indian thalis served with authentic heritage since 1985.',1,'Morning Happy Hour (8:30 AM - 11:45 AM): Special pricing on Puri Sabji, Choley Bhature, Dosas & Sandwiches! Free Home Delivery within 3km on orders above ₹400.',1,'Free Home Delivery','Free Home Delivery within 3 km radius on orders above ₹400. Enquiries: 7771868686 / 7773868686.','http://localhost:5173/menu?canteen=madan-sweets-restaurant',1,0,'2026-10-24 15:24:47','2026-10-24 15:24:47','Since 1985','[{\"name\":\"Desi Ghee Jalebi\",\"price\":\"\\u20b956 \\/ 100g\",\"tag\":\"Morning Special\"},{\"name\":\"Choley Bhature\",\"price\":\"\\u20b9149\",\"tag\":\"Bestseller\"},{\"name\":\"Special Royal Thali\",\"price\":\"\\u20b9355\",\"tag\":\"Royal Meal\"}]'),(6,'Hira Sweets','Hira Sweets | Traditional Taste Since 1912','hira-sweets','Tradition of Purity Since 1912 - Sweets, Restaurant & Bakery','https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=300&q=80','https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=64&q=80','#9E1B1B','#7A1313','#F59E0B','#FBF9F5','crimson_gold','pure_veg','100% Pure Vegetarian Since 1912','Plot No. C-03, Sector-4, Galaxy Blue Sapphire Plaza, Greater Noida West - 201009, U.P.','Galaxy Blue Sapphire Plaza, Sector-4, Gr. Noida (W)','+91 93118 80483','+91 84489 58485','08:00 AM – 11:00 PM (Everyday)','Ab Subah Ka Naashta Aur Bhi Sasta — Starting at ₹40','Famous Balushahi, steaming puris, iconic street chaat, South Indian platters, royal desi thalis, and eggless live bakery creations crafted with timeless purity since 1912.',1,'Breakfast Specials from 8:30 AM to 11:30 AM starting at ₹40! Free Home Delivery within 3 km on orders above ₹350. Order: 9311880483 / 8448958485.',1,'Free Home Delivery','Free Home Delivery within 3 km on minimum order of ₹350/-. Call: 9311880483.','http://localhost:5173/menu?canteen=hira-sweets',1,0,'2026-10-24 15:34:00','2026-10-24 15:34:00','Est. 1912','[{\"name\":\"Puri Sabji with Balushahi\",\"price\":\"\\u20b9115\",\"tag\":\"Signature Combo\"},{\"name\":\"Chole Bhature\",\"price\":\"\\u20b9165\",\"tag\":\"Bestseller\"},{\"name\":\"Deluxe Thali\",\"price\":\"\\u20b9375\",\"tag\":\"Royal Meal\"}]');
/*!40000 ALTER TABLE `canteens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `canteen_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`),
  KEY `categories_canteen_id_foreign` (`canteen_id`),
  CONSTRAINT `categories_canteen_id_foreign` FOREIGN KEY (`canteen_id`) REFERENCES `canteens` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,1,'Breakfast Specials','breakfast-specials','Crispy snacks, quick bites, hot noodles, and freshly prepared morning savouries.',1,1,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(2,1,'Breakfast & Parathas','breakfast-parathas','Stuffed tawa parathas served with creamy curd, spicy kachori sabji, and refreshing raita.',2,1,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(3,1,'Lunch & Thalis','lunch-thalis','Homestyle Indian meals, fragrant rice combinations, and complete wholesome thalis.',3,1,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(4,1,'Sandwiches','sandwiches','Toasted rolls, sweet treats, and hearty grilled vegetable sandwiches.',4,1,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(5,1,'Shakes & Beverages','shakes-beverages','Chilled milkshakes, thick Punjabi lassi, spiced sikanji, and freshly brewed hot tea.',5,1,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(6,2,'Specialty Brews & Teas','specialty-brews-chai-bytes','Aromatic artisan coffees and kulhad chai blends for tech professionals.',1,1,'2026-10-19 14:24:56','2026-10-19 14:24:56'),(7,2,'Gourmet Sandwiches & Bowls','gourmet-sandwiches-bowls-cb','Freshly grilled sourdough sandwiches and energizing lunch bowls.',2,1,'2026-10-19 14:24:56','2026-10-19 14:24:56'),(18,5,'Morning Specials & Breakfast (8:30 AM - 12:00 PM)','morning-specials-breakfast-madan','Hot morning breakfast featuring bedmi puris, crispy kachoris, and fluffy choley bhature with Morning Happy Hour deals.',1,1,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(19,5,'Traditional Sweets & Desserts','traditional-sweets-desserts-madan','Famous pure desi ghee Indian mithai, hot jalebi, rich halwas, and signature chenna sweets prepared daily.',2,1,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(20,5,'Chaat Bhandar & Snacks','chaat-bhandar-snacks-madan','Delhi-style street chaat, savory kachoris, hot samosas, and Gujarati dhokla preparations.',3,1,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(21,5,'Tandoori Starters & Snacks (11:00 AM - 10:30 PM)','tandoori-starters-snacks-madan','Smoky clay oven tandoori soya chaap varieties, marinated paneer tikkas, and sizzling platters.',4,1,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(22,5,'North Indian Curries & Royal Thalis','north-indian-curries-thalis-madan','Rich paneer curries, slow-simmered dal makhani, fragrant basmati rice, and wholesome royal thalis.',5,1,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(23,5,'South Indian Delicacies (11:00 AM - 10:30 PM)','south-indian-delicacies-madan','Crispy fermented rice-lentil dosas, fluffy steamed idlis, medu vadas, and authentic drumstick sambhar.',6,1,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(24,5,'Indo-Chinese & Steamed Momos','indo-chinese-momos-madan','Wok-tossed noodles, crunchy momos, honey chilli potato, and sizzled Manchurian favorites.',7,1,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(25,5,'Beverages, Shakes & Waffles','beverages-shakes-waffles-madan','Kulhad tea, premium ice cream milkshakes, refreshing mojitos, ice cream sodas, and Belgian waffles.',8,1,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(26,6,'Nukkad Ki Chaat & Morning Breakfast (8:30 AM - 11:30 AM)','nukkad-chaat-breakfast-hira','Famous Old Delhi style chaat, steaming puri sabji with balushahi, fluffy chole bhature, and morning breakfast combos.',1,1,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(27,6,'Snacks, Dhokla & Live Bakery','snacks-dhokla-bakery-hira','Fresh evening kachoris, Mumbai vada pao, Gujarati steamed dhokla, and warm bakery puffs.',2,1,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(28,6,'Traditional Sweets & Royal Mithai','traditional-sweets-mithai-hira','Centurylong legacy of pure desi ghee Balushahi, Rasmalai, hot Jalebis, and signature Rabri Faluda since 1912.',3,1,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(29,6,'Tandoori Starters & Kababs (From 12:00 Noon)','tandoori-starters-kababs-hira','Charcoal roasted soya chaap specialties, marinated paneer tikkas, and stuffed mushroom delicacies.',4,1,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(30,6,'North Indian Curries & Combos (From 12:00 Noon)','north-indian-curries-combos-hira','Iconic Hira Special Dal, creamy Dal Makhani, Shahi Paneer, and comforting Chole Chawal lunch bowls.',5,1,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(31,6,'South Indian Dosas, Idlis & Uttapams','south-indian-dosas-uttapams-hira','Crispy fermented dosas, Mysore masala specialties, fluffy steamed rice idlis, and loaded vegetable uttapams.',6,1,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(32,6,'Royal Thalis & Sizzling Platters (From 12:00 Noon)','royal-thalis-platters-hira','Grand thali meals, South Indian samplers, and sizzling tandoori feasts with accompaniments.',7,1,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(33,6,'Chinese, Continental & Pizza Pasta','chinese-continental-pizza-hira','Wok-tossed noodles, crispy chilli potato, Italian thin crust pizzas, and creamy pasta.',8,1,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(34,6,'Beverages, Shakes & Coolers','beverages-shakes-coolers-hira','Kulhad masala chai, rich Kesariya lassi, Badam Thandai, chilled fruit milkshakes, and heat buster mocktails.',9,1,'2026-10-24 15:34:00','2026-10-24 15:34:00');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `menu_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `canteen_id` bigint(20) unsigned DEFAULT NULL,
  `category_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price_type` enum('fixed','range','mrp') NOT NULL DEFAULT 'fixed',
  `price` decimal(8,2) NOT NULL DEFAULT 0.00,
  `price_max` decimal(8,2) DEFAULT NULL,
  `pricing_note` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `serving_info` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `menu_items_category_id_sort_order_index` (`category_id`,`sort_order`),
  KEY `menu_items_is_available_is_featured_index` (`is_available`,`is_featured`),
  KEY `menu_items_slug_index` (`slug`),
  KEY `menu_items_canteen_id_foreign` (`canteen_id`),
  CONSTRAINT `menu_items_canteen_id_foreign` FOREIGN KEY (`canteen_id`) REFERENCES `canteens` (`id`) ON DELETE SET NULL,
  CONSTRAINT `menu_items_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=212 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES (1,1,1,'Samosa','samosa','Crispy golden pastry stuffed with spiced potatoes and peas, served with sweet tamarind and fresh mint chutneys.','fixed',15.00,NULL,NULL,'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80','1 Pc with Chutneys',1,1,1,'2026-10-19 12:05:17','2026-10-24 13:58:47'),(2,1,1,'Bread Pakoda','bread-pakoda','Spiced potato stuffed fresh bread slices dipped in seasoned gram flour batter and fried to golden perfection.','fixed',30.00,NULL,NULL,'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80','1 Large Triangle',1,0,2,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(3,1,1,'Aloo Patties','aloo-patties','Flaky multi-layered puff pastry pocket generously filled with hot spiced aloo masala.','fixed',22.00,NULL,NULL,'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80','1 Pc Freshly Baked',1,0,3,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(4,1,1,'Paneer Patties','paneer-patties','Crispy layered puff pastry loaded with fresh spiced paneer cottage cheese filling.','fixed',30.00,NULL,NULL,'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80','1 Pc Freshly Baked',1,0,4,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(5,1,1,'Plain Maggie','plain-maggie','Classic hot & comforting 2-minute noodles seasoned with signature aromatic tastemaker masala.','fixed',35.00,NULL,NULL,'https://images.unsplash.com/photo-1585410304004-56ae05651552?auto=format&fit=crop&w=600&q=80','1 Bowl Hot',1,0,5,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(6,1,1,'Veg Maggie','veg-maggie','Comfort noodles tossed with chopped onions, tomatoes, crunchy green peas, and special canteen spices.','fixed',55.00,NULL,NULL,'https://images.unsplash.com/photo-1585410304004-56ae05651552?auto=format&fit=crop&w=600&q=80','1 Bowl Loaded',1,1,6,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(7,1,1,'Poha Special','poha-special','Traditional steamed flattened rice tempered with mustard seeds, curry leaves, roasted peanuts, and crispy sev.','range',40.00,70.00,'Regular ₹40 / Loaded with Dry Fruits & Sev ₹70 (Confirmation flagged)','https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','1 Plate with Lemon',1,0,7,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(8,1,2,'Kachori Sabji','kachori-sabji','Crispy flaky dal kachoris served with piping hot spiced potato curry, coriander, and green chillies.','fixed',40.00,NULL,NULL,'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80','2 Pcs with Unlimited Aloo Sabji',1,1,1,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(9,1,2,'Aloo Paratha Plain','aloo-paratha-plain','Freshly tawa roasted whole wheat flatbread generously stuffed with seasoned mashed potatoes.','fixed',40.00,NULL,NULL,'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80','1 Large Paratha with Pickle & Butter',1,0,2,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(10,1,2,'Aloo Pyaz Paratha','aloo-pyaz-paratha','Crispy golden paratha stuffed with crushed spiced potatoes and crunchy chopped onions.','fixed',50.00,NULL,NULL,'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80','1 Large Paratha with Pickle & Butter',1,0,3,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(11,1,2,'Paneer Paratha','paneer-paratha','Wholesome wheat paratha stuffed with rich crumbled cottage cheese, fresh herbs, and mild spices.','fixed',60.00,NULL,NULL,'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80','1 Large Paratha with Butter',1,1,4,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(12,1,2,'Dahi','dahi','Fresh sealed branded dahi cup. Chilled, thick and refreshing.','mrp',0.00,NULL,'Packaged Dahi - Sold on MRP (e.g. ₹20-₹35 based on brand & size)','https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80','1 Sealed Cup (MRP)',1,0,5,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(13,1,2,'Raita','raita','Creamy whipped yogurt blended with crispy chickpea boondi, roasted cumin, and black salt.','fixed',15.00,NULL,NULL,'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80','1 Bowl Chilled',1,0,6,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(14,1,2,'Tea / Coffee','tea-coffee','Authentic ginger-cardamom Desi Kadak Chai or steaming freshly brewed hot coffee.','range',15.00,25.00,'Masala Chai ₹15 / Hot Coffee ₹25','https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80','1 Hot Cup',1,0,7,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(15,1,3,'Rajma Rice','rajma-rice','Authentic Kashmiri red kidney beans simmered in slow-cooked onion-tomato gravy over fragrant basmati rice.','fixed',50.00,NULL,NULL,'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80','Generous Rice Bowl with Onions & Pickle',1,1,1,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(16,1,3,'Chole Rice','chole-rice','Spicy Amritsari chickpeas cooked with hand-ground spices served piping hot with steamed basmati rice.','fixed',50.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Generous Rice Bowl with Onions & Pickle',1,0,2,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(17,1,3,'Dal Rice','dal-rice','Comforting yellow lentils tempered with desi ghee, cumin, garlic, and red chilies over fluffy steamed rice.','fixed',50.00,NULL,NULL,'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80','Generous Rice Bowl with Pickle',1,0,3,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(18,1,3,'Kadhi Pakoda','kadhi-pakoda','Tangy slow-simmered besan yogurt kadhi with soft crispy onion pakodas, served with basmati rice.','fixed',60.00,NULL,NULL,'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80','Generous Kadhi & Rice Combo Bowl',1,0,4,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(19,1,3,'Thali','thali','Wholesome everyday Indian meal: Dal Tadka, Seasonal Green Sabji, 4 Hot Tawa Rotis or Steamed Rice, Salad, and Pickle.','fixed',90.00,NULL,NULL,'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80','Complete Balanced Meal',1,1,5,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(20,1,3,'Deluxe Thali','deluxe-thali','Grand Canteen feast: Rich Shahi Paneer, Dal Makhani, 4 Butter Tawa Rotis, Fragrant Pulao, Boondi Raita, Salad & Sweet.','fixed',120.00,NULL,NULL,'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80','Deluxe Royal Thali with Dessert',1,1,6,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(21,1,4,'Cream Roll','cream-roll','Crisp flaky horn-shaped pastry filled with light vanilla whipped cream.','fixed',30.00,NULL,NULL,'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80','1 Pc Roll',1,0,1,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(22,1,4,'Cream Sandwich','cream-sandwich','Soft white bread slices stuffed with fresh sweet cream and fruit essence.','fixed',40.00,NULL,NULL,'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80','2 Cut Triangles',1,0,2,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(23,1,4,'Chocolate Sandwich','chocolate-sandwich','Warm toasted bread oozing with molten dark chocolate spread and cocoa crunch.','fixed',50.00,NULL,NULL,'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80','2 Grilled Slices',1,0,3,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(24,1,4,'Veg Grill Sandwich','veg-grill-sandwich','Crispy jumbo grilled sandwich packed with crunchy cucumber, tomato, capsicum, house herbs, and spiced cheese.','fixed',80.00,NULL,NULL,'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80','Jumbo 4 Triangles with Dips',1,1,4,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(25,1,5,'Banana Shake','banana-shake','Fresh bananas blended thick with chilled creamy milk, dash of honey, and sliced dry nuts.','range',40.00,50.00,'Regular ₹40 / With Vanilla Ice Cream Scoop ₹50','https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=600&q=80','350ml Tall Glass',1,0,1,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(26,1,5,'Mango Shake','mango-shake','Luscious mango pulp whipped with rich chilled milk and topped with tutty-fruity.','range',40.00,50.00,'Regular ₹40 / With Vanilla Ice Cream Scoop ₹50','https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80','350ml Tall Glass',1,1,2,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(27,1,5,'Sikanji','sikanji','Refreshing traditional Indian lemonade with freshly squeezed lemon, mint, roasted cumin, and black rock salt.','fixed',20.00,NULL,NULL,'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80','1 Chilled Glass (300ml)',1,0,3,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(28,1,5,'Lassi','lassi','Thick creamy Punjabi sweet lassi churned from fresh curd, infused with rosewater and cardamom, topped with malai.','fixed',50.00,NULL,NULL,'https://images.unsplash.com/photo-1571006682871-33e387198bb6?auto=format&fit=crop&w=600&q=80','Traditional Chilled Glass',1,1,4,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(29,1,5,'Cold Coffee','cold-coffee','Rich blended espresso coffee with creamy chilled milk, ice cream froth, and chocolate drizzle.','fixed',50.00,NULL,NULL,'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80','350ml Frosty Glass',1,1,5,'2026-10-19 12:05:17','2026-10-19 14:24:56'),(30,2,6,'Masala Adrak Kulhad Chai','masala-adrak-kulhad-chai-cb','Fresh crushed ginger, green cardamom, and Assam CTC boiled in fresh whole milk.','fixed',25.00,NULL,NULL,'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80','1 Kulhad Cup',0,1,1,'2026-10-19 14:24:56','2026-10-24 14:58:45'),(31,2,6,'Cold Brew Latte','cold-brew-latte-cb','16-hour slow steeped Arabica coffee poured over chilled vanilla milk.','fixed',85.00,NULL,NULL,'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80','350ml Glass',0,1,2,'2026-10-19 14:24:56','2026-10-24 14:58:48'),(32,2,7,'Peri Peri Paneer Panini','peri-peri-paneer-panini-cb','Spiced cottage cheese steaks with grilled bell peppers and chipotle mayo in herbed focaccia.','fixed',120.00,NULL,NULL,'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80','2 Jumbo Halves with Crisps',0,1,1,'2026-10-19 14:24:56','2026-10-24 14:58:46'),(91,5,18,'Puri Sabji (4 Pcs)','puri-sabji-4-pcs-madan','Crispy golden fried bedmi puris served with piping hot spiced potato curry and pickle. (Happy Hour: ₹58)','fixed',78.00,NULL,NULL,'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80','4 Pcs with Aloo Sabji',1,1,1,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(92,5,18,'Puri Sabji with Raita','puri-sabji-with-raita-madan','Four freshly puffed puris accompanied by seasoned aloo sabji and cooling boondi raita. (Happy Hour: ₹80)','fixed',94.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','4 Pcs with Raita & Sabji',1,0,2,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(93,5,18,'Sabji Kachori (2 Pcs)','sabji-kachori-2-pcs-madan','Crisp flaky dal kachoris crushed and topped with tangy hing-scented potato gravy.','fixed',56.00,NULL,NULL,'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80','2 Pcs with Spicy Aloo Jhol',1,0,3,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(94,5,18,'Choley Bhature (Full Plate)','choley-bhature-full-plate-madan','Two signature paneer-stuffed jumbo bhature served with slow-cooked pindi choley, pickled onions, and mint dip. (Happy Hour: ₹135)','fixed',149.00,NULL,NULL,'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80','2 Large Bhature + Choley',1,1,4,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(95,5,18,'Choley Bhature (Half Plate)','choley-bhature-half-plate-madan','Single jumbo bhatura served with authentic spiced chole and pickled chilies.','fixed',105.00,NULL,NULL,'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80','1 Bhatura + Choley',1,0,5,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(96,5,18,'Pav Bhaji','pav-bhaji-madan','Mashed spiced seasonal vegetables simmered with Amul butter, served with two toasted soft pavs and lemon onion garnish. (Happy Hour: ₹140)','fixed',155.00,NULL,NULL,'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80','2 Butter Pavs + Spiced Bhaji',1,1,6,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(97,5,18,'Grilled Sandwich','grilled-sandwich-madan','Freshly buttered bread stuffed with spiced bell peppers, cucumbers, tomatoes and grilled crisp. (Happy Hour: ₹120)','fixed',135.00,NULL,NULL,'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80','2 Jumbo Halves with Wafers',1,0,7,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(98,5,19,'Desi Ghee Jalebi (100g)','desi-ghee-jalebi-100g-madan','Freshly spiraled crispy jalebis fried in pure desi ghee and immersed in saffron sugar syrup. (Available 8-10:30am & 4-8pm)','fixed',56.00,NULL,NULL,'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80','100g Hot Crisp Jalebi',1,1,1,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(99,5,19,'Gulab Jamun Desi Ghee (2 Pcs)','gulab-jamun-desi-ghee-2-pcs-madan','Soft melt-in-the-mouth khoya dumplings fried in pure desi ghee and soaked in warm rose-cardamom syrup.','fixed',60.00,NULL,NULL,'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80','2 Warm Pcs',1,1,2,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(100,5,19,'Rasmalai (2 Pcs)','rasmalai-2-pcs-madan','Delicate soft cottage cheese discs steeped in thickened saffron, pistachio, and cardamom infused milk.','fixed',90.00,NULL,NULL,'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80','2 Chilled Pcs in Kesar Milk',1,1,3,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(101,5,19,'Rabdi Rasmalai (2 Pcs)','rabdi-rasmalai-2-pcs-madan','Luxurious rasmalai layered with thick malai rabdi and toasted almond slivers.','fixed',120.00,NULL,NULL,'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80','2 Pcs with Rich Malai Rabdi',1,0,4,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(102,5,19,'Rasgulla (2 Pcs)','rasgulla-2-pcs-madan','Classic spongy Kolkata-style chenna dumplings soaked in light aromatic sugar nectar.','fixed',40.00,NULL,NULL,'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80','2 Spongy Chenna Pcs',1,0,5,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(103,5,19,'Raj Bhog (2 Pcs)','raj-bhog-2-pcs-madan','Large saffron-infused chenna balls stuffed with dry fruits and hint of cardamom.','fixed',72.00,NULL,NULL,'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80','2 Royal Stuffed Pcs',1,0,6,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(104,5,19,'Gajar Ka Halwa (100g)','gajar-ka-halwa-100g-madan','Seasonal red carrots slow cooked with whole milk mawa, pure desi ghee, cashews, and raisins.','fixed',64.00,NULL,NULL,'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80','100g Desi Ghee Halwa',1,0,7,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(105,5,19,'Moong Dal Halwa (100g)','moong-dal-halwa-100g-madan','Rich Rajasthani delicacy of roasted yellow lentils simmered in desi ghee with almond flakes.','fixed',64.00,NULL,NULL,'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80','100g Rich Halwa',1,0,8,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(106,5,19,'Kulhar Wala Kesar Doodh','kulhar-wala-kesar-doodh-madan','Thick boiling milk reduced with saffron, pistachios, and almonds served hot in earthen kulhad.','fixed',80.00,NULL,NULL,'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80','1 Hot Kulhad Milk',1,1,9,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(107,5,20,'Raj Kachori','raj-kachori-madan','Crisp king-size kachori filled with spiced potatoes, sprouts, sweetened curd, tamarind saunth, and mint chutney.','fixed',135.00,NULL,NULL,'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80','1 King Size Stuffed Kachori',1,1,1,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(108,5,20,'Dahi Bhalle','dahi-bhalle-madan','Soft melt-in-mouth lentil dumplings immersed in velvety chilled curd, roasted cumin, and sweet dates chutney.','fixed',120.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','1 Plate Chilled Curd Dumplings',1,1,2,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(109,5,20,'Bhalla Papdi Chaat','bhalla-papdi-chaat-madan','Combination of soft bhalla and crisp flour papdis drizzled with sweet yogurt and spicy tangy chutneys.','fixed',120.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','1 Full Plate Mix Chaat',1,0,3,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(110,5,20,'Aloo Tikki (Per Plate)','aloo-tikki-per-plate-madan','Pan-fried golden crispy potato patties shallow-fried in desi ghee, served with curd and house chutneys.','fixed',105.00,NULL,NULL,'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80','2 Desi Ghee Crisp Tikkis',1,1,4,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(111,5,20,'Pani Puri (6 Pcs)','pani-puri-6-pcs-madan','Crispy suji puris served with spiced potato and chickpea filling with chilled mint-coriander and sweet tamarind waters.','fixed',60.00,NULL,NULL,'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80','6 Puris with Tangy Water',1,0,5,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(112,5,20,'Samosa (Per Pc)','samosa-per-pc-madan','Iconic pyramid pastry packed with spiced potatoes, green peas, and cashews.','fixed',18.00,NULL,NULL,'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80','1 Pc with Chutneys',1,0,6,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(113,5,20,'Khasta Kachori (Per Pc)','khasta-kachori-per-pc-madan','Flaky crisp round kachori filled with seasoned urad dal and aromatic spices.','fixed',18.00,NULL,NULL,'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80','1 Pc with Chutneys',1,0,7,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(114,5,20,'Paneer Pakora (Per Pc)','paneer-pakora-per-pc-madan','Thick slab of fresh malai paneer sandwiching green chutney, dipped in spiced gram flour batter and fried golden.','fixed',33.00,NULL,NULL,'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80','1 Large Paneer Pakora',1,0,8,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(115,5,20,'Bread Pakoda (Per Pc)','bread-pakoda-per-pc-madan','Triangular bread stuffed with potato masala and fried with gram flour crust.','fixed',28.00,NULL,NULL,'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80','1 Large Triangle',1,0,9,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(116,5,20,'Sandwich Dhokla (Per Kg)','sandwich-dhokla-per-kg-madan','Steamed spongy savory gram flour cake layered with coriander chutney and mustard tempering.','fixed',320.00,NULL,NULL,'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80','1 Kg Box Gujarati Style',1,0,10,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(117,5,21,'Malai Chaap','malai-chaap-madan','Succulent soya chaap chunks marinated in rich cream, cashew paste, mild cheese, and grilled over charcoal.','fixed',280.00,NULL,NULL,'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80','Creamy Roasted Chaap Plate',1,1,1,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(118,5,21,'Achari Chaap','achari-chaap-madan','Soya chaap tossed in zesty pickling spices and mustard oil, charred to smoky perfection.','fixed',280.00,NULL,NULL,'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80','Tangy Spiced Chaap',1,0,2,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(119,5,21,'Afgani Chaap','afgani-chaap-madan','Mildly spiced soya chaap steeped in yogurt, white pepper, and roasted garlic emulsion.','fixed',290.00,NULL,NULL,'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80','Rich Cashew Cream Chaap',1,0,3,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(120,5,21,'Paneer Tikka','paneer-tikka-madan','Cubed fresh cottage cheese, diced onions, and crunchy capsicum marinated in spiced hung curd and ajwain.','fixed',280.00,NULL,NULL,'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80','6 Charred Cottage Cheese Cubes',1,1,4,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(121,5,21,'Mushroom Tikka','mushroom-tikka-madan','Button mushrooms stuffed with spiced cottage cheese and roasted in clay tandoor.','fixed',310.00,NULL,NULL,'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80','Stuffed Button Mushrooms',1,0,5,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(122,5,21,'Veg Seekh Kabab','veg-seekh-kabab-madan','Finely minced garden vegetables and herbs molded onto skewers and char-grilled.','fixed',245.00,NULL,NULL,'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80','4 Skewered Vegetable Kababs',1,0,6,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(123,5,21,'Tandoori Sizzling Platter','tandoori-sizzling-platter-madan','Grand combination of Malai Chaap, Paneer Tikka, Veg Seekh Kabab, and Stuffed Mushroom served with butter naan.','fixed',349.00,NULL,NULL,'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80','Assorted Tandoori Mix',1,1,7,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(124,5,22,'Shahi Paneer','shahi-paneer-madan','Fresh cottage cheese simmered in a royal velvety cashew nut and tomato gravy scented with shahi jeera.','fixed',290.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Rich Royal Gravy Bowl',1,1,1,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(125,5,22,'Kadahi Paneer','kadahi-paneer-madan','Paneer tossed in an iron wok with fresh ground coriander seeds, dry red chilies, bell peppers, and diced onions.','fixed',290.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Wok Tossed Spiced Paneer',1,0,2,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(126,5,22,'Dal Makhani','dal-makhani-madan','Signature whole black lentils and kidney beans slow-cooked overnight with white butter and rich cream.','fixed',275.00,NULL,NULL,'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80','Slow Simmered Creamy Dal',1,1,3,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(127,5,22,'Dal Tadka','dal-tadka-madan','Yellow arhar lentils tempered with desi ghee, cumin seeds, garlic, and Kashmiri whole red chilies.','fixed',250.00,NULL,NULL,'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80','Desi Ghee Tempered Dal',1,0,4,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(128,5,22,'Malai Kofta','malai-kofta-madan','Crispy paneer and dry-fruit stuffed dumplings bathed in a delicate mild golden cashew gravy.','fixed',285.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Velvet Creamy Kofta',1,0,5,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(129,5,22,'Choley Masala','choley-masala-madan','Authentic Punjabi chickpeas cooked in a dark tea-leaf infusion with pomegranate seeds and garam masala.','fixed',210.00,NULL,NULL,'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80','Traditional Pindi Chana',1,0,6,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(130,5,22,'Special Royal Thali','special-royal-thali-madan','Complete feast: Shahi Paneer, Dal Makhani, Seasonal Mix Veg, Raita, Jeera Rice, 1 Butter Naan, 1 Lachha Paratha, Desi Ghee Sweet & Salad.','fixed',355.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Grand 9-Item Royal Platter',1,1,7,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(131,5,22,'Deluxe Thali','deluxe-thali-madan','Shahi Paneer, Dal Makhani, Steamed Basmati Rice, Boondi Raita, 2 Tandoori Breads, Sweet & Salad.','fixed',305.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Wholesome Deluxe Thali',1,0,8,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(132,5,22,'Normal Homestyle Thali','normal-homestyle-thali-madan','Dal Makhani, Seasonal Dry Vegetable, Rice, Boondi Raita, 2 Lachha Parathas & Pickle.','fixed',285.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Daily Homestyle Meal',1,0,9,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(133,5,23,'Masala Dosa','masala-dosa-madan','Paper-thin golden crepe filled with mustard-tempered potato masala, served with piping hot sambhar and dual chutneys. (Happy Hour: ₹185)','fixed',195.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Crisp Dosa with Sambhar & Chutneys',1,1,1,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(134,5,23,'Plain Dosa','plain-dosa-madan','Classic crisp fermented crepe made on tawa, served with coconut chutney and fresh sambhar. (Happy Hour: ₹145)','fixed',160.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Crisp Plain Crepe',1,0,2,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(135,5,23,'Onion Masala Dosa','onion-masala-dosa-madan','Crispy dosa loaded with roasted onions, fresh green chilies, and potato masala filling.','fixed',205.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Caramelized Onion Dosa',1,0,3,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(136,5,23,'Paneer Dosa','paneer-dosa-madan','Crispy crepe stuffed with generous seasoned malai paneer shredding and coriander.','fixed',220.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Paneer Stuffed Dosa',1,1,4,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(137,5,23,'Idli Sambhar (2 Pcs)','idli-sambhar-2-pcs-madan','Steamed fluffy rice cakes served immersed in spicy tamarind and drumstick sambhar with coconut chutney. (Happy Hour: ₹115)','fixed',130.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','2 Steamed Idlis with Sambhar',1,0,5,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(138,5,23,'Vada Sambhar (2 Pcs)','vada-sambhar-2-pcs-madan','Crispy golden fried lentil donuts with a soft fluffy interior, accompanied by hot sambhar. (Happy Hour: ₹115)','fixed',130.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','2 Crispy Medu Vadas',1,0,6,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(139,5,23,'South Indian Platter','south-indian-platter-madan','Grand sampler containing 1 Mini Masala Dosa, 1 Mini Veg Uttapam, 1 Steamed Idli, and 1 Medu Vada.','fixed',299.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','4-in-1 South Indian Platter',1,1,7,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(140,5,24,'Veg Hakka Noodles','veg-hakka-noodles-madan','Chinese-style wok-tossed noodles with shredded cabbage, carrots, bell peppers, and scallions.','fixed',149.00,NULL,NULL,'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80','1 Bowl Wok Noodles',1,1,1,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(141,5,24,'Chilli Paneer (Dry / Gravy)','chilli-paneer-dry-gravy-madan','Crispy fried cottage cheese cubes tossed in spicy soy chili sauce with crunchy onions and capsicum.','fixed',260.00,NULL,NULL,'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80','Paneer in Chili Glaze',1,1,2,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(142,5,24,'Honey Chilli Potato','honey-chilli-potato-madan','Crispy potato batons coated with sweet honey, spicy chili garlic paste, and toasted sesame seeds.','fixed',205.00,NULL,NULL,'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80','Crispy Sesame Potatoes',1,0,3,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(143,5,24,'Veg Manchurian Gravy','veg-manchurian-gravy-madan','Minced vegetable dumplings simmered in an aromatic dark garlic and scallion broth.','fixed',245.00,NULL,NULL,'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80','Vegetable Balls in Sauce',1,0,4,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(144,5,24,'Steamed Veg Momos (6 Pcs)','steamed-veg-momos-6-pcs-madan','Thin pastry pockets stuffed with cabbage, carrots, and onions, served with blazing spicy red garlic chutney.','fixed',90.00,NULL,NULL,'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80','6 Steamed Dumplings',1,0,5,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(145,5,24,'Kurkure Paneer Momos (6 Pcs)','kurkure-paneer-momos-6-pcs-madan','Seasoned paneer dumplings coated in crunchy cornflake crust and fried golden.','fixed',115.00,NULL,NULL,'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80','6 Crunchy Fried Momos',1,1,6,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(146,5,25,'Hot Masala Tea','hot-masala-tea-madan','Traditional tea boiled with fresh crushed ginger, green cardamom, and cloves served in earthen cup.','fixed',42.00,NULL,NULL,'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80','1 Kulhad Cup',1,1,1,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(147,5,25,'Madan Special Dryfruit Shake','madan-special-dryfruit-shake-madan','Signature rich thick shake blended with almonds, pistachios, saffron, and cream.','fixed',165.00,NULL,NULL,'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80','350ml Signature Glass',1,1,2,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(148,5,25,'Chocolate Cold Coffee with Ice Cream','chocolate-cold-coffee-with-ice-cream-madan','Creamy blended coffee infused with dark chocolate syrup and topped with rich vanilla ice cream.','fixed',155.00,NULL,NULL,'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80','Tall Chilled Glass',1,1,3,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(149,5,25,'Mint Mojito','mint-mojito-madan','Crisp chilled cooler with crushed mint leaves, fresh lime wedges, simple syrup, and fizz.','fixed',110.00,NULL,NULL,'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80','Refreshing Chilled Cooler',1,0,4,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(150,5,25,'Rabri Kulfi Faluda','rabri-kulfi-faluda-madan','Traditional matka kulfi cut and topped with rich chilled malai rabri, cornstarch sev faluda, and rose syrup.','fixed',90.00,NULL,NULL,'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80','Royal Sundae Cup',1,1,5,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(151,5,25,'Nutella Fudge Waffle','nutella-fudge-waffle-madan','Crisp warm Belgian waffle slathered with genuine Nutella spread and rich chocolate fudge.','fixed',185.00,NULL,NULL,'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80','Full Warm Waffle Plate',1,0,6,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(152,6,26,'Puri Sabji with Balushahi','puri-sabji-with-balushahi-hira','Hira signature breakfast: 4 crisp bedmi puris served with spicy aloo jhol sabji and one pure ghee balushahi.','fixed',115.00,NULL,NULL,'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80','4 Puris + Sabji + 1 Balushahi',1,1,1,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(153,6,26,'Puri Sabji Plate','puri-sabji-plate-hira','Freshly fried hot puris accompanied by traditional seasoned potato curry and mixed pickle. (Morning rate: ₹55)','fixed',82.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','4 Pcs with Aloo Sabji',1,0,2,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(154,6,26,'Chole Bhature','chole-bhature-hira','Two large puffed golden bhature served with slow-simmered Punjabi chole, pickled onions, and green chilies.','fixed',165.00,NULL,NULL,'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80','2 Bhature + Pindi Chole',1,1,3,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(155,6,26,'Pao Bhaji','pao-bhaji-hira','Rich buttery mashed mixed vegetable bhaji served with two butter toasted pavs and chopped red onions.','fixed',165.00,NULL,NULL,'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80','2 Butter Pavs + Spiced Bhaji',1,1,4,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(156,6,26,'Matar Kulcha','matar-kulcha-hira','Tangy boiled dried white peas tempered with ginger, green chilies, and lemon, served with two soft kulchas.','fixed',155.00,NULL,NULL,'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80','2 Soft Kulchas + Matar',1,0,5,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(157,6,26,'Raj Kachori','raj-kachori-hira','Large crispy hollow sphere filled with potatoes, sprouts, sweetened curd, saunth, mint chutney, and sev.','fixed',150.00,NULL,NULL,'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80','1 Grand Stuffed Raj Kachori',1,1,6,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(158,6,26,'Dahi Bhalla','dahi-bhalla-hira','Velvety lentil dumplings immersed in thick sweetened yogurt topped with roasted cumin and tangy pomegranate saunth.','fixed',150.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','2 Dumplings in Chilled Curd',1,0,7,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(159,6,26,'Aloo Ki Tikki with Dahi Chole','aloo-ki-tikki-with-dahi-chole-hira','Desi ghee shallow-fried crisp potato patties smothered with hot chole gravy, sweet curd, and dual chutneys.','fixed',135.00,NULL,NULL,'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80','2 Tikkis with Chole & Curd',1,1,8,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(160,6,26,'Gol Gappe (6 Pcs)','gol-gappe-6-pcs-hira','Crispy suji puris filled with spicy potatoes and served with mint-hing teekha pani and sweet meetha pani.','fixed',65.00,NULL,NULL,'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80','6 Puris with Two Waters',1,0,9,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(161,6,27,'Vada Pao','vada-pao-hira','Mumbai street specialty batata vada tucked inside soft pav with spicy dry garlic chutney and fried green chili.','fixed',45.00,NULL,NULL,'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80','1 Pc with Chutneys',1,1,1,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(162,6,27,'Jodhpuri Pyaz Kachori','jodhpuri-pyaz-kachori-hira','Flaky Rajasthani crust packed with spiced caramelised onion masala and aromatic fennel.','fixed',40.00,NULL,NULL,'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80','1 Large Crispy Kachori',1,1,2,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(163,6,27,'Kachori Subzi Plate (2 Pcs)','kachori-subzi-plate-2-pcs-hira','Two khasta kachoris served crushed under piping hot spicy potato curry with fenugreek pickle.','fixed',70.00,NULL,NULL,'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80','2 Kachoris + Aloo Subzi',1,0,3,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(164,6,27,'Paneer Pakora (Per Pc)','paneer-pakora-per-pc-hira','Rich slice of fresh malai paneer seasoned with mint chutney, dipped in spiced chickpea batter and fried golden.','fixed',40.00,NULL,NULL,'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80','1 Large Paneer Pakora',1,0,4,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(165,6,27,'Khandvi Dhokla (Plate)','khandvi-dhokla-plate-hira','Silky smooth rolled gram flour pinwheels tempered with mustard seeds, fresh coconut, and curry leaves.','fixed',38.00,NULL,NULL,'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80','1 Plate Rolled Khandvi',1,0,5,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(166,6,27,'Paneer Dhokla (Plate)','paneer-dhokla-plate-hira','Spongy steamed savory dhokla layered with fresh grated cottage cheese and green chutney.','fixed',31.00,NULL,NULL,'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80','1 Plate Steamed Dhokla',1,0,6,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(167,6,27,'Chilli Paneer Roll','chilli-paneer-roll-hira','Flaky puff pastry stuffed with spicy stir-fried cottage cheese, bell peppers, and scallions.','fixed',56.00,NULL,NULL,'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80','1 Fresh Baked Puff Roll',1,0,7,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(168,6,27,'Spiral Pizza Slice','spiral-pizza-slice-hira','Oven baked pizza slice topped with gooey mozzarella, sweet corn, and Italian herbs.','fixed',56.00,NULL,NULL,'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80','1 Warm Pizza Slice',1,0,8,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(169,6,28,'Hira Special Balushahi','hira-special-balushahi-hira','World renowned Hira Balushahi with its flaky, melt-in-mouth golden crust soaked in fragrant sugar glaze.','fixed',35.00,NULL,NULL,'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80','1 Signature Pure Ghee Pc',1,1,1,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(170,6,28,'Special Rabri Faluda','special-rabri-faluda-hira','Chilled thick malai rabri served over ice with cornstarch vermicelli sev and scented rose syrup.','fixed',135.00,NULL,NULL,'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80','Royal Sundae Glass',1,1,2,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(171,6,28,'Desi Ghee Jalebi (Per Plate)','desi-ghee-jalebi-per-plate-hira','Crispy spiraled jalebis fried in pure desi ghee and immersed in saffron cardamom sugar nectar.','fixed',55.00,NULL,NULL,'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80','1 Hot Plate Jalebi',1,1,3,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(172,6,28,'Rasmalai (1 Pc)','rasmalai-1-pc-hira','Soft poached cottage cheese disc soaked in thickened sweet milk scented with saffron and pistachios.','fixed',45.00,NULL,NULL,'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80','1 Chilled Kesar Rasmalai',1,0,4,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(173,6,28,'Gulab Jamun (1 Pc)','gulab-jamun-1-pc-hira','Hot khoya dumpling fried to deep mahogany in pure ghee and bathed in rose cardamom syrup.','fixed',35.00,NULL,NULL,'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80','1 Warm Desi Ghee Pc',1,0,5,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(174,6,28,'Rajbhog (1 Pc)','rajbhog-1-pc-hira','Royal saffron chenna sphere stuffed with pistachio and almond bits.','fixed',40.00,NULL,NULL,'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80','1 Royal Stuffed Pc',1,0,6,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(175,6,28,'Stick Kulfi (1 Pc)','stick-kulfi-1-pc-hira','Traditional dense reduced milk kulfi on stick loaded with roasted almonds and cardamom.','fixed',55.00,NULL,NULL,'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80','1 Traditional Kesar Kulfi',1,0,7,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(176,6,29,'Tandoori Malai Chaap','tandoori-malai-chaap-hira','Tender soya chaap marinated in rich cashew paste, hung curd, and fresh cream, cooked over live charcoal.','fixed',325.00,NULL,NULL,'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80','Creamy Roasted Chaap Plate',1,1,1,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(177,6,29,'Paneer Tikka','paneer-tikka-hira','Thick cubes of malai cottage cheese, onions, and bell peppers marinated with ajwain and mustard oil.','fixed',340.00,NULL,NULL,'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80','6 Charred Cottage Cheese Cubes',1,1,2,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(178,6,29,'Achari Paneer Tikka','achari-paneer-tikka-hira','Fresh paneer tossed in zesty Rajasthani pickle spices and roasted in the clay tandoor.','fixed',340.00,NULL,NULL,'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80','Tangy Spiced Paneer Tikka',1,0,3,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(179,6,29,'Veg Seekh Kabab','veg-seekh-kabab-hira','Minced fresh vegetables, cottage cheese, and aromatic spices skewered and charred to perfection.','fixed',270.00,NULL,NULL,'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80','4 Skewered Kababs',1,0,4,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(180,6,29,'Mushroom Tikka','mushroom-tikka-hira','Whole button mushrooms marinated in tandoori spices and char-grilled with crunchy peppers.','fixed',310.00,NULL,NULL,'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80','Charred Button Mushrooms',1,0,5,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(181,6,30,'Dal Makhani','dal-makhani-hira','Whole black urad lentils slow simmered for 18 hours with butter, fresh cream, and subtle Kashmiri spices.','fixed',320.00,NULL,NULL,'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80','Slow Simmered Creamy Dal',1,1,1,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(182,6,30,'Shahi Paneer','shahi-paneer-hira','Soft paneer cubes simmered in royal velvety cashew nut and tomato gravy scented with shahi jeera.','fixed',345.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Rich Royal Gravy Bowl',1,1,2,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(183,6,30,'Hira Special Dal','hira-special-dal-hira','Chef special signature yellow lentil preparation tempered with desi ghee, burnt garlic, and cumin.','fixed',340.00,NULL,NULL,'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80','Signature House Dal',1,1,3,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(184,6,30,'Kadai Paneer','kadai-paneer-hira','Cottage cheese wok-tossed with freshly crushed coriander seeds, dry red chilies, and bell peppers.','fixed',350.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Wok Spiced Paneer',1,0,4,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(185,6,30,'Paneer Butter Masala','paneer-butter-masala-hira','Succulent paneer pieces bathed in creamy spiced makhani tomato butter sauce.','fixed',345.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Buttery Makhani Paneer',1,0,5,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(186,6,30,'Chole Chawal Combo','chole-chawal-combo-hira','Comfort lunch bowl of authentic spiced pindi chole served over fragrant steamed basmati rice with pickled salad.','fixed',175.00,NULL,NULL,'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80','Meal Bowl with Salad',1,1,6,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(187,6,30,'Rajma Chawal Combo','rajma-chawal-combo-hira','Homestyle slow-cooked Jammu rajma curry layered over piping hot basmati rice with crunchy onions.','fixed',175.00,NULL,NULL,'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80','Meal Bowl with Salad',1,0,7,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(188,6,31,'Hira Special Dosa','hira-special-dosa-hira','Chef signature crisp crepe layered with spiced red chutney, paneer crumbles, mashed potato masala, and dry fruits.','fixed',255.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Special King Size Dosa',1,1,1,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(189,6,31,'Masala Dosa','masala-dosa-hira','Classic paper thin crisp crepe stuffed with tempered potato onion masala, accompanied by drumstick sambhar and coconut chutney.','fixed',215.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Crisp Dosa with Sambhar & Chutneys',1,1,2,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(190,6,31,'Mysore Masala Dosa','mysore-masala-dosa-hira','Crisp golden crepe coated inside with spicy garlic red chutney and stuffed with spiced potato mash.','fixed',230.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Mysore Garlic Chutney Dosa',1,0,3,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(191,6,31,'Paneer Masala Dosa','paneer-masala-dosa-hira','Crispy fermented crepe filled with seasoned cottage cheese shreds and onion coriander relish.','fixed',245.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Paneer Stuffed Dosa',1,0,4,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(192,6,31,'Rice Idli (2 Pcs)','rice-idli-2-pcs-hira','Steamed fluffy rice and lentil cakes served with piping hot drumstick sambhar and fresh coconut chutney.','fixed',140.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','2 Steamed Idlis with Sambhar',1,0,5,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(193,6,31,'Vada Sambhar (2 Pcs)','vada-sambhar-2-pcs-hira','Crispy golden medu vadas prepared with black gram lentils and cumin, served with hot sambhar.','fixed',140.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','2 Medu Vadas with Sambhar',1,0,6,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(194,6,31,'Tomato Onion Uttapam','tomato-onion-uttapam-hira','Thick savory pancake griddled with chopped ripe tomatoes, red onions, green chilies, and fresh coriander.','fixed',235.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Thick Griddled Uttapam',1,0,7,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(195,6,32,'Deluxe Thali','deluxe-thali-hira','Grand royal feast: Dal Makhani, Shahi Paneer, Mix Veg, Pulao, Boondi Raita, Salad, Papad, 1 Baby Butter Naan, 1 Baby Lachha Parantha & 1 Sweet.','fixed',375.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Grand 10-Item Royal Thali',1,1,1,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(196,6,32,'Mini Thali','mini-thali-hira','Dal Makhani, Shahi Paneer, Pulao, Boondi Raita, Salad, 2 Butter Rotis & 1 Sweet.','fixed',315.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Wholesome Meal Thali',1,0,2,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(197,6,32,'ECO Thali','eco-thali-hira','Dal Fry, Mix Veg, Steamed Pulao, Raita, Salad, Papad, 2 Butter Rotis & 1 Sweet.','fixed',295.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Value Meal Thali',1,0,3,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(198,6,32,'Tandoori Sizzling Platter','tandoori-sizzling-platter-hira','Tandoori Aloo, Veg Seekh Kabab, Paneer Tikka, Stuffed Mushroom served with 1 Baby Butter Naan & Dal Makhani.','fixed',399.00,NULL,NULL,'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80','Grand Tandoori Feast Platter',1,1,4,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(199,6,32,'South Indian Platter','south-indian-platter-hira','2 Pcs Idli, 2 Pcs Medu Vada, 1 Pc Mini Masala Dosa & 1 Pc Mini Veg Uttapam served with hot Sambhar, Coconut & Tomato Chutneys.','fixed',330.00,NULL,NULL,'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80','Complete South Indian Feast',1,1,5,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(200,6,32,'Chinese Platter','chinese-platter-hira','Veg Hakka Noodles, Chilli Paneer Gravy, Veg Manchurian & Vegetable Fried Rice.','fixed',330.00,NULL,NULL,'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80','4-in-1 Chinese Feast',1,0,6,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(201,6,33,'Veg Hakka Noodles','veg-hakka-noodles-hira','Stir-fried noodles tossed with julienned carrots, cabbage, capsicum, and light soya sauce.','fixed',199.00,NULL,NULL,'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80','1 Bowl Wok Noodles',1,1,1,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(202,6,33,'Chilli Paneer (Dry / Gravy)','chilli-paneer-dry-gravy-hira','Fried cottage cheese cubes tossed in spicy garlic soy sauce with bell peppers and green chilies.','fixed',285.00,NULL,NULL,'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80','Paneer in Chili Glaze',1,1,2,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(203,6,33,'Chilli Potato','chilli-potato-hira','Crisp fried potato fingers glazed in spicy chili-garlic paste and spring onions.','fixed',180.00,NULL,NULL,'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80','Crispy Chili Potatoes',1,0,3,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(204,6,33,'Supreme Cheese Pizza','supreme-cheese-pizza-hira','Freshly baked thin crust pizza topped with mozzarella cheese, capsicum, sweet corn, onions, and black olives.','fixed',299.00,NULL,NULL,'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80','Oven Baked Pizza',1,0,4,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(205,6,33,'Alfredo White Sauce Pasta','alfredo-white-sauce-pasta-hira','Penne pasta tossed in rich parmesan cream cheese sauce with sautéed mushrooms and sweet corn.','fixed',260.00,NULL,NULL,'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80','Creamy White Penne',1,0,5,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(206,6,34,'Kulhad Masala Chai','kulhad-masala-chai-hira','Strong CTC tea brewed with freshly crushed ginger, green cardamom, and cloves served in clay cup.','fixed',55.00,NULL,NULL,'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80','1 Earthen Kulhad Cup',1,1,1,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(207,6,34,'Kesariya Lassi','kesariya-lassi-hira','Thick creamy Punjabi curd churned with saffron, crushed pistachios, and a layer of fresh malai.','fixed',110.00,NULL,NULL,'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80','Rich Saffron Lassi Glass',1,1,2,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(208,6,34,'Badam Thandai (Seasonal)','badam-thandai-seasonal-hira','Traditional cooling drink infused with crushed almonds, poppy seeds, fennel, and rose water.','fixed',95.00,NULL,NULL,'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80','Chilled Royal Thandai',1,0,3,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(209,6,34,'Cold Coffee with Ice Cream','cold-coffee-with-ice-cream-hira','Chilled blended creamy coffee served with a generous scoop of vanilla ice cream and chocolate drizzle.','fixed',145.00,NULL,NULL,'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80','Tall Chilled Glass',1,1,4,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(210,6,34,'Cucumber Mint Cooler','cucumber-mint-cooler-hira','Crisp cooling beverage with fresh cucumber juice, crushed garden mint, and a touch of black salt.','fixed',115.00,NULL,NULL,'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80','Refreshing Chilled Cooler',1,0,5,'2026-10-24 15:34:00','2026-10-24 15:34:00'),(211,6,34,'All American Banana Split Sundae','all-american-banana-split-sundae-hira','Classic banana split with scoops of vanilla, strawberry, and chocolate ice cream topped with fudge and nuts.','fixed',210.00,NULL,NULL,'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80','Triple Scoop Boat Sundae',1,1,6,'2026-10-24 15:34:00','2026-10-24 15:34:00');
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_10_19_172938_create_personal_access_tokens_table',1),(5,'2026_10_19_180001_create_categories_table',1),(6,'2026_10_19_180002_create_menu_items_table',1),(7,'2026_10_19_180003_create_restaurant_settings_table',1),(8,'2026_10_19_180004_create_qr_scans_table',1),(9,'2026_10_19_194724_create_canteens_table',2),(10,'2026_10_20_125432_add_hero_trio_to_canteens_table',3),(11,'2026_10_24_171241_add_canteen_id_to_users_table',4),(12,'2026_10_25_020000_add_favicon_and_title_to_canteens_table',5),(13,'2026_10_25_030000_cleanup_orphan_canteen_records',6);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (30,'App\\Models\\User',5,'annapoorna-admin-token','6a4c7318b589847ab2c0c980a08de96786508cd590c014959a1209999224205c','[\"*\"]',NULL,NULL,'2026-10-24 14:22:24','2026-10-24 14:22:24'),(34,'App\\Models\\User',2,'annapoorna-admin-token','4464dde1efc2babe11580e5977dcc6d727eb4a5ab5bc3c3caeb700654a07cffc','[\"*\"]','2026-10-24 14:44:54',NULL,'2026-10-24 14:44:04','2026-10-24 14:44:54'),(39,'App\\Models\\User',1,'annapoorna-admin-token','a83489a2bb6bb63523efffb957ed066174793827f5ca7e6be983d2c82456671e','[\"*\"]','2026-10-24 15:36:24',NULL,'2026-10-24 15:00:21','2026-10-24 15:36:24');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `qr_scans`
--

DROP TABLE IF EXISTS `qr_scans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `qr_scans` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `source` varchar(255) NOT NULL DEFAULT 'qr_table',
  `scanned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qr_scans`
--

LOCK TABLES `qr_scans` WRITE;
/*!40000 ALTER TABLE `qr_scans` DISABLE KEYS */;
/*!40000 ALTER TABLE `qr_scans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurant_settings`
--

DROP TABLE IF EXISTS `restaurant_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `restaurant_settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `restaurant_settings_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant_settings`
--

LOCK TABLES `restaurant_settings` WRITE;
/*!40000 ALTER TABLE `restaurant_settings` DISABLE KEYS */;
INSERT INTO `restaurant_settings` VALUES (1,'restaurant_name','Annapoorna Canteen','2026-10-19 12:05:17','2026-10-24 12:54:17'),(2,'tagline','Good Food. Made Fresh. Served with Respect.','2026-10-19 12:05:17','2026-10-24 12:54:17'),(3,'pure_veg_label','100% Pure Vegetarian','2026-10-19 12:05:17','2026-10-24 12:54:17'),(4,'address','Basement Parking, Gaur City Mall, Sector 4, Greater Noida West - 201009','2026-10-19 12:05:17','2026-10-24 12:54:17'),(5,'location_landmark','Gaur City Mall, Basement Parking','2026-10-19 12:05:17','2026-10-24 12:54:17'),(6,'phone','+91 98765 43210','2026-10-19 12:05:17','2026-10-24 12:54:17'),(7,'whatsapp','+91 98765 43210','2026-10-19 12:05:17','2026-10-24 12:54:17'),(8,'opening_hours','08:00 AM - 10:30 PM (Everyday)','2026-10-19 12:05:17','2026-10-24 12:58:39'),(9,'hero_heading','Artisan Delights & Hot Brews','2026-10-19 12:05:17','2026-10-24 12:54:17'),(10,'hero_subheading','Authentic North Indian savouries, hearty homestyle thalis, freshly toasted parathas, and refreshing shakes made daily with utmost purity and hygiene.','2026-10-19 12:05:17','2026-10-24 12:54:17'),(11,'logo_url','/logo.png','2026-10-19 12:05:17','2026-10-24 12:54:17'),(12,'announcement_enabled','1','2026-10-19 12:05:17','2026-10-19 12:05:17'),(13,'announcement_text','Welcome to Annapoorna Canteen! Hot breakfast, fresh parathas, and homestyle lunch thalis served daily.','2026-10-19 12:05:17','2026-10-24 12:54:17'),(14,'army_discount_enabled','1','2026-10-19 12:05:17','2026-10-19 12:05:17'),(15,'army_discount_text','10% Discount for Indian Armed Forces personnel & veterans with valid ID.','2026-10-19 12:05:17','2026-10-24 12:54:17'),(16,'qr_target_url','http://localhost:5173/menu','2026-10-19 12:05:17','2026-10-24 12:54:17'),(17,'id','1','2026-10-24 12:54:08','2026-10-24 12:54:17'),(18,'canteen_id','1','2026-10-24 12:54:08','2026-10-24 12:54:17'),(19,'slug','annapoorna-canteen','2026-10-24 12:54:08','2026-10-24 12:54:17'),(20,'full_logo_url','http://localhost:8000/logo.png','2026-10-24 12:54:08','2026-10-24 12:54:17'),(21,'primary_color','#063D29','2026-10-24 12:54:08','2026-10-24 13:15:33'),(22,'secondary_color','#075C35','2026-10-24 12:54:08','2026-10-24 13:15:33'),(23,'accent_color','#E8C928','2026-10-24 12:54:08','2026-10-24 13:15:33'),(24,'bg_color','#FAF8F1','2026-10-24 12:54:08','2026-10-24 13:15:33'),(25,'theme_preset','emerald_heritage','2026-10-24 12:54:08','2026-10-24 13:15:33'),(26,'dietary_type','pure_veg','2026-10-24 12:54:08','2026-10-24 12:54:17'),(27,'hero_badge','Chef Specials','2026-10-24 12:54:08','2026-10-24 12:54:17'),(28,'hero_trio','[{\"id\":\"left\",\"name\":\"Double Melt Burger\",\"price\":\"?95\",\"searchTerm\":\"burger\",\"stickerUrl\":\"\\/stickers\\/burger.jpg\"},{\"id\":\"center\",\"name\":\"Kulhad Masala Chai\",\"price\":\"?25\",\"searchTerm\":\"tea\",\"stickerUrl\":\"\\/stickers\\/tea.jpg\",\"showSteam\":true},{\"id\":\"right\",\"name\":\"Punjabi Samosa\",\"price\":\"?30\",\"searchTerm\":\"samosa\",\"stickerUrl\":\"\\/stickers\\/samosa.jpg\"}]','2026-10-24 12:54:08','2026-10-24 12:58:39'),(29,'discount_badge_enabled','1','2026-10-24 12:54:08','2026-10-24 12:54:08'),(30,'discount_badge_title','Armed Forces 10% Off','2026-10-24 12:54:08','2026-10-24 12:54:17'),(31,'discount_badge_text','10% Discount for Indian Armed Forces personnel & veterans with valid ID.','2026-10-24 12:54:08','2026-10-24 12:54:17'),(32,'is_active','1','2026-10-24 12:54:08','2026-10-24 12:54:08'),(33,'is_default','1','2026-10-24 12:54:08','2026-10-24 12:54:08');
/*!40000 ALTER TABLE `restaurant_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('FFKUmR8ouR9huZuQ2lJi3duKGmfLUPsvv4AG9jfA',NULL,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoieGJEWGhZbDZsbVV3aU1CUDZQdUFHa2ZrQnZuZ1NSeFZvZk1mWVE1SCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1792432728);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'admin',
  `canteen_id` bigint(20) unsigned DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_canteen_id_foreign` (`canteen_id`),
  CONSTRAINT `users_canteen_id_foreign` FOREIGN KEY (`canteen_id`) REFERENCES `canteens` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Annapoorna Super Admin','admin@annapoornacanteen.com','super_admin',NULL,'2026-10-24 12:57:23','$2y$12$CLbJnz5JS6v4cwgDCpivI.c/heBDqBOzjtpygy9FBQz/swz06SxeG',NULL,'2026-10-19 12:05:17','2026-10-24 12:57:23'),(2,'Super Administrator','admin@canteen.com','super_admin',NULL,'2026-10-24 12:57:22','$2y$12$iTa..I4xTy.Ol4hhWwux/.FXFNMPUvZhbEPUNq6KnNcAZWk8pwyH6',NULL,'2026-10-24 12:57:22','2026-10-24 12:57:22'),(3,'AMit','test@test.com','manager',NULL,NULL,'$2y$12$FUV6aSRuVkiaFFtUDAwI9.8RvIRiB7KtjDWcl3/ADMwGI/VgBFuzO',NULL,'2026-10-24 13:18:52','2026-10-24 13:18:52'),(4,'Abhishek','Abhi@gmail.com','manager',2,NULL,'$2y$12$BpjWnbNT2HFllQD2vybxu.yMJ4XrFgRPJo/9B9n77GpwrsnH.XrS2',NULL,'2026-10-24 13:41:59','2026-10-24 14:22:05'),(5,'Amit Singh','amit.btechcse@gmail.com','manager',1,NULL,'$2y$12$PEZOarSSQR/4GlVGY6uJdeGem7du8EIrTS5lbL4EvS7L4AEBemusC',NULL,'2026-10-24 13:46:56','2026-10-24 14:22:05'),(6,'Madan Sweets Manager','madan@sweets.com','manager',5,'2026-10-24 15:24:47','$2y$12$vWrgHAkWU6pK2bHgqc4dAOkm1DJYTtndFfylRqkiGJN59LZwGdUuK',NULL,'2026-10-24 15:24:47','2026-10-24 15:24:47'),(7,'Hira Sweets Manager','hira@sweets.com','manager',6,'2026-10-24 15:34:00','$2y$12$XZ0FXZz2OW2Yqh0FX2sGYOX.cqYY0S6ImMmsoCzpDsxRDe7jGdVVW',NULL,'2026-10-24 15:34:00','2026-10-24 15:34:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-25  2:40:20
