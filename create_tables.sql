-- Creation of product table
CREATE TABLE IF NOT EXISTS customer (
  customer_id SERIAL,
  customer_name varchar(200),
  customer_password TEXT,
  customer_code varchar(7),
  customer_email varchar(100),
  customer_phone varchar(50),
  customer_identification_id varchar(100),
  customer_birthday TIMESTAMP,
  customer_province varchar(50),
  customer_status varchar(50),
  last_login TIMESTAMP,
  last_activity TIMESTAMP,
  created_date TIMESTAMP,
  updated_date TIMESTAMP,
  PRIMARY KEY (customer_id)
);

-- Creation of product table
CREATE TABLE IF NOT EXISTS lock_transaction (
  lock_id SERIAL,
  lock_remarks text,
  updated_date TIMESTAMP,
  PRIMARY KEY (lock_id)
);

-- Creation of product table
CREATE TABLE IF NOT EXISTS auth_token (
  atoken_id SERIAL,
  customer_id INT NOT NULL,
  atoken_device varchar(200),
  atoken_platform varchar(200),
  atoken_access varchar(200),
  atoken_status varchar(10),
  atoken_refresh varchar(200),
  expired_date TIMESTAMP,
  created_date TIMESTAMP,
  updated_date TIMESTAMP,
  PRIMARY KEY (atoken_id)
);


-- Creation of product table
CREATE TABLE IF NOT EXISTS app_version (
  ver_id SERIAL,
  ver_code  varchar(50) NOT NULL,
  ver_platform varchar(50),
  ver_status varchar(10),
  created_by INT NOT NULL,
  updated_by INT NOT NULL,
  created_date TIMESTAMP,
  updated_date TIMESTAMP,
  PRIMARY KEY (ver_id)
);

-- Creation of product table
CREATE TABLE IF NOT EXISTS history_device (
  hd_id SERIAL,
  atoken_device  varchar(200),
  atoken_platform varchar(200),
  created_date TIMESTAMP,
  PRIMARY KEY (hd_id)
);

CREATE TABLE IF NOT EXISTS customer_account (
  customer_account_id SERIAL,
  customer_id INT NOT NULL,
  customer_account_number varchar(100),
  customer_account_name varchar(100),
  customer_account_balance INT,
  is_deleted BOOLEAN,
  created_date TIMESTAMP,
  updated_date TIMESTAMP,
  PRIMARY KEY (customer_account_id)
);

CREATE TABLE IF NOT EXISTS customer_account_directory (
  customer_account_directory_id SERIAL,
  customer_id INT NOT NULL,
  customer_account_id INT NOT NULL,
  customer_account_directory_name varchar(100),
  customer_account_status varchar(10),
  created_date TIMESTAMP,
  updated_date TIMESTAMP,
  PRIMARY KEY (customer_account_directory_id)
);