import bs4
import request

x = request  ... "url"

soup = bs4(x)

bo = soup.body

bo.findAll('a' or "href")

for z in bo
    z.replace()
