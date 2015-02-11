function get_elem(selector) {
    // like $() in jQuery
    var head = selector[0];
    var tail = selector.substr(1);
    if (head == '#') { // id
        return document.getElementById(tail);
    }
    else if (head == '.') { // class
        return document.getElementsByClassName(tail);
    }
    else { // tag
        return document.getElementsByTagName(selector);
    }
}

function parse_scheme(scheme) {
    //var result = {};
    scheme = scheme.replace(/\s+/g,''); // deleting spaces

    //result.length = scheme.length;
    var result = [];
    var i = 0;
    var s_count = 0;
    
    while (i < scheme.length) {
        if ((scheme[i] == 's') || (scheme[i] == 'S')) {
            i++;
            result.push('S<sub>' + scheme[i] + '</sub>');
            s_count++;
        } 
        else {
            result.push(scheme[i]);
        }
        i++;
    }
    
    result[i - s_count - 1] += '|';
    
    return result;
}

function error_message(num) {
    var message = 'Error: ';
    switch (num) {
        case 2:
            message += 'страйп больше, чем количество дисков';
            break;
        case 3:
            message += 'неправильный номер погибшего диска';
            break;
        default:
            message += 'этой ошибки быть не должно, правьте код';
            break;
    }
    alert(message);
}

function make_table(width, height) {
    var tbl = document.createElement('table');
    tbl.setAttribute('id','table');
    for (var i = 0; i < height; i++) {
        var tr = document.createElement('tr');
            for (var j = 0; j < width; j++) {
                var td = document.createElement('td');
                tr.appendChild(td);
            }
        tbl.appendChild(tr);
    }
    get_elem('body')[0].appendChild(tbl);
}

function delete_table() {
    if (get_elem('#table') != null) {
        get_elem('body')[0].removeChild(get_elem('#table'));
    }
}

function get_parameters() {
    var scheme = parse_scheme(get_elem('#structure').value);
    width = parseInt(get_elem('#disk_quantity').value);
    height = scheme.length;
   
    if (scheme.length > width) { 
        error_message(2);
    } 
    else if ((parseInt(get_elem('#failed_disk').value) > width) || (parseInt(get_elem('#failed_disk').value) < 0)) {
        error_message(3);
    } 
    else {
        delete_table();
        make_table(width, height);
        fill_table(height);
        mark_readers(height);
        get_results();
    }
}

function fill_table(stripe) {      
    var scheme = parse_scheme(get_elem('#structure').value);
    var tds = get_elem('td');
    var counter = 0;
    
    for (var i = 0; i < tds.length; i++) {
        counter = counter % stripe;
        
        tds[i].innerHTML = scheme[counter];
        if ((tds[i].innerHTML[0] == 'e') || (tds[i].innerHTML[0] == 'E')) {
            tds[i].setAttribute('class','cyan');
        }
        
        if (((i + 1) % parseInt(get_elem('#disk_quantity').value)) == parseInt(get_elem('#failed_disk').value)) {
            tds[i].setAttribute('class','red');
        }

        counter++;
    }
}

function mark_readers(stripe) {
    tds = get_elem('td');
    
    for (var i = 0; i < tds.length; i++) {
        if (tds[i].className == 'red') {

            for (j = 0; j < stripe; j++) {
                a = tds[i+j].innerHTML.split('|');
                if(a[1] != undefined) {
                    break;
                }
            }
            right_lim = j;
            left_lim = stripe - right_lim - 1;
            
            a = tds[i].innerHTML.split('');


            if ((a[0] == 'G') || (a[0] == 'g')) {
                j = 0;
                while (j <= stripe - 1) {
                    aj = tds[i - left_lim + j].innerHTML.split('');
                    if ((aj[0] != 'S') && (aj[0] != 's') && (aj[0] != 'G') && (aj[0] != 'g') && (aj[0] != 'e') && (aj[0] != 'E') && (j != left_lim)) {
                        tds[i - left_lim + j].className = 'green';
                    }
                    j++;
                }
            }
            else {
                if ((a[0] == 'S') || (a[0] == 's')) {
                    j = 0;
                    while (j <= stripe - 1) {
                        aj = tds[i - left_lim + j].innerHTML.split('');
                        if ((aj[0] == a[6]) && (j != left_lim)) {
                            tds[i - left_lim + j].className = 'green';
                        }
                        j++;
                    }
                }
                else {
                    j = 0;
                    while (j <= stripe - 1) {
                        aj = tds[i - left_lim + j].innerHTML.split('');
                        if (((aj[0] == a[0]) || (aj[6] == a[0])) && (j != left_lim)) {
                            tds[i - left_lim + j].className = 'green';
                        }
                        j++;
                    }
                }
            }
            
        }
    }
}

function get_results() {
    tds = get_elem('td');
    scheme = parse_scheme(get_elem('#structure').value);
    width = parseInt(get_elem('#disk_quantity').value);
    height = scheme.length;
    res_array = [];

    for (var i = 0; i < width; i++) {
        k = 0;
        for (var j = 0; j < height; j++) {
            cell = j * width + i;
            if (tds[cell].className == 'green') {
                k++;
            }
        }
        res_array[i] = k;
    }

    tr = document.createElement('tr');
    for (var i = 0; i < width; i++) {
        var td = document.createElement('td');
        td.innerHTML = res_array[i];
        td.className = 'yellow';
        tr.appendChild(td);
    }
    get_elem('#table').appendChild(tr);
}

