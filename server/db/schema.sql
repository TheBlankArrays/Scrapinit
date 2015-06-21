
USE scraping;

DROP TABLE IF EXISTS User;

CREATE TABLE `User` (
    `UserID` INT NOT NULL AUTO_INCREMENT,
    `Email` varchar NOT NULL,
    `Password` varchar NOT NULL,
    PRIMARY KEY (`UserID`)
);

DROP TABLE IF EXISTS Url;

CREATE TABLE `Url` (
    `UrlID` INT NOT NULL AUTO_INCREMENT,
    `Url` varchar NOT NULL,
    PRIMARY KEY (`UrlID`)
);

DROP TABLE IF EXISTS UserUrl;

CREATE TABLE `UserUrl` (
    `userID` INT NOT NULL,
    `urlID` INT NOT NULL,
    `frequency` INT NOT NULL DEFAULT '5',
    `html` varchar NOT NULL,
    `selector` varchar NOT NULL,
    PRIMARY KEY (`UserUrlID`)
);

ALTER TABLE `UserUrl` ADD CONSTRAINT `UserUrl_fk0` FOREIGN KEY (`userID`) REFERENCES `User`(`UserID`);
ALTER TABLE `UserUrl` ADD CONSTRAINT `UserUrl_fk1` FOREIGN KEY (`urlID`) REFERENCES `Url`(`UrlID`);



-- better set up?

/*

DROP TABLE IF EXISTS `user`

CREATE TABLE `user`(
    `userId` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`userId`)
);

ALTER TABLE `User` ADD CONSTRAINT `User_fk0` FOREIGN KEY (`scrapes`) REFERENCES `scrape`(`url`);

DROP TABLE IF EXISTS `UserUrl`;

CREATE TABLE `UserUrl` (
    `urlID` INT NOT NULL AUTO_INCREMENT,
    -- selector?? 
    -- 'selector' VARCHAR(255) NOT NULL,
    `html` VARCHAR(255) NOT NULL,
    'frequency' INT NOT NULL DEFAULT 5,
    PRIMARY KEY (`urlID`)
);

DROP TABLE IF EXISTS `url`;

CREATE TABLE `url` (
    `URLID` INT NOT NULL AUTO_INCREMENT,
    `UserID` INT NOT NULL,
    'url' VARCHAR(255) NOT NULL,
    `scrapesID` INT NOT NULL,
    PRIMARY KEY (`URLID`)
);

*/