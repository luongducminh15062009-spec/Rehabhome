export type ArticleSource = {
  title: string
  url: string
}

/** Default authoritative sources shown on every health article (Guideline 1.4.1). */
export const DEFAULT_HEALTH_SOURCES: ArticleSource[] = [
  {
    title: 'WHO – Healthy diet',
    url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
  },
  {
    title: 'CDC – Nutrition basics',
    url: 'https://www.cdc.gov/nutrition/index.html',
  },
  {
    title: 'American Heart Association – Healthy eating',
    url: 'https://www.heart.org/en/healthy-living/healthy-eating',
  },
]

/** Extra citations keyed by exact article title (Vietnamese). */
const TITLE_SOURCES: Record<string, ArticleSource[]> = {
  'Uống nước ép trái cây thế nào để không tăng đường huyết?': [
    {
      title:
        'Murphy et al. – 100% Fruit juice and glucose control: systematic review & meta-analysis of RCTs (PubMed)',
      url: 'https://pubmed.ncbi.nlm.nih.gov/28620480/',
    },
    {
      title: 'American Diabetes Association – Nutrition therapy for adults with diabetes',
      url: 'https://diabetesjournals.org/care/article/42/5/731/40480/',
    },
    {
      title: 'Harvard T.H. Chan – Sugary drinks and diabetes risk',
      url: 'https://www.hsph.harvard.edu/nutritionsource/healthy-drinks/sugary-drinks/',
    },
  ],
  'Gạo lứt có thực sự tốt hơn gạo trắng để giảm cân?': [
    {
      title: 'Harvard T.H. Chan – Whole grains',
      url: 'https://www.hsph.harvard.edu/nutritionsource/what-should-you-eat/whole-grains/',
    },
    {
      title: 'WHO – Carbohydrate intake for adults and children',
      url: 'https://www.who.int/publications/i/item/9789240073593',
    },
  ],
  '5 Thói Quen Hằng Ngày Giúp Cải Thiện Sức Khỏe Đường Ruột Của Bạn': [
    {
      title: 'NIH – Probiotics: What you need to know',
      url: 'https://www.nccih.nih.gov/health/probiotics-what-you-need-to-know',
    },
    {
      title: 'Harvard Health – The gut-brain connection',
      url: 'https://www.health.harvard.edu/diseases-and-conditions/the-gut-brain-connection',
    },
  ],
  'Phòng ngừa bệnh tim mạch: lối sống và chế độ ăn phù hợp': [
    {
      title: 'WHO – Cardiovascular diseases (CVDs)',
      url: 'https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)',
    },
    {
      title: 'American Heart Association – Prevention',
      url: 'https://www.heart.org/en/healthy-living',
    },
  ],
  '5 nhóm thực phẩm cần tránh khi bị loãng xương': [
    {
      title: 'NIH Osteoporosis and Related Bone Diseases – Calcium and vitamin D',
      url: 'https://www.bones.nih.gov/health-info/bone/bone-health/nutrition',
    },
    {
      title: 'WHO – Calcium',
      url: 'https://www.who.int/tools/elena/interventions/calcium-pregnant',
    },
  ],
  'Thêm nước nghệ vào mỗi sáng: Cơ thể nhận được gì?': [
    {
      title: 'NIH NCCIH – Turmeric',
      url: 'https://www.nccih.nih.gov/health/turmeric',
    },
    {
      title: 'PubMed – Curcumin: A review of its effects on human health',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29065496/',
    },
  ],
  'Sự thật về collagen thực vật': [
    {
      title: 'Harvard Health – Collagen supplements',
      url: 'https://www.health.harvard.edu/blog/considering-collagen-drinks-and-supplements-202305222933',
    },
  ],
  'Giải độc, thanh lọc cơ thể hiểu thế nào cho đúng?': [
    {
      title: 'NIH NCCIH – “Detoxes” and “Cleanses”',
      url: 'https://www.nccih.nih.gov/health/detoxes-and-cleanses-what-you-need-to-know',
    },
    {
      title: 'Harvard Health – The dubious practice of detox',
      url: 'https://www.health.harvard.edu/staying-healthy/the-dubious-practice-of-detox',
    },
  ],
  'Buổi sáng nên ăn trứng luộc kèm với gì để giảm cân?': [
    {
      title: 'Harvard T.H. Chan – Protein',
      url: 'https://www.hsph.harvard.edu/nutritionsource/what-should-you-eat/protein/',
    },
  ],
  '8 cách hết buồn ngủ ngay lập tức mà không cần dùng thuốc': [
    {
      title: 'CDC – Tips for better sleep',
      url: 'https://www.cdc.gov/sleep/about/index.html',
    },
    {
      title: 'NIH – Sleep deprivation and deficiency',
      url: 'https://www.nhlbi.nih.gov/health/sleep-deprivation',
    },
  ],
}

/**
 * Parse optional "## Nguồn tham khảo" / "## Sources" block from markdown content.
 * Supports:
 * - Title — https://...
 * - Title: https://...
 * - [Title](https://...)
 * - https://... alone
 */
export function parseSourcesFromContent(content: string | null | undefined): ArticleSource[] {
  if (!content) return []

  const headingMatch = content.match(
    /##\s*(Nguồn tham khảo|Sources|References|Tài liệu tham khảo)\s*\n([\s\S]*?)(?=\n##\s|$)/i,
  )
  if (!headingMatch) return []

  const block = headingMatch[2]
  const sources: ArticleSource[] = []

  for (const rawLine of block.split('\n')) {
    const line = rawLine.replace(/^[-*]\s*/, '').trim()
    if (!line) continue

    const mdLink = line.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/)
    if (mdLink) {
      sources.push({ title: mdLink[1].trim(), url: mdLink[2].trim() })
      continue
    }

    const dashed = line.match(/^(.+?)\s*[—–:-]\s*(https?:\/\/\S+)/)
    if (dashed) {
      sources.push({ title: dashed[1].trim(), url: dashed[2].trim().replace(/[.,;)]+$/, '') })
      continue
    }

    const urlOnly = line.match(/^(https?:\/\/\S+)/)
    if (urlOnly) {
      sources.push({ title: urlOnly[1], url: urlOnly[1].replace(/[.,;)]+$/, '') })
    }
  }

  return sources
}

function dedupeSources(list: ArticleSource[]): ArticleSource[] {
  const seen = new Set<string>()
  return list.filter((item) => {
    const key = item.url.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/** Resolve citations for an article — content block + title map + defaults. */
export function getArticleSources(article: {
  title: string
  content: string | null
  category?: string | null
}): ArticleSource[] {
  const fromContent = parseSourcesFromContent(article.content)
  const fromTitle = TITLE_SOURCES[article.title] || []
  return dedupeSources([...fromContent, ...fromTitle, ...DEFAULT_HEALTH_SOURCES])
}
