-- 1 Insert a new record into the account table
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');


-- 2 Modify Tony Stark's account_type to "Admin"
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- 3 Delete a record
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- 4 Update a record using REPLACE
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5 Use an inner join to select fields from inventory and classification tables

SELECT inv_make, inv_model, classification_name
FROM public.inventory
INNER JOIN public.classification
ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

-- 6 Update multiple columns with REPLACE
UPDATE public.inventory
SET inv_image  = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail  = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
