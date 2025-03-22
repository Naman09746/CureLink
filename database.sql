CREATE DATABASE my_database;
USE my_database;
drop database my_database;
show tables;
CREATE TABLE hospital (
    hospital_id INT PRIMARY KEY AUTO_INCREMENT,
    hospital_code VARCHAR(10) UNIQUE ,
    hospital_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    username VARCHAR(50) UNIQUE,
	password VARCHAR(255) NOT NULL,
	last_login TIMESTAMP,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 	
);
SET SQL_SAFE_UPDATES = 0;
UPDATE hospital SET hospital_code = CONCAT('H', hospital_id);  -- Assign unique IDs with 'H' prefix

CREATE TABLE vendors (
    vendor_id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_code VARCHAR(10) UNIQUE,
    vendor_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    username VARCHAR(50) UNIQUE,
	password VARCHAR(255) NOT NULL,
	last_login TIMESTAMP,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
UPDATE vendors SET vendor_code = CONCAT('V', vendor_id);  -- Assign unique IDs with 'V' prefix
select * from hospital;

CREATE TABLE entries (
    batch INT AUTO_INCREMENT PRIMARY KEY,
    medicine VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    vendor VARCHAR(100) NOT NULL,
    stock VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    expire DATE,
    hospital_code varchar(10),
    FOREIGN KEY (hospital_code) REFERENCES hospital(hospital_code)
);
drop table entries;
select * from entries;

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_code varchar(10),
    vendor_code varchar(10),
    medicine_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    order_date DATE NOT NULL,
    delivery_date DATE,
    rejection_note TEXT,
    status ENUM('Pending', 'Completed', 'Rejected') DEFAULT 'Pending',
    FOREIGN KEY (hospital_code) REFERENCES hospital(hospital_code),
    FOREIGN KEY (vendor_code) REFERENCES vendors(vendor_code)
);

CREATE TABLE login_attempts (
    attempt_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    user_type ENUM('hospital', 'vendor') NOT NULL,
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN NOT NULL,
    ip_address VARCHAR(45)
);

