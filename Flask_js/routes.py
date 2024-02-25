from Flask_js import app
from flask import redirect, render_template, jsonify, request
from Flask_js.utils.utils import VERSION
from Flask_js.models import *
from http import HTTPStatus
import sqlite3


@app.route("/")
def route_main():
    return render_template("main.html")
    

@app.route(f"/api/{VERSION}/movimientos")
def route_movimientos():
    try:
        records = get_records()
        return jsonify(
            {
                "status": "success",
                "data": records
            }
        ), HTTPStatus.OK
    except sqlite3.Error:
        return jsonify(
            {
                "status": "fail",
                "mensaje": str(sqlite3.Error)
            }
        ), HTTPStatus.BAD_REQUEST
    

@app.route(f"/api/{VERSION}/status")
def route_status():
    try:
        balance = get_status()

        return jsonify(
            {
                "status": "success",
                "data": balance
            }
        ), HTTPStatus.OK
    except sqlite3.Error:
        return jsonify(
            {
                "status": "fail",
                "mensaje": str(sqlite3.Error)
            }
        ), HTTPStatus.BAD_REQUEST
    
@app.route(f"/api/{VERSION}/tasa/<string:moneda_from>/<string:moneda_to>")
def route_tasa(moneda_from, moneda_to):
    rate = get_rate(moneda_from, moneda_to)

    if rate != "":
        return jsonify(
            {
                "status": "success",
                "rate": rate,
                "monedas": [moneda_from, moneda_to]
            }
        ), HTTPStatus.CREATED
    else:
        return jsonify(
            {
                "status": "fail",
                "mensaje": str(sqlite3.Error)
            }
        ), HTTPStatus.BAD_REQUEST

# Ruta para guardar un registro.
@app.route(f"/api/{VERSION}/movimiento", methods=["POST"])
def route_movimiento():
    data = request.json

    try:
        post_record([data['fecha'], data['hora'], data['from_moneda'], data['from_cantidad'], data['to_moneda'], data['to_cantidad']])
        return jsonify(
                {
                    "status": "success",
                    "monedas": [data['from_moneda'], data['to_moneda']]
                }
            ), HTTPStatus.CREATED
        
    except sqlite3.Error:
        return jsonify(
            {
                "status": "fail",
                "mensaje": str(sqlite3.Error)
            }
        ), HTTPStatus.BAD_REQUEST