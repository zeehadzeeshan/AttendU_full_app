-- SUBJECT INSERTION SCRIPT
-- This script inserts subjects for all sections within the specified Batches for the 'Software Engineering' (or 'SWE') department.
-- It assumes your Department is named 'Software Engineering' or 'SWE'. Adjust the name in the detailed query if needed.

DO $$
DECLARE
    dept_id UUID;
    batch_rec RECORD;
    section_rec RECORD;
    
    -- Function to get code from name (First letters of words)
    -- Just a helper logic for the inserts below
BEGIN
    -- 1. FIND THE DEPARTMENT ID
    -- We look for 'SWE' or 'Software Engineering'
    SELECT id INTO dept_id FROM faculties WHERE name ILIKE '%Software Engineering%' OR name = 'SWE' LIMIT 1;

    IF dept_id IS NULL THEN
        RAISE EXCEPTION 'Department "Software Engineering" or "SWE" not found.';
    END IF;

    RAISE NOTICE 'Found Department ID: %', dept_id;

    -- ============================================================================================
    -- BATCH 47 (1st Semester)
    -- Subjects: 
    -- Computer Fundamentals, Computer Fundamentals Lab, Introduction to Software Engineering, 
    -- English Reading, Writing Skills & Public Speaking, Bangladesh Studies, Math‑I: Calculus & Geometry / Mathematics I
    -- ============================================================================================
    
    FOR batch_rec IN SELECT id FROM batches WHERE faculty_id = dept_id AND name = '47' LOOP
        FOR section_rec IN SELECT id FROM sections WHERE batch_id = batch_rec.id LOOP
            -- Insert Subjects for this Section
            INSERT INTO subjects (id, section_id, name, code) VALUES
            (gen_random_uuid(), section_rec.id, 'Computer Fundamentals', 'CF'),
            (gen_random_uuid(), section_rec.id, 'Computer Fundamentals Lab', 'CF-LAB'),
            (gen_random_uuid(), section_rec.id, 'Introduction to Software Engineering', 'ISE'),
            (gen_random_uuid(), section_rec.id, 'English Reading, Writing Skills & Public Speaking', 'ENG-101'),
            (gen_random_uuid(), section_rec.id, 'Bangladesh Studies', 'BDS'),
            (gen_random_uuid(), section_rec.id, 'Math‑I: Calculus & Geometry', 'MAT-101');
        END LOOP;
    END LOOP;

    -- ============================================================================================
    -- BATCH 46 (2nd Semester)
    -- Subjects:
    -- Structured Programming, Structured Programming Lab, Discrete Mathematics, 
    -- Software Requirement Specifications & Analysis, Digital Electronics & Logic Design, 
    -- Physics: Mechanics, Electromagnetism & Waves, Math‑II: Linear Algebra & Fourier Analysis
    -- ============================================================================================
    
    FOR batch_rec IN SELECT id FROM batches WHERE faculty_id = dept_id AND name = '46' LOOP
        FOR section_rec IN SELECT id FROM sections WHERE batch_id = batch_rec.id LOOP
            INSERT INTO subjects (id, section_id, name, code) VALUES
            (gen_random_uuid(), section_rec.id, 'Structured Programming', 'SP'),
            (gen_random_uuid(), section_rec.id, 'Structured Programming Lab', 'SP-LAB'),
            (gen_random_uuid(), section_rec.id, 'Discrete Mathematics', 'DM'),
            (gen_random_uuid(), section_rec.id, 'Software Requirement Specifications & Analysis', 'SRSA'),
            (gen_random_uuid(), section_rec.id, 'Digital Electronics & Logic Design', 'DELD'),
            (gen_random_uuid(), section_rec.id, 'Physics: Mechanics, Electromagnetism & Waves', 'PHY-101'),
            (gen_random_uuid(), section_rec.id, 'Math‑II: Linear Algebra & Fourier Analysis', 'MAT-102');
        END LOOP;
    END LOOP;

    -- ============================================================================================
    -- BATCH 45 (3rd Semester)
    -- ============================================================================================
    FOR batch_rec IN SELECT id FROM batches WHERE faculty_id = dept_id AND name = '45' LOOP
        FOR section_rec IN SELECT id FROM sections WHERE batch_id = batch_rec.id LOOP
            INSERT INTO subjects (id, section_id, name, code) VALUES
            (gen_random_uuid(), section_rec.id, 'Data Structure', 'DS'),
            (gen_random_uuid(), section_rec.id, 'Data Structure Lab', 'DS-LAB'),
            (gen_random_uuid(), section_rec.id, 'Software Development Capstone Project', 'SDCP'),
            (gen_random_uuid(), section_rec.id, 'Object Oriented Concepts', 'OOC'),
            (gen_random_uuid(), section_rec.id, 'Computer Architecture', 'CA'),
            (gen_random_uuid(), section_rec.id, 'Probability & Statistics in Software Engineering', 'PSSE'),
            (gen_random_uuid(), section_rec.id, 'Bangladesh Studies', 'BDS');  -- Assuming it's here too per list, though duplicate implies retake or curriculum diff
        END LOOP;
    END LOOP;

    -- ============================================================================================
    -- BATCH 44 (4th Semester)
    -- ============================================================================================
    FOR batch_rec IN SELECT id FROM batches WHERE faculty_id = dept_id AND name = '44' LOOP
        FOR section_rec IN SELECT id FROM sections WHERE batch_id = batch_rec.id LOOP
            INSERT INTO subjects (id, section_id, name, code) VALUES
            (gen_random_uuid(), section_rec.id, 'Algorithms Design & Analysis', 'ADA'),
            (gen_random_uuid(), section_rec.id, 'Algorithms Design & Analysis Lab', 'ADA-LAB'),
            (gen_random_uuid(), section_rec.id, 'Object Oriented Design', 'OOD'),
            (gen_random_uuid(), section_rec.id, 'Database System', 'DBS'),
            (gen_random_uuid(), section_rec.id, 'Database System Lab', 'DBS-LAB'),
            (gen_random_uuid(), section_rec.id, 'Operating System & System Programming', 'OSSP'),
            (gen_random_uuid(), section_rec.id, 'Operating System & System Programming Lab', 'OSSP-LAB'),
            (gen_random_uuid(), section_rec.id, 'Principles of Accounting, Business & Economics', 'PABE'),
            (gen_random_uuid(), section_rec.id, 'Introduction to Robotics (Guided Elective I)', 'ROBO1');
        END LOOP;
    END LOOP;

    -- ============================================================================================
    -- BATCH 43 (5th Semester)
    -- ============================================================================================
    FOR batch_rec IN SELECT id FROM batches WHERE faculty_id = dept_id AND name = '43' LOOP
        FOR section_rec IN SELECT id FROM sections WHERE batch_id = batch_rec.id LOOP
            INSERT INTO subjects (id, section_id, name, code) VALUES
            (gen_random_uuid(), section_rec.id, 'Data Communication & Computer Networking', 'DCCN'),
            (gen_random_uuid(), section_rec.id, 'Data Communication & Computer Networking Lab', 'DCCN-LAB'),
            (gen_random_uuid(), section_rec.id, 'System Analysis & Design Capstone Project', 'SADCP'),
            (gen_random_uuid(), section_rec.id, 'Theory of Computing', 'TOC'),
            (gen_random_uuid(), section_rec.id, 'Design Pattern', 'DP'),
            (gen_random_uuid(), section_rec.id, 'Software Quality Assurance & Testing', 'SQAT'),
            (gen_random_uuid(), section_rec.id, 'Software Quality Assurance & Testing Lab', 'SQAT-LAB'),
            (gen_random_uuid(), section_rec.id, 'Business Analysis & Communication', 'BAC');
        END LOOP;
    END LOOP;

    -- ============================================================================================
    -- BATCH 42 (6th Semester)
    -- ============================================================================================
    FOR batch_rec IN SELECT id FROM batches WHERE faculty_id = dept_id AND name = '42' LOOP
        FOR section_rec IN SELECT id FROM sections WHERE batch_id = batch_rec.id LOOP
            INSERT INTO subjects (id, section_id, name, code) VALUES
            (gen_random_uuid(), section_rec.id, 'Software Engineering Web Application', 'SEWA'),
            (gen_random_uuid(), section_rec.id, 'Software Engineering Web Application Lab', 'SEWA-LAB'),
            (gen_random_uuid(), section_rec.id, 'Software Architecture & Design', 'SAD'),
            (gen_random_uuid(), section_rec.id, 'Information System Security', 'ISS'),
            (gen_random_uuid(), section_rec.id, 'Software Project Management & Documentation', 'SPMD'),
            (gen_random_uuid(), section_rec.id, 'Artificial Intelligence', 'AI'),
            (gen_random_uuid(), section_rec.id, 'Artificial Intelligence Lab', 'AI-LAB'),
            (gen_random_uuid(), section_rec.id, 'Introduction to Machine Learning (Guided Elective II)', 'ML');
        END LOOP;
    END LOOP;

    -- ============================================================================================
    -- BATCH 41 (7th Semester)
    -- ============================================================================================
    FOR batch_rec IN SELECT id FROM batches WHERE faculty_id = dept_id AND name = '41' LOOP
        FOR section_rec IN SELECT id FROM sections WHERE batch_id = batch_rec.id LOOP
            INSERT INTO subjects (id, section_id, name, code) VALUES
            (gen_random_uuid(), section_rec.id, 'Software Engineering Design Capstone Project', 'SEDCP'),
            (gen_random_uuid(), section_rec.id, 'Employability 360 (Non-Major)', 'EMP360'),
            (gen_random_uuid(), section_rec.id, 'Research Methodology & Scientific Writing', 'RMSW'),
            (gen_random_uuid(), section_rec.id, 'Management Information System', 'MIS'),
            (gen_random_uuid(), section_rec.id, 'Data Warehouse & Data Mining', 'DWDM'),
            (gen_random_uuid(), section_rec.id, 'Final Year Project / Thesis / Internship', 'FYP');
        END LOOP;
    END LOOP;

    -- ============================================================================================
    -- BATCH 40 (8th Semester)
    -- ============================================================================================
    FOR batch_rec IN SELECT id FROM batches WHERE faculty_id = dept_id AND name = '40' LOOP
        FOR section_rec IN SELECT id FROM sections WHERE batch_id = batch_rec.id LOOP
            INSERT INTO subjects (id, section_id, name, code) VALUES
            (gen_random_uuid(), section_rec.id, 'Guided Elective-IV (Non-Major)', 'GE-IV'),
            (gen_random_uuid(), section_rec.id, 'Software Engineering Professional Ethics', 'SEPE'),
            (gen_random_uuid(), section_rec.id, 'Numerical Analysis', 'NUM'),
            (gen_random_uuid(), section_rec.id, 'Human Computer Interaction', 'HCI');
        END LOOP;
    END LOOP;

     -- ============================================================================================
    -- BATCH 39-36 (Final Batches)
    -- ============================================================================================
    -- Adding to Batch 39, 38, 37, 36
    FOR batch_rec IN SELECT id FROM batches WHERE faculty_id = dept_id AND name IN ('39', '38', '37', '36') LOOP
        FOR section_rec IN SELECT id FROM sections WHERE batch_id = batch_rec.id LOOP
            INSERT INTO subjects (id, section_id, name, code) VALUES
            (gen_random_uuid(), section_rec.id, 'Major Electives', 'ME-ADV'),
            (gen_random_uuid(), section_rec.id, 'Advanced Robotics', 'ROBO-ADV'),
            (gen_random_uuid(), section_rec.id, 'Embedded Systems', 'ES'),
            (gen_random_uuid(), section_rec.id, 'Internship/Thesis continuation', 'THESIS-CONT'),
            (gen_random_uuid(), section_rec.id, 'Final Defense', 'DEFENSE');
        END LOOP;
    END LOOP;

END $$;
