import json
import os
import sys
import time
import uuid
import hashlib
from flask import Flask, Response, request

app = Flask(__name__, static_url_path='', static_folder='public')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))

@app.route('/sos', methods=['GET', 'POST'])
def sos_stream_handler():

    with open('sosStream.json', 'r') as file:
        sos_list = json.loads(file.read())

    if request.method == 'POST':
        new_sos = request.form.to_dict()
        new_sos['user_uuid'] = uuid.uuid4()
        new_sos['sos_uuid'] = hashlib.sha256(new_sos['user_uuid']).hexdigest()
        sos_list.append(new_sos)

        with open('sosStream.json', 'w') as file:
            file.write(json.dumps(sos_list, indent=4, separators=(',', ': ')))

    return Response(json.dumps(sos_list), mimetype='application/json', headers={'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*'})

@app.route('/sos/<string:sos_uuid>', methods=['GET'])
def sos_handler(sos_uuid):
    location = 'sos_' + sos_uuid + '.json'
    with open(location, 'r') as file:
        json_data = json.loads(file.read())
    print json_data
    return Response(json.dumps(json_data), mimetype='application/json', headers={'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*'})

if __name__ == '__main__':
    app.run(port=int(os.environ.get("PORT", 9000)))

