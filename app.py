from flask import Flask, request, render_template
import requests

app = Flask(__name__)

API_KEY = '2d0bd1e3aaa5ba738d0a8499dfc47b13'  # Your OpenWeatherMap API key

@app.route('/', methods=['GET', 'POST'])
def index():
    weather = None
    error = None

    if request.method == 'POST':
        city = request.form['city']
        if city:
            url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric'
            response = requests.get(url)
            data = response.json()

            if response.status_code == 200:
                weather = {
                    'city': data['name'],
                    'temp': data['main']['temp'],
                    'desc': data['weather'][0]['description'],
                    'humidity': data['main']['humidity']
                }
            else:
                error = data.get('message', 'City not found.')

    return render_template('index.html', weather=weather, error=error)

if __name__ == '__main__':
    app.run(debug=True)
