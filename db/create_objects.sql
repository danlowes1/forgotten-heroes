USE forgottenheroes;

DELIMITER //

CREATE PROCEDURE up_GET_HeroRandomName (
    OUT random_hero_name VARCHAR(255)
)
BEGIN
    DECLARE min_id INT;
    DECLARE max_id INT;
    DECLARE random_id INT;
    
    -- 1. Find the min and max IDs that are actually in the result set
    SELECT 
        MIN(H.id), MAX(H.id) 
    INTO 
        min_id, max_id 
    FROM 
        hero AS H
    WHERE 
        H.ID IN (SELECT hero_id FROM hero_ai_find);
    
    -- 2. Pick a random number between min_id and max_id
    SET random_id = FLOOR(min_id + RAND() * (max_id - min_id));

    -- 3. Find the first valid row that has an ID greater than or equal to the random ID
    SELECT 
        H.hero_name 
    INTO 
        random_hero_name
    FROM 
        hero AS H
    WHERE 
        H.ID IN (SELECT hero_id FROM hero_ai_find)
        AND H.id >= random_id
    ORDER BY 
        H.id 
    LIMIT 1;

END //

DELIMITER ;