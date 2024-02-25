let id = "";
let request_get_records = new XMLHttpRequest();
const VERSION = "v1";
const crypto_balance = new Map();
let request_get_status = new XMLHttpRequest();
let request_get_rate = new XMLHttpRequest();
let request_post_record = new XMLHttpRequest();


window.onload = function() {
    let current_url = window.location.href;
    let last_bar =  current_url.lastIndexOf("/");
    id = current_url.substring(last_bar+1, current_url.length);

    
    request_get_records.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/movimientos" , true);
    request_get_records.onload = get_records_handler;
    request_get_records.onerror = function() {
        show_alert(3, "Ha ocurrido un error al cargar los registros.");
    };
    request_get_records.send();

    
    request_get_status.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/status" , true);
    request_get_status.onload = get_status_handler;
    request_get_status.onerror = function() {
        show_alert(3, "Ha ocurrido un error al cargar el estado de la cuenta.");
    };
    request_get_status.send();

    
    let resumen = document.getElementById("li_resumen");
    resumen.addEventListener("click", show_resumen);

    
    let balance = document.getElementById("li_balance");
    balance.addEventListener("click", show_balance);

    
    let update = document.getElementById("span_update");
    update.addEventListener("click", get_status);

    
    let open = document.getElementById("button_open");
    open.addEventListener("click", show_form);

    
    let select_moneda_from = document.getElementById("select_moneda_from");
    select_moneda_from.addEventListener("change", reset_values);

    let select_moneda_to = document.getElementById("select_moneda_to");
    select_moneda_to.addEventListener("change", reset_values);

    let input_cantidad_from = document.getElementById("input_cantidad_from");
    input_cantidad_from.addEventListener("change", reset_values);

    
    let calculate = document.getElementById("span_calculate");
    calculate.addEventListener("click", get_rate);

    let close = document.getElementById("button_close");
    close.addEventListener("click", close_form);

    
    let save = document.getElementById("button_save");
    save.addEventListener("click", post_record);

    
    
   
}


function show_alert(num, message) {
    if(num === 1) {
        document.getElementById("alert_success").innerText = message;
        document.getElementById("alert_success").style.display = "inline-block";
        setTimeout(function() {
            document.getElementById("alert_success").style.display = "none";
        }, 3000);
    } else if(num === 2) {
        document.getElementById("alert_warning").innerText = message;
        document.getElementById("alert_warning").style.display = "inline-block";
        setTimeout(function() {
            document.getElementById("alert_warning").style.display = "none";
        }, 3000);
    } else if(num === 3) {
        document.getElementById("alert_danger").innerText = message;
        document.getElementById("alert_danger").style.display = "inline-block";
        setTimeout(function() {
            document.getElementById("alert_danger").style.display = "none";
        }, 3000);
    }
}


function hide_alert() {
        document.getElementById("alert_success").style.display = "none";
        document.getElementById("alert_warning").style.display = "none";
        document.getElementById("alert_danger").style.display = "none";
}


function get_records_handler() {
    
    if (this.readyState === 4) {        
        if (this.status === 200) {
            document.getElementById("table_records").innerHTML = "<tr><th>Fecha</th><th>Hora</th><th>From</th><th>Cantidad</th><th>To</th><th>Cantidad</th></tr>";

            const json_records = JSON.parse(this.responseText);
            const records = json_records.data;

    
            const table_records = document.getElementById("table_records");
            if(records.length === 1) {
                const row = document.createElement("tr");
    
                const cell_vacia = document.createElement("td");
                cell_vacia.style.minWidth = "270px";
                cell_vacia.style.fontWeight = "bold";
                cell_vacia.innerText = "No hay registros en la base de datos.";
                row.appendChild(cell_vacia);

                table_records.appendChild(row);
            } else {
                for(let i=0; i<records.length-1; i++) {
                    const row = document.createElement("tr");
    
                    const cell_date = document.createElement("td");
                    cell_date.innerText = records[i].date;
                    row.appendChild(cell_date);
    
                    const cell_time = document.createElement("td");
                    cell_time.innerText = records[i].time;
                    row.appendChild(cell_time);
    
                    const cell_moneda_from = document.createElement("td");
                    cell_moneda_from.innerText = records[i].moneda_from;
                    row.appendChild(cell_moneda_from);
    
                    const cell_cantidad_from = document.createElement("td");
                    if(records[i].moneda_from === "EUR") {
                        cell_cantidad_from.innerText = Math.round(records[i].cantidad_from * 100) / 100 + " €";
                    } else {
                        cell_cantidad_from.innerText = Math.round(records[i].cantidad_from * 100000000) / 100000000;
                    }
                    row.appendChild(cell_cantidad_from);
    
                    const cell_moneda_to = document.createElement("td");
                    cell_moneda_to.innerText = records[i].moneda_to;
                    row.appendChild(cell_moneda_to);
    
                    const cell_cantidad_to = document.createElement("td");
                    if(records[i].moneda_to === "EUR") {
                        cell_cantidad_to.innerText = Math.round(records[i].cantidad_to * 100) / 100 + " €";
                    } else {
                        cell_cantidad_to.innerText = Math.round(records[i].cantidad_to * 100000000) / 100000000;
                    }
                    row.appendChild(cell_cantidad_to);
    
                    table_records.appendChild(row);
                }
            }
            
            
            get_crypto_balance(records);

            document.getElementById("table_cryptos").innerHTML = "<tr><th>Crypto</th><th>Cantidad</th></tr>";
            const table_cryptos = document.getElementById("table_cryptos");

            for(let item of crypto_balance) {
                const row = document.createElement("tr");

                const cell_crypto = document.createElement("td");
                cell_crypto.innerText = item[0];
                row.appendChild(cell_crypto);

                const cell_cantidad = document.createElement("td");
                cell_cantidad.innerText = Math.round(item[1] * 100000000) / 100000000;
                row.appendChild(cell_cantidad);

                table_cryptos.appendChild(row);
            }
        } else {
            show_alert(3, "Ha ocurrido un error al cargar los registros.");
        }
    }
}


