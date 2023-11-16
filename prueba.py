import requests
import bs4

page = requests.get("https://gogoanime.dev/category/jujutsu-kaisen-tv-dub")
parse = bs4.BeautifulSoup(page.content, 'html.parser')
links = parse.select('.anime_info_body_bg > img')
print(links)