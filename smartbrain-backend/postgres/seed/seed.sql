BEGIN TRANSACTION;

INSERT INTO users (name, email, entries, joined) values ('diogo', 'diogo@gmail.com', 5 , '2019-04-13');
INSERT INTO login (hash, email) values ('$2a$10$WAK21U0LWl7C//jJ.DOB2uPP1DJQh7KUDgasdyQeGzkop2Pzl8W7u', 'diogo@gmail.com');

COMMIT;