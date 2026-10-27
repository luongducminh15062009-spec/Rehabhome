-- Optional: append a Sources section into article content in Supabase.
-- App already shows citations in UI via src/utils/article-sources.ts even without this.
-- Run in Supabase SQL Editor if you want sources embedded in content as well.

UPDATE public.articles
SET content = content || E'\n\n## Nguồn tham khảo\n- Murphy et al. – 100% Fruit juice and glucose control (meta-analysis of RCTs) — https://pubmed.ncbi.nlm.nih.gov/28620480/\n- American Diabetes Association – Nutrition therapy — https://diabetesjournals.org/care/article/42/5/731/40480/\n- Harvard T.H. Chan – Sugary drinks — https://www.hsph.harvard.edu/nutritionsource/healthy-drinks/sugary-drinks/\n- WHO – Healthy diet — https://www.who.int/news-room/fact-sheets/detail/healthy-diet'
WHERE title = 'Uống nước ép trái cây thế nào để không tăng đường huyết?'
  AND content NOT ILIKE '%Nguồn tham khảo%';

UPDATE public.articles
SET content = content || E'\n\n## Nguồn tham khảo\n- Harvard T.H. Chan – Whole grains — https://www.hsph.harvard.edu/nutritionsource/what-should-you-eat/whole-grains/\n- WHO – Carbohydrate intake — https://www.who.int/publications/i/item/9789240073593\n- WHO – Healthy diet — https://www.who.int/news-room/fact-sheets/detail/healthy-diet'
WHERE title = 'Gạo lứt có thực sự tốt hơn gạo trắng để giảm cân?'
  AND content NOT ILIKE '%Nguồn tham khảo%';

UPDATE public.articles
SET content = content || E'\n\n## Nguồn tham khảo\n- NIH NCCIH – Probiotics — https://www.nccih.nih.gov/health/probiotics-what-you-need-to-know\n- Harvard Health – Gut-brain connection — https://www.health.harvard.edu/diseases-and-conditions/the-gut-brain-connection\n- WHO – Healthy diet — https://www.who.int/news-room/fact-sheets/detail/healthy-diet'
WHERE title = '5 Thói Quen Hằng Ngày Giúp Cải Thiện Sức Khỏe Đường Ruột Của Bạn'
  AND content NOT ILIKE '%Nguồn tham khảo%';

UPDATE public.articles
SET content = content || E'\n\n## Nguồn tham khảo\n- WHO – Cardiovascular diseases — https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)\n- American Heart Association – Healthy living — https://www.heart.org/en/healthy-living\n- WHO – Healthy diet — https://www.who.int/news-room/fact-sheets/detail/healthy-diet'
WHERE title = 'Phòng ngừa bệnh tim mạch: lối sống và chế độ ăn phù hợp'
  AND content NOT ILIKE '%Nguồn tham khảo%';

UPDATE public.articles
SET content = content || E'\n\n## Nguồn tham khảo\n- NIH Bones – Calcium and vitamin D — https://www.bones.nih.gov/health-info/bone/bone-health/nutrition\n- WHO – Healthy diet — https://www.who.int/news-room/fact-sheets/detail/healthy-diet'
WHERE title = '5 nhóm thực phẩm cần tránh khi bị loãng xương'
  AND content NOT ILIKE '%Nguồn tham khảo%';

UPDATE public.articles
SET content = content || E'\n\n## Nguồn tham khảo\n- NIH NCCIH – Turmeric — https://www.nccih.nih.gov/health/turmeric\n- PubMed – Curcumin review — https://pubmed.ncbi.nlm.nih.gov/29065496/\n- WHO – Healthy diet — https://www.who.int/news-room/fact-sheets/detail/healthy-diet'
WHERE title = 'Thêm nước nghệ vào mỗi sáng: Cơ thể nhận được gì?'
  AND content NOT ILIKE '%Nguồn tham khảo%';

UPDATE public.articles
SET content = content || E'\n\n## Nguồn tham khảo\n- Harvard Health – Collagen supplements — https://www.health.harvard.edu/blog/considering-collagen-drinks-and-supplements-202305222933\n- WHO – Healthy diet — https://www.who.int/news-room/fact-sheets/detail/healthy-diet'
WHERE title ILIKE '%collagen%'
  AND content NOT ILIKE '%Nguồn tham khảo%';

UPDATE public.articles
SET content = content || E'\n\n## Nguồn tham khảo\n- NIH NCCIH – Detoxes and cleanses — https://www.nccih.nih.gov/health/detoxes-and-cleanses-what-you-need-to-know\n- Harvard Health – The dubious practice of detox — https://www.health.harvard.edu/staying-healthy/the-dubious-practice-of-detox\n- WHO – Healthy diet — https://www.who.int/news-room/fact-sheets/detail/healthy-diet'
WHERE title ILIKE '%Giải độc%'
  AND content NOT ILIKE '%Nguồn tham khảo%';

UPDATE public.articles
SET content = content || E'\n\n## Nguồn tham khảo\n- Harvard T.H. Chan – Protein — https://www.hsph.harvard.edu/nutritionsource/what-should-you-eat/protein/\n- WHO – Healthy diet — https://www.who.int/news-room/fact-sheets/detail/healthy-diet'
WHERE title ILIKE '%trứng luộc%'
  AND content NOT ILIKE '%Nguồn tham khảo%';

UPDATE public.articles
SET content = content || E'\n\n## Nguồn tham khảo\n- CDC – Tips for better sleep — https://www.cdc.gov/sleep/about/index.html\n- NIH – Sleep deprivation — https://www.nhlbi.nih.gov/health/sleep-deprivation\n- WHO – Healthy diet — https://www.who.int/news-room/fact-sheets/detail/healthy-diet'
WHERE title ILIKE '%buồn ngủ%'
  AND content NOT ILIKE '%Nguồn tham khảo%';

-- Fallback for any remaining health articles without a sources block
UPDATE public.articles
SET content = content || E'\n\n## Nguồn tham khảo\n- WHO – Healthy diet — https://www.who.int/news-room/fact-sheets/detail/healthy-diet\n- CDC – Nutrition — https://www.cdc.gov/nutrition/index.html\n- American Heart Association – Healthy eating — https://www.heart.org/en/healthy-living/healthy-eating'
WHERE content NOT ILIKE '%Nguồn tham khảo%';
