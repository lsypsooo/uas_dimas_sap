-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 04, 2025 at 03:15 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hr_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('SUPERADMIN','ADMIN_PERUSAHAAN','KARYAWAN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `perusahaanId` int DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `role`, `perusahaanId`, `createdAt`, `updatedAt`, `email`) VALUES
(2, 'admin', '$2b$10$cu4R/DUTLKpmuvS21VhVRecFCQYsuqw7b4BHLfmLSX6szQvxQVPVK', 'SUPERADMIN', NULL, '2025-06-13 07:46:03.490', '2025-06-13 07:46:03.490', 'admin@gmail.com'),
(3, 'wendy', '$2b$10$JT0c9OvtDQlxEu1Pt9yu9eOp6WKwqtKkXZcID1UarQJ6DZnSroCwS', 'KARYAWAN', NULL, '2025-06-13 07:47:12.213', '2025-06-13 07:47:12.213', 'wendy@gmail.com'),
(4, 'dimas', '$2b$10$ViS1.RJRNLPho5wgMdv3BeEbwNcJ3nb4yaYYijn1BiOejZnVyZQpS', 'SUPERADMIN', NULL, '2025-06-13 07:48:13.509', '2025-07-03 05:07:35.019', 'dimas@gmail.com'),
(11, 'andre', '$2b$10$Ipj71KWjXL0AR7zi341qY.wX2mAV60byhNlm59zcQclz9NTYoDFh6', 'ADMIN_PERUSAHAAN', 2, '2025-06-13 08:44:52.268', '2025-06-13 08:44:52.268', 'andre@gmail.com'),
(13, 'SANTUY', '$2b$10$Xb4qxQLTK5geB0dKWRDh6OOwj1fKQVcsI66JK90OUJQql6rnqFRY.', 'ADMIN_PERUSAHAAN', 7, '2025-07-03 13:45:09.425', '2025-07-03 13:46:22.704', 'santuy@gmail.com'),
(14, 'edwin', '$2b$10$4irCflxSe8jwzqGk5.Xkfuyo5vW0UnYq.biC/dpxeCtB3r3WFDBee', 'KARYAWAN', 7, '2025-07-03 14:07:32.875', '2025-07-04 02:24:56.490', 'edwin@gmail.com'),
(15, 'nico', '$2b$10$9BI6KEn.7AHNe33pnhSQe.DV/FY7MbTNEjfI3F.YIJxOG7Mjj9hR.', 'KARYAWAN', 7, '2025-07-03 15:16:39.066', '2025-07-03 15:16:39.066', 'nico@gmail.com'),
(16, 'toko game', '$2b$10$Nqyc9H/W5hwUrE1k2NamJezsE32UAv/zhMtPZcmJu/VZpITn6qNcy', 'ADMIN_PERUSAHAAN', 2, '2025-07-04 02:54:36.650', '2025-07-04 02:54:36.650', 'testttt@gmail.com'),
(17, 'yuna', '$2b$10$JwtPWGe2/1hfJmP5QAZaBubWAKWI.lZyASOCEEnY3D06fMLMlOBru', 'KARYAWAN', 7, '2025-07-04 02:55:37.969', '2025-07-04 02:55:37.969', 'yuna@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD KEY `User_perusahaanId_fkey` (`perusahaanId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `User_perusahaanId_fkey` FOREIGN KEY (`perusahaanId`) REFERENCES `perusahaan` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
