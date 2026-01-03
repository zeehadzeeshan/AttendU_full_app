-- =================================================================
-- DIAGNOSTIC QUERY
-- Run this in your Supabase SQL Editor to see exactly what is stored.
-- =================================================================

SELECT 
    sub.name AS subject_name,
    sub.code AS subject_code,
    sec.name AS section_name,
    bat.name AS batch_name,
    fac.name AS department_name
FROM subjects sub
JOIN sections sec ON sub.section_id = sec.id
JOIN batches bat ON sec.batch_id = bat.id
JOIN faculties fac ON bat.faculty_id = fac.id
WHERE fac.name ILIKE '%Software Engineering%' OR fac.name = 'SWE'
ORDER BY bat.name, sec.name, sub.name;

-- =================================================================
-- IF batch_name shows "random" (like UUIDs), then your Batch Data is corrupt.
-- IF subject_name shows "random", then the Insert script failed.
-- =================================================================