function get_crypto_balance(records) {
    crypto_balance.clear();
    crypto_balance.set("BTC", records[records.length-1].btc);
    crypto_balance.set("ETH", records[records.length-1].eth);
    crypto_balance.set("USDT", records[records.length-1].usdt);
    crypto_balance.set("BNB", records[records.length-1].bnb);
    crypto_balance.set("XRP", records[records.length-1].xrp);
    crypto_balance.set("ADA", records[records.length-1].ada);
    crypto_balance.set("SOL", records[records.length-1].sol);
    crypto_balance.set("DOT", records[records.length-1].dot);
    crypto_balance.set("MATIC", records[records.length-1].matic);
}


function get_status_handler() {
    if(this.readyState === 4) {
        if(this.status === 200) {
            const json_values = JSON.parse(this.responseText);
            const values = json_values.data;

            
            status_label_color(values.invertido, "label_invested");
            document.getElementById("label_invested").innerText = Math.round(values.invertido * 100) / 100 + " €";

            status_label_color(values.recuperado, "label_recovered");
            document.getElementById("label_recovered").innerText = Math.round(values.recuperado * 100) / 100 + " €";

            status_label_color(values.valor_compra, "label_purchase_value");
            document.getElementById("label_purchase_value").innerText = Math.round(values.valor_compra * 100) / 100 + " €";

            status_label_color(values.valor_actual, "label_current_value");
            document.getElementById("label_current_value").innerText = Math.round(values.valor_actual * 100) / 100 + " €";
        } else {
            show_alert(3, "Ha ocurrido un error al cargar el balance de la cuenta.");
        }
    }
}


function status_label_color(valor, label) {
    if(valor < 0) {
        document.getElementById(label).style.color = "red";
    } else {
        document.getElementById(label).style.color = "black";
    }
}


function show_resumen(event) {
    event.preventDefault();

    document.getElementById("li_resumen").style.cursor = "default";
    document.getElementById("li_resumen").style.pointerEvents = "none";
    document.getElementById("li_balance").style.cursor = "pointer";
    document.getElementById("li_balance").style.pointerEvents = "all";

    document.getElementById("div_balance").style.display = "none";
    document.getElementById("div_resumen").style.display = "block";
}


function show_balance(event) {
    event.preventDefault();

    document.getElementById("li_balance").style.cursor = "default";
    document.getElementById("li_balance").style.pointerEvents = "none";
    document.getElementById("li_resumen").style.cursor = "pointer";
    document.getElementById("li_resumen").style.pointerEvents = "all";

    document.getElementById("div_resumen").style.display = "none";
    document.getElementById("div_balance").style.display = "block";
}


function get_status(event) {
    event.preventDefault();

    request_get_status.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/status" , true);
    request_get_status.onload = get_status_handler;
    request_get_status.onerror = function() {
        show_alert(3, "Ha ocurrido un error al cargar el estado de la cuenta.");
    };
    request_get_status.send();
}


function show_form(event) {
    event.preventDefault();
    hide_alert();

    document.getElementById("button_open").style.display = "none";
    document.getElementById("form").style.display = "inline-block";
}


function reset_values(event) {
    event.preventDefault();

    document.getElementById("label_cantidad_to").innerText = "";
    document.getElementById("label_pu").innerText = "";
}


function get_rate(event) {
    event.preventDefault();
    hide_alert();

    const moneda_from = document.getElementById("select_moneda_from").value;
    const cantidad_from = document.getElementById("input_cantidad_from").value;

    
    if(! check_all(false, moneda_from, cantidad_from)) {
        return;
    }
    
    const moneda_to = document.getElementById("select_moneda_to").value;

    
    request_get_rate.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/tasa/" + moneda_from + "/" + moneda_to, true);
    request_get_rate.onload = get_rate_handler;
    request_get_rate.onerror = function() {
        show_alert(3, "Ha ocurrido un error al hacer la conversión.");
    };
    request_get_rate.send();
}


