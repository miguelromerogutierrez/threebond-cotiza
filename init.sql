DROP TABLE IF EXISTS customers;
CREATE TABLE customers(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  aName VARCHAR(255),
  lastName VARCHAR(255),
  phoneNumber VARCHAR(255),
  email VARCHAR(25),
  company VARCHAR(255),
  aState VARCHAR(255),
  sector VARCHAR(255),
  otherSector VARCHAR(255),
  novedades VARCHAR(4),
  aDescription TEXT
);