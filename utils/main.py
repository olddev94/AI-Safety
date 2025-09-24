def deduplicate_articles(articles):
    seen_titles = set()
    seen_descriptions = set()
    res = []
    for row in articles:
        title, description = row.get("title"), row.get("description")
        if title in seen_titles or description in seen_descriptions:
            pass
        else:
            seen_titles.add(title)
            seen_descriptions.add(description)
            res.append(row)
    return res
