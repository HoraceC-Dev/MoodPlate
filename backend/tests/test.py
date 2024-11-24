import requests

def test_receive_data():
    url = 'http://localhost:8000/journals'  # Replace with your server's URL if different
    payload = {
        "id": str(1),
        "name": "Daily Thoughts",
        "content": "Today I learned about testing in FastAPI.",
        "recommendation": "Keep up the good work!"
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raises an HTTPError if the HTTP request returned an unsuccessful status code
        print('Status Code:', response.status_code)
        print('Response JSON:', response.json())
    except requests.exceptions.RequestException as e:
        print('Request failed:', e)
    

def test_udpate():
    url = 'http://localhost:8000/journals/update'  # Replace with your server's URL if different
    payload = {
        "id": str(1),
        "name": "Daily",
        "content": "Today I learned about testing in FastAPI.",
        "recommendation": "Keep up the good work!"
    }
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raises an HTTPError if the HTTP request returned an unsuccessful status code
        print('Status Code:', response.status_code)
        print('Response JSON:', response.json())
    except requests.exceptions.RequestException as e:
        print('Request failed:', e)

def test_delete():
    url = f'http://localhost:8000/journals/{str(1)}'  # Replace with your server's URL if different
    payload = {
        "id": str(1),
        "name": "Daily",
        "content": "Today I learned about testing in FastAPI.",
        "recommendation": "Keep up the good work!"
    }
    
    try:
        response = requests.delete(url)
        response.raise_for_status()  # Raises an HTTPError if the HTTP request returned an unsuccessful status code
        print('Status Code:', response.status_code)
        print('Response JSON:', response.json())
    except requests.exceptions.RequestException as e:
        print('Request failed:', e)


if __name__ == "__main__":
    # test_receive_data()
    # test_udpate()
    test_delete()
