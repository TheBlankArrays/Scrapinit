
USE scraping;

DROP TABLE IF EXISTS `user`

CREATE TABLE `user`(
    `userId` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `scrapes` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`userId`)
);

ALTER TABLE `User` ADD CONSTRAINT `User_fk0` FOREIGN KEY (`scrapes`) REFERENCES `scrape`(`url`);

DROP TABLE IF EXISTS `scrapes`;

CREATE TABLE `scrapes` (
    `urlID` INT NOT NULL AUTO_INCREMENT,
    `html` VARCHAR(255) NOT NULL,
    'frequency' INT NOT NULL DEFAULT 5,
    PRIMARY KEY (`urlID`)
);

DROP TABLE IF EXISTS `url`;

CREATE TABLE `url` (
    `URLID` INT NOT NULL AUTO_INCREMENT,
    `UserID` INT NOT NULL,
    `scrapesID` INT NOT NULL,
    PRIMARY KEY (`URLID`)
);
