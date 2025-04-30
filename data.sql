insert into authors (first_name, last_name) values ('James', 'S. A. Corey');
insert into authors (first_name, last_name) values ('Craig', 'Alanson');
insert into authors (first_name, last_name) values ('Cixin', 'Liu');

insert into genres (name) values ('Sience Fiction');
insert into genres (name) values ('Fantasy');
insert into genres (name) values ('Romance');
insert into genres (name) values ('Mystery');
insert into genres (name) values ('Horror');


insert into books (title, publishing_year, genre_id) values ('Leviathan Wakes', 2011, 1);
insert into books (title, publishing_year, genre_id) values ('Caliban’s War', 2012, 1);

INSERT into authors_books (author_id, book_id) values (1, 1);
INSERT into authors_books (author_id, book_id) values (1, 2);


