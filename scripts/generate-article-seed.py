#!/usr/bin/env python3
"""Fetch public Notion health articles and generate supabase/seed_articles_simple.sql"""

from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "supabase" / "seed_articles_simple.sql"

ARTICLES = [
    {
        "page_id": "351cf8217744801aa883e2f3336b4709",
        "category": "cooking_tips",
    },
    {
        "page_id": "351cf8217744806b8682d38c8f593499",
        "category": "nutrition",
    },
    {
        "page_id": "351cf8217744808d8d89e06ff0647c88",
        "category": "home_workout",
    },
    {
        "page_id": "351cf821774480a79e97ea0a689fa7e8",
        "category": "home_workout",
    },
    {
        "page_id": "351cf821774480f99a5cc530ef74a13d",
        "category": "cooking_tips",
    },
    {
        "page_id": "351cf8217744808bb4d8c978ffec0f7c",
        "category": "nutrition",
    },
    {
        "page_id": "351cf821774480e2a469caed27143148",
        "category": "nutrition",
    },
    {
        "page_id": "351cf821774480a7a0d0cb9bd574a93d",
        "category": "cooking_tips",
    },
    {
        "page_id": "351cf821774480e8840cc53050fefee7",
        "category": "nutrition",
    },
    {
        "page_id": "351cf8217744801790f7d6fe2760c813",
        "category": "home_workout",
    },
]

HEADING_MAP = {
    "header": "## ",
    "sub_header": "## ",
    "sub_sub_header": "### ",
}


def to_uuid(page_id: str) -> str:
    p = page_id.replace("-", "")
    return f"{p[:8]}-{p[8:12]}-{p[12:16]}-{p[16:20]}-{p[20:]}"


def fetch_page(page_id: str) -> dict:
    uuid = to_uuid(page_id)
    body = json.dumps(
        {
            "pageId": uuid,
            "limit": 100,
            "cursor": {"stack": []},
            "chunkNumber": 0,
            "verticalColumns": False,
        }
    ).encode()
    req = urllib.request.Request(
        "https://www.notion.so/api/v3/loadPageChunk",
        data=body,
        headers={
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as response:
        return json.load(response)


def get_block_value(block_entry: dict) -> dict:
    value = block_entry.get("value", {})
    if isinstance(value, dict) and "value" in value:
        value = value["value"]
    return value if isinstance(value, dict) else {}


def rich_to_text(parts) -> str:
    if not parts:
        return ""
    chunks: list[str] = []
    for segment in parts:
        if isinstance(segment, str):
            chunks.append(segment)
        elif isinstance(segment, list) and segment:
            chunks.append(str(segment[0]))
    return "".join(chunks).strip()


def block_text(block: dict) -> str:
    props = block.get("properties") or {}
    for key in ("title", "caption", "source"):
        text = rich_to_text(props.get(key))
        if text:
            return text
    return ""


def render_blocks(block_ids: list[str], blocks: dict) -> list[str]:
    lines: list[str] = []
    for block_id in block_ids:
        entry = blocks.get(block_id)
        if not entry:
            continue
        block = get_block_value(entry)
        block_type = block.get("type")
        text = block_text(block)

        if block_type in HEADING_MAP and text:
            lines.append(f"{HEADING_MAP[block_type]}{text}")
        elif block_type == "bulleted_list" and text:
            lines.append(f"- {text}")
        elif block_type == "numbered_list" and text:
            lines.append(f"- {text}")
        elif block_type == "text" and text:
            lines.append(text)
        elif block_type == "callout" and text:
            lines.append(text)
        elif block_type == "quote" and text:
            lines.append(text)

        children = block.get("content") or []
        if children:
            lines.extend(render_blocks(children, blocks))

    return lines


def parse_article(page_id: str) -> dict:
    data = fetch_page(page_id)
    blocks = data["recordMap"]["block"]
    page_uuid = to_uuid(page_id)
    page = get_block_value(blocks[page_uuid])

    title = rich_to_text((page.get("properties") or {}).get("title")) or "Bài viết"
    image_url = (page.get("format") or {}).get("page_cover") or ""
    content_lines = render_blocks(page.get("content") or [], blocks)
    content = "\n\n".join(line for line in content_lines if line.strip())

    return {
        "title": title,
        "content": content,
        "image_url": image_url,
    }


def sql_escape(value: str) -> str:
    return value.replace("'", "''")


def build_sql(articles: list[dict]) -> str:
    rows: list[str] = []
    for article in articles:
        rows.append(
            "(\n"
            f"  '{sql_escape(article['title'])}',\n"
            f"  '{sql_escape(article['content'])}',\n"
            f"  '{article['category']}',\n"
            f"  '{sql_escape(article['image_url'])}'\n"
            ")"
        )

    return f"""-- Seed Articles từ Notion: 10 bài blog Sức khoẻ
-- Chạy trong Supabase SQL Editor để thay thế toàn bộ dữ liệu blog cũ
-- Generate: python3 scripts/generate-article-seed.py

DELETE FROM public.saved_articles;
DELETE FROM public.articles;

INSERT INTO public.articles (title, content, category, image_url) VALUES
{',\n'.join(rows)};

SELECT category, COUNT(*) AS total FROM public.articles GROUP BY category ORDER BY category;
"""


def main() -> None:
    seeded: list[dict] = []
    for meta in ARTICLES:
        parsed = parse_article(meta["page_id"])
        parsed["category"] = meta["category"]
        seeded.append(parsed)
        print(f"OK: {parsed['title'][:60]}... ({len(parsed['content'])} chars)")

    OUTPUT.write_text(build_sql(seeded), encoding="utf-8")
    print(f"\nWrote {OUTPUT}")


if __name__ == "__main__":
    main()
