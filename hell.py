import bs4
# import request

import requests

    r = requests.get('http://www.londongardensonline.org.uk/select-borough-results.php?Borough=Tower%20Hamlets')
    r.text
    console.log(r.text)

# x = request  ... "url"
#
# soup = bs4(x)
#
# bo = soup.body
#
# bo.findAll('a' or "href")
#
# for z in bo
#     z.replace()