function check_all(bool, moneda_from, cantidad_from) {
    if(check_fields(bool) && check_balance(moneda_from, cantidad_from)) {
        return true;
    }

    return false;
}


function check_fields(bool) {
    const moneda_from = document.getElementById("select_moneda_from").value;
    if(moneda_from === "") {
        show_alert(2, "Debe seleccionar una moneda en \"From:\".");
        return false;
    }

    const moneda_to = document.getElementById("select_moneda_to").value;
    if(moneda_to === "") {
        show_alert(2, "Debe seleccionar una moneda en \"To:\".");
        return false;
    }

    if(moneda_from === moneda_to) {
        show_alert(2, "Las monedas \"From:\" y \"To:\" deben ser diferentes.");
        return false;
    }

    const cantidad_from = document.getElementById("input_cantidad_from").value;
    if(cantidad_from === "" || cantidad_from <= 0) {
        show_alert(2, "Debe introducir una cantidad.");
        return false;
    }

    if(bool) {
        const cantidad_to = document.getElementById("label_cantidad_to").innerText;
        const pu = document.getElementById("label_pu").innerText;

        if(cantidad_to === "" || pu === "") {
            show_alert(2, "Debe calcular el cambio de las monedas antes de realizar el registro.");
            return false;
        }
    }

    return true;
}


function check_balance(moneda_from, cantidad_from) {
    if(cantidad_from > crypto_balance.get(moneda_from)) {
        show_alert(2, "No tiene " + moneda_from + " suficiente para realizar esta operación.");
        return false;
    }

    return true;
}


function get_rate_handler() {
    if(this.readyState === 4) {
        if(this.status === 201) {
            const json_reponse = JSON.parse(this.responseText);

            document.getElementById("label_cantidad_to").innerText = json_reponse["rate"] * document.getElementById("input_cantidad_from").value;
            document.getElementById("label_pu").innerText = json_reponse["rate"];
        } else {
            show_alert(3, "Ha ocurrido un error al hacer la conversión.");
        }
    }
}


function close_form(event) {
    event.preventDefault();
    hide_alert();

    document.getElementById("form").style.display = "none";
    document.getElementById("button_open").style.display = "inline-block";

    
    document.getElementById("select_moneda_from").value = "-1";
    document.getElementById("select_moneda_to").value = "-1";
    document.getElementById("input_cantidad_from").value = "";
    document.getElementById("label_cantidad_to").innerText = "";
    document.getElementById("label_pu").innerText = "";  
}


function post_record(event) {
    event.preventDefault();

    const cantidad_from = document.getElementById("input_cantidad_from").value;
    const moneda_from = document.getElementById("select_moneda_from").value;

    if(! check_all(true, moneda_from, cantidad_from)) {
        return;
    }

    const date = new Date().toLocaleDateString("fr-CA");
    const time = new Date().toLocaleTimeString("es-ES");
    const moneda_to = document.getElementById("select_moneda_to").value;
    const cantidad_to = document.getElementById("label_cantidad_to").innerText;

    
    const json_records = JSON.stringify(
        {
            "fecha": date,
            "hora": time,
            "from_moneda": moneda_from,
            "from_cantidad": cantidad_from,
            "to_moneda": moneda_to,
            "to_cantidad": cantidad_to,
            
        }
    )
    
    
    request_post_record.open("POST", "http://127.0.0.1:5000/api/" + VERSION + "/movimiento" , true);
    request_post_record.onload = post_record_handler;
    request_post_record.onerror = function() {
        show_alert(3, "Ha ocurrido un error al guardar el registro.");
    };
    
    request_post_record.setRequestHeader("Content-Type","application/json");
    request_post_record.send(json_records);
}


function post_record_handler() {
    if (this.readyState === 4) {
        if (this.status === 201) {
            const json_response = JSON.parse(this.responseText);
            show_alert(1, "El registro se ha guardado correctamente.");

            const request_get_records = new XMLHttpRequest();
            request_get_records.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/movimientos", true);
            request_get_records.onload = get_records_handler;
            request_get_records.onerror = function () {
                show_alert(3, "Ha ocurrido un error al cargar los registros.");
            };
            request_get_records.send();

            const request_get_status = new XMLHttpRequest();
            request_get_status.open("GET", "http://127.0.0.1:5000/api/" + VERSION + "/status", true);
            request_get_status.onload = get_status_handler;
            request_get_status.onerror = function () {
                show_alert(3, "Ha ocurrido un error al cargar el estado de la cuenta.");
            };
            request_get_status.send();

            document.getElementById("select_moneda_from").value = "-1";
            document.getElementById("select_moneda_to").value = "-1";
            document.getElementById("input_cantidad_from").value = "";
            document.getElementById("label_cantidad_to").innerText = "";
            document.getElementById("label_pu").innerText = "";
        } else if (this.status === 200) {
            const moneda_from = document.getElementById("select_moneda_from").value;
            show_alert(2, "No tiene " + moneda_from + " suficiente para realizar esta operación.");
        } else {
            show_alert(3, "Ha ocurrido un error al insertar el registro.");
        }
    }
}
