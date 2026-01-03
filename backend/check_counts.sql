-- DIAGNOTIC: COUNT SECTIONS PER BATCH
SELECT 
    b.name as batch_name,
    COUNT(s.id) as section_count,
    COUNT(sub.id) as subject_count
FROM batches b
LEFT JOIN sections s ON b.id = s.batch_id
LEFT JOIN subjects sub ON s.id = sub.section_id
JOIN faculties f ON b.faculty_id = f.id
WHERE f.name ILIKE '%Software Engineering%' OR f.name = 'SWE'
GROUP BY b.name
ORDER BY b.name;
