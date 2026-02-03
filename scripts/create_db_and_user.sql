-- Create database and user for Bookera
CREATE DATABASE IF NOT EXISTS `bookera_database` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
-- Create user for localhost and allow from any host as fallback
CREATE USER IF NOT EXISTS 'bookera'@'localhost' IDENTIFIED BY 'lab123';
CREATE USER IF NOT EXISTS 'bookera'@'%' IDENTIFIED BY 'lab123';

GRANT ALL PRIVILEGES ON `bookera_database`.* TO 'bookera'@'localhost';
GRANT ALL PRIVILEGES ON `bookera_database`.* TO 'bookera'@'%';
FLUSH PRIVILEGES;

-- Optional: create tables (based on provided schema)
USE `bookera_database`;

CREATE TABLE IF NOT EXISTS role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    created_at DATE,
    role_id INT,
    CONSTRAINT fk_user_role
        FOREIGN KEY (role_id) REFERENCES role(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_access (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    access_token VARCHAR(255) NOT NULL,
    expire_date DATE,
    CONSTRAINT fk_access_user
        FOREIGN KEY (user_id) REFERENCES `user`(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS fav_work (
    id INT AUTO_INCREMENT PRIMARY KEY,
    work_id VARCHAR(255) NOT NULL,
    work_name VARCHAR(255),
    cover_url VARCHAR(255),
    first_publish_year INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_fav_work (
    user_id INT NOT NULL,
    fav_work_id INT NOT NULL,
    PRIMARY KEY (user_id, fav_work_id),
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE,
    FOREIGN KEY (fav_work_id) REFERENCES fav_work(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS conversation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_conversation (
    user_id INT NOT NULL,
    conversation_id INT NOT NULL,
    PRIMARY KEY (user_id, conversation_id),
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE,
    FOREIGN KEY (conversation_id) REFERENCES conversation(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    content VARCHAR(255) NOT NULL,
    type INT,
    created_at DATE,
    sender_id INT NOT NULL,
    FOREIGN KEY (conversation_id) REFERENCES conversation(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_book (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255),
    author VARCHAR(255),
    price INT,
    upload_time DATE,
    `condition` VARCHAR(255),
    description VARCHAR(255),
    status VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_book_image (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_book_id INT NOT NULL,
    image_url VARCHAR(255),
    FOREIGN KEY (user_book_id) REFERENCES user_book(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS book_payment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_book_id INT NOT NULL,
    FOREIGN KEY (user_book_id) REFERENCES user_book(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS book_wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT,
    book_image_url VARCHAR(255),
    book_price INT,
    book_owner VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_book_wishlist (
    user_book_id INT NOT NULL,
    book_wishlist_id INT NOT NULL,
    PRIMARY KEY (user_book_id, book_wishlist_id),
    FOREIGN KEY (user_book_id) REFERENCES user_book(id) ON DELETE CASCADE,
    FOREIGN KEY (book_wishlist_id) REFERENCES book_wishlist(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
