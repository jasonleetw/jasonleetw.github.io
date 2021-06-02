# coding=UTF-8

from datetime import datetime
from urllib import request
import json
import ssl


fp = open("daily_reports_vaccine_city.js", "w", encoding='utf-8')
fp.write('var data_4 = [')

url = 'https://covid-19.nchc.org.tw/myDT_staff.php?TB_name=csse_covid_19_daily_reports_vaccine_city_c&limitColumn=id&limitValue=0&equalValue=!=&encodeKey=MTYyMjU3OTYwNA==&c[]=id&t[]=int&d[]=NO&c[]=a01&t[]=date&d[]=NO&c[]=a02&t[]=varchar&d[]=NO&c[]=a03&t[]=int&d[]=NO&c[]=a04&t[]=int&d[]=YES&c[]=a05&t[]=int&d[]=YES&c[]=a06&t[]=int&d[]=YES&c[]=a07&t[]=decimal&d[]=YES&c[]=a08&t[]=varchar&d[]=NO&c[]=a09&t[]=decimal&d[]=NO'

context = ssl._create_unverified_context()
with request.urlopen(url, context=context) as jsondata:
    data = json.loads(jsondata.read().decode())
rows = sorted(data['data'], key=lambda d: d['a01'], reverse=True)
for row in rows:
    # x = datetime.strptime(row['a02'], '%Y-%m-%d')
    # if x < datetime.strptime("2021-05-14", "%Y-%m-%d"):
    #     continue
    # fp.write("{{year: '{}',Confirmed:{}, Deaths:{}, Recovered:{}, Active: {}, }},".format(
    #     datetime.strftime(x, "%m/%d"), row['a03'], row['a04'], row['a05'], row['a06']))
    fp.write("{{1: '{}',2:{}, 3:{}, 4:{}, 5: {}, 6: {}, 7: {}, 8: {}, 9: {},}},\n".format(
        row['a01'], row['a02'], row['a03'], row['a04'], row['a05'], row['a06'], row['a07'], row['a08'], row['a09']))

# fp = open("result.js", "w", encoding='utf-8')
# fp.write('var data_3 = [')

# url = 'https://covid-19.nchc.org.tw/myDT_staff.php?TB_name=csse_covid_19_daily_reports_country&limitColumn=a01&limitValue=TW/%&equalValue=+like+&encodeKey=MTYyMjUwNDY5NQ==&c[]=id&t[]=int&d[]=NO&c[]=a01&t[]=varchar&d[]=NO&c[]=a02&t[]=date&d[]=NO&c[]=a03&t[]=int&d[]=NO&c[]=a04&t[]=int&d[]=NO&c[]=a05&t[]=int&d[]=NO&c[]=a06&t[]=int&d[]=NO&c[]=a07&t[]=decimal&d[]=NO&c[]=a08&t[]=decimal&d[]=NO&c[]=a09&t[]=decimal&d[]=NO&c[]=a10&t[]=decimal&d[]=NO&c[]=a11&t[]=decimal&d[]=NO'

# context = ssl._create_unverified_context()
# with request.urlopen(url, context=context) as jsondata:
#     data = json.loads(jsondata.read().decode())
# rows = sorted(data['data'], key=lambda d: d['a02'])
# for row in rows:
#     x = datetime.strptime(row['a02'], '%Y-%m-%d')
#     if x < datetime.strptime("2021-05-14", "%Y-%m-%d"):
#         continue
#     fp.write("{{year: '{}',Confirmed:{}, Deaths:{}, Recovered:{}, Active: {}, }},".format(
#         datetime.strftime(x, "%m/%d"), row['a03'], row['a04'], row['a05'], row['a06']))

fp.write('];\n')
fp.close()


# import urllib.request
# import json
# import ssl

# fp = open("result.csv", "w", encoding='utf-8')

# url = 'https://opendata.cwb.gov.tw/fileapi/v1/opendataapi/O-A0001-001?Authorization=rdec-key-123-45678-011121314&format=JSON'
# context = ssl._create_unverified_context()
# with urllib.request.urlopen(url, context=context) as jsondata:
#     data = json.loads(jsondata.read().decode())
# data = data['cwbopendata']

# for d in data['location']:
#     fp.write("{},{}\n".format(d['stationId'], d['locationName']))

# fp.close()


# import csv
# from datetime import datetime
# import time

# fp = open("result.js", "w", encoding='utf-8')
# fp.write('var data_3 = [')

# # 開啟 CSV 檔案
# with open('csse_covid_19_daily_reports_country.csv', newline='', encoding='utf-8') as csvfile:

# #   # 讀取 CSV 檔案內容
# #   rows = csv.reader(csvfile)
#     rows = csv.DictReader(csvfile)

#     # 以迴圈輸出指定欄位
#     for row in sorted(rows, key=lambda d: d['檢核日期'])  :
#         x = datetime.strptime(row['檢核日期'], '%Y-%m-%d')
#         fp.write("{{year: '{}',Confirmed:{}, Deaths:{}, Recovered:{}, Active: {}}},".format(datetime.strftime(x,"%m/%d"), row['死亡數'], row['死亡數'], row['解除隔離數'], row['隔離中人數']))

# fp.write('];\n')
# fp.close()
