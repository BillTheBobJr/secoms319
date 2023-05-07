use carrental;

create table car(
id Integer auto_increment, name varchar(255), image varchar(255),description text, price Integer,
primary key (id)
);

create table time(
carId Integer, startDate Date, endDate Date, price Integer, name varchar(255), email varchar(255), id Integer auto_increment,
primary key (id), foreign key(carId) references car(id)
);

insert into car (name, image,description, price) 
value("Blue Car", "./images/blueCar", "This beautiful car can drive", 100);

insert into car (name, image,description, price) 
value("Yellow Car", "./images/yellowCar", "This car sure is cheap", 40);

CREATE USER 'javaScriptUser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON carrental.* TO 'javaScriptUser'@'localhost';