-- Create table for password reset tokens
CREATE TABLE password_reset_tokens (
    token_id INT PRIMARY KEY AUTO_INCREMENT,
    user_type ENUM('hospital', 'vendor') NOT NULL,
    user_id INT NOT NULL,
    token VARCHAR(100) NOT NULL,
    expiry TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



INSERT INTO vendors (vendor_name, email, phone, username, password)
VALUES 
('Med Supplies Inc', 'info@medsupplies.com', '1122334455', 'medsupplies', '$2b$10$HASHED_PASSWORD'),
('Pharma Corp', 'contact@pharmacorp.com', '5544332211', 'pharmacorp', '$2b$10$HASHED_PASSWORD');




INSERT INTO hospital (hospital_name, email, phone) VALUES
('Apollo', 'apollo@example.com', '1234567890'),
('Medanta', 'medanta@example.com', '2345678901'),
('Fortix', 'fortis@example.com', '3456789012'),
('Max', 'max@example.com', '4567890123'),
('Manipal', 'manipal@example.com', '5678901234');

INSERT INTO vendors (vendor_name, email, phone) VALUES
('A', 'a@example.com', '1234569990'),
('B', 'medanta@example.com', '7645678901'),
('C', 'fortis@example.com', '565789012');



INSERT INTO orders (hospital_name,vendor_name, medicine_name, quantity, order_date, delivery_date, status) VALUES
('City Hospital', 'VendorA','Paracetamol', 50, '2024-01-01', '2024-01-05', 'Completed'),
('City Hospital', 'VendorA','Ibuprofen', 30, '2024-01-10', NULL, 'Pending'),
('Apollo Hospital', 'VendorA','Metformin', 20, '2024-01-12', '2024-01-14', 'Completed'),
('Apollo Hospital', 'VendorA','Amoxicillin', 40, '2024-01-15', NULL, 'Pending');


INSERT INTO entries (Batch, Medicine, Category, Vendor, Stock, Quantity, Expire) VALUES
(1, 'Paracetamol', 'Pain Relief', 'PharmaCorp', 100, 500, '2024-05-15'),
(2, 'Amoxicillin', 'Antibiotic', 'MedSupply', 75, 300, '2024-06-20'),
(3, 'Ibuprofen', 'Pain Relief', 'HealthPlus', 120, 600, '2024-07-10'),
(4, 'Cetirizine', 'Antihistamine', 'PharmaCorp', 90, 450, '2024-08-25'),
(5, 'Omeprazole', 'Antacid', 'MedSupply', 60, 200, '2024-09-05'),
(6, 'Loratadine', 'Antihistamine', 'HealthPlus', 80, 400, '2024-10-12'),
(7, 'Aspirin', 'Pain Relief', 'PharmaCorp', 110, 550, '2024-11-30'),
(8, 'Ciprofloxacin', 'Antibiotic', 'MedSupply', 70, 350, '2024-12-15'),
(9, 'Metformin', 'Diabetes', 'HealthPlus', 95, 475, '2025-01-20'),
(10, 'Atorvastatin', 'Cholesterol', 'PharmaCorp', 85, 425, '2025-02-28'),
(11, 'Simvastatin', 'Cholesterol', 'MedSupply', 65, 325, '2025-03-10'),
(12, 'Losartan', 'Blood Pressure', 'HealthPlus', 100, 500, '2025-04-05'),
(13, 'Metoprolol', 'Blood Pressure', 'PharmaCorp', 75, 375, '2025-05-12'),
(14, 'Levothyroxine', 'Thyroid', 'MedSupply', 90, 450, '2025-06-18'),
(15, 'Gabapentin', 'Neuropathic Pain', 'HealthPlus', 80, 400, '2025-07-22'),
(16, 'Tramadol', 'Pain Relief', 'PharmaCorp', 70, 350, '2025-08-30'),
(17, 'Diazepam', 'Anxiety', 'MedSupply', 60, 300, '2025-09-05'),
(18, 'Alprazolam', 'Anxiety', 'HealthPlus', 50, 250, '2025-10-10'),
(19, 'Sertraline', 'Antidepressant', 'PharmaCorp', 85, 425, '2025-11-15'),
(20, 'Fluoxetine', 'Antidepressant', 'MedSupply', 75, 375, '2025-12-20'),
(21, 'Warfarin', 'Anticoagulant', 'HealthPlus', 65, 325, '2026-01-25'),
(22, 'Clopidogrel', 'Anticoagulant', 'PharmaCorp', 55, 275, '2026-02-28'),
(23, 'Insulin', 'Diabetes', 'MedSupply', 95, 475, '2026-03-05'),
(24, 'Glimepiride', 'Diabetes', 'HealthPlus', 85, 425, '2026-04-10'),
(25, 'Pioglitazone', 'Diabetes', 'PharmaCorp', 75, 375, '2026-05-15'),
(26, 'Ranitidine', 'Antacid', 'MedSupply', 65, 325, '2026-06-20'),
(27, 'Famotidine', 'Antacid', 'HealthPlus', 55, 275, '2026-07-25'),
(28, 'Diclofenac', 'Pain Relief', 'PharmaCorp', 100, 500, '2026-08-30'),
(29, 'Naproxen', 'Pain Relief', 'MedSupply', 90, 450, '2026-09-05'),
(30, 'Pregabalin', 'Neuropathic Pain', 'HealthPlus', 80, 400, '2026-10-10'),
(31, 'Amitriptyline', 'Antidepressant', 'PharmaCorp', 70, 350, '2026-11-15'),
(32, 'Venlafaxine', 'Antidepressant', 'MedSupply', 60, 300, '2026-12-20'),
(33, 'Quetiapine', 'Antipsychotic', 'HealthPlus', 50, 250, '2027-01-25'),
(34, 'Risperidone', 'Antipsychotic', 'PharmaCorp', 40, 200, '2027-02-28'),
(35, 'Olanzapine', 'Antipsychotic', 'MedSupply', 30, 150, '2027-03-05'),
(36, 'Clonazepam', 'Anxiety', 'HealthPlus', 20, 100, '2027-04-10'),
(37, 'Lorazepam', 'Anxiety', 'PharmaCorp', 10, 50, '2027-05-15'),
(38, 'Hydrocodone', 'Pain Relief', 'MedSupply', 100, 500, '2027-06-20'),
(39, 'Oxycodone', 'Pain Relief', 'HealthPlus', 90, 450, '2027-07-25'),
(40, 'Morphine', 'Pain Relief', 'PharmaCorp', 80, 400, '2027-08-30'),
(41, 'Fentanyl', 'Pain Relief', 'MedSupply', 70, 350, '2027-09-05'),
(42, 'Codeine', 'Pain Relief', 'HealthPlus', 60, 300, '2027-10-10'),
(43, 'Tramadol', 'Pain Relief', 'PharmaCorp', 50, 250, '2027-11-15'),
(44, 'Hydromorphone', 'Pain Relief', 'MedSupply', 40, 200, '2027-12-20'),
(45, 'Methadone', 'Pain Relief', 'HealthPlus', 30, 150, '2028-01-25'),
(46, 'Buprenorphine', 'Pain Relief', 'PharmaCorp', 20, 100, '2028-02-28'),
(47, 'Naloxone', 'Opioid Antagonist', 'MedSupply', 10, 50, '2028-03-05'),
(48, 'Naltrexone', 'Opioid Antagonist', 'HealthPlus', 100, 500, '2028-04-10'),
(49, 'Acetaminophen', 'Pain Relief', 'PharmaCorp', 90, 450, '2028-05-15'),
(50, 'Dextromethorphan', 'Cough Suppressant', 'MedSupply', 80, 400, '2028-06-20'),
(51, 'Guaifenesin', 'Expectorant', 'HealthPlus', 70, 350, '2028-07-25'),
(52, 'Phenylephrine', 'Decongestant', 'PharmaCorp', 60, 300, '2028-08-30'),
(53, 'Pseudoephedrine', 'Decongestant', 'MedSupply', 50, 250, '2028-09-05'),
(54, 'Diphenhydramine', 'Antihistamine', 'HealthPlus', 40, 200, '2028-10-10'),
(55, 'Chlorpheniramine', 'Antihistamine', 'PharmaCorp', 30, 150, '2028-11-15'),
(56, 'Brompheniramine', 'Antihistamine', 'MedSupply', 20, 100, '2028-12-20'),
(57, 'Cetirizine', 'Antihistamine', 'HealthPlus', 10, 50, '2029-01-25'),
(58, 'Fexofenadine', 'Antihistamine', 'PharmaCorp', 100, 500, '2029-02-28'),
(59, 'Levocetirizine', 'Antihistamine', 'MedSupply', 90, 450, '2029-03-05'),
(60, 'Desloratadine', 'Antihistamine', 'HealthPlus', 80, 400, '2029-04-10'),
(61, 'Hydroxyzine', 'Antihistamine', 'PharmaCorp', 70, 350, '2029-05-15'),
(62, 'Promethazine', 'Antihistamine', 'MedSupply', 60, 300, '2029-06-20'),
(63, 'Meclizine', 'Antihistamine', 'HealthPlus', 50, 250, '2029-07-25'),
(64, 'Dimenhydrinate', 'Antihistamine', 'PharmaCorp', 40, 200, '2029-08-30'),
(65, 'Cyclizine', 'Antihistamine', 'MedSupply', 30, 150, '2029-09-05'),
(66, 'Cinnarizine', 'Antihistamine', 'HealthPlus', 20, 100, '2029-10-10'),
(67, 'Loratadine', 'Antihistamine', 'PharmaCorp', 10, 50, '2029-11-15'),
(68, 'Cetirizine', 'Antihistamine', 'MedSupply', 100, 500, '2029-12-20'),
(69, 'Fexofenadine', 'Antihistamine', 'HealthPlus', 90, 450, '2030-01-25'),
(70, 'Levocetirizine', 'Antihistamine', 'PharmaCorp', 80, 400, '2030-02-28'),
(71, 'Desloratadine', 'Antihistamine', 'MedSupply', 70, 350, '2030-03-05'),
(72, 'Hydroxyzine', 'Antihistamine', 'HealthPlus', 60, 300, '2030-04-10'),
(73, 'Promethazine', 'Antihistamine', 'PharmaCorp', 50, 250, '2030-05-15'),
(74, 'Meclizine', 'Antihistamine', 'MedSupply', 40, 200, '2030-06-20'),
(75, 'Dimenhydrinate', 'Antihistamine', 'HealthPlus', 30, 150, '2030-07-25'),
(76, 'Cyclizine', 'Antihistamine', 'PharmaCorp', 20, 100, '2030-08-30'),
(77, 'Cinnarizine', 'Antihistamine', 'MedSupply', 10, 50, '2030-09-05'),
(78, 'Loratadine', 'Antihistamine', 'HealthPlus', 100, 500, '2030-10-10'),
(79, 'Cetirizine', 'Antihistamine', 'PharmaCorp', 90, 450, '2030-11-15'),
(80, 'Fexofenadine', 'Antihistamine', 'MedSupply', 80, 400, '2030-12-20'),
(81, 'Levocetirizine', 'Antihistamine', 'HealthPlus', 70, 350, '2031-01-25'),
(82, 'Desloratadine', 'Antihistamine', 'PharmaCorp', 60, 300, '2031-02-28'),
(83, 'Hydroxyzine', 'Antihistamine', 'MedSupply', 50, 250, '2031-03-05'),
(84, 'Promethazine', 'Antihistamine', 'HealthPlus', 40, 200, '2031-04-10'),
(85, 'Meclizine', 'Antihistamine', 'PharmaCorp', 30, 150, '2031-05-15'),
(86, 'Dimenhydrinate', 'Antihistamine', 'MedSupply', 20, 100, '2031-06-20'),
(87, 'Cyclizine', 'Antihistamine', 'HealthPlus', 10, 50, '2031-07-25'),
(88, 'Cinnarizine', 'Antihistamine', 'PharmaCorp', 100, 500, '2031-08-30'),
(89, 'Loratadine', 'Antihistamine', 'MedSupply', 90, 450, '2031-09-05'),
(90, 'Cetirizine', 'Antihistamine', 'HealthPlus', 80, 400, '2031-10-10'),
(91, 'Fexofenadine', 'Antihistamine', 'PharmaCorp', 70, 350, '2031-11-15'),
(92, 'Levocetirizine', 'Antihistamine', 'MedSupply', 60, 300, '2031-12-20'),
(93, 'Desloratadine', 'Antihistamine', 'HealthPlus', 50, 250, '2032-01-25'),
(94, 'Hydroxyzine', 'Antihistamine', 'PharmaCorp', 40, 200, '2032-02-28'),
(95, 'Promethazine', 'Antihistamine', 'MedSupply', 30, 150, '2032-03-05'),
(96, 'Meclizine', 'Antihistamine', 'HealthPlus', 20, 100, '2032-04-10'),
(97, 'Dimenhydrinate', 'Antihistamine', 'PharmaCorp', 10, 50, '2032-05-15'),
(98, 'Cyclizine', 'Antihistamine', 'MedSupply', 100, 500, '2032-06-20'),
(99, 'Cinnarizine', 'Antihistamine', 'HealthPlus', 90, 450, '2032-07-25'),
(100, 'Loratadine', 'Antihistamine', 'PharmaCorp', 80, 400, '2032-08-30');