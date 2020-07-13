
var counter = 0;
function ValidateIPaddress(inputText) {
    var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(3[0-3]|[0-9]|[0-3][0-9])$/;
    if (inputText.value.match(ipformat)) {
        // document.form1.text1.focus();
        //vlsm_cidr(inputText);
        return true;
    }
    else {
        return false;
    }
}

function addFields() {
    var no_of_networks = document.getElementById("member").value;
    if (counter == 0 && !ValidateIPaddress(document.form1.text1)) {
        alert("You have entered an invalid IP address!");
        return (false);
    }
    if (counter == no_of_networks) {
        alert("You have reached the limit of adding " + counter + " inputs");
        var newdiv = document.createElement('div');
        newdiv.innerHTML = "<input type='button' name = 'submit' value='submit' onclick='javascript:return vlsm_cidr();'>";
        document.getElementById("container").appendChild(newdiv);
        document.getElementById("numHostBtn").style.display = "none";
	}
    else {
        var newdiv = document.createElement('div');
        newdiv.innerHTML = "Entry " + (counter + 1) + " <br><input type='text' value='' onkeypress = return numberOnly(event)>";
        document.getElementById("container").appendChild(newdiv);
		
		/*var newdiv = document.createElement('div');
		output = "output"+(counter);
		var menu = "menu"+counter;
		newdiv.innerHTML = "<a href="+output +"id="+menu+ "style= 'display:none'><p>Subnet "+ (counter+1) +"</p></a>";
		document.getElementById("menu").appendChild(newdiv);*/
        counter++;
    }
}

function numberOnly(evt)
{
	var charCode = (evt.which)?evt.which :evt.keyCode;
	if(charCode >31 && (charCode > 48 || charCode < 57))
	{
		return true;
	}
	else
	{
		alert('Invalid input');
	}
}

function vlsm_cidr() {
    var completed_nw = 0;
    var str = '';
    var flag_nw = [], start_nw, turn = 0;
    var start_addr1, start_addr2, start_addr3, start_addr4;
    var ip = document.form1.text1.value;
    var no_of_networks = document.form1.member.value;
    var part = ip.split('.', 4);
    var mask = part[3].split('/');
  
    mask[0] = Number(mask[0]);
    part[3] = mask[0];
    part[2] = Number(part[2]);
    part[1] = Number(part[1]);
    part[0] = Number(part[0]);
	
	var num_hosts = [];
	for(var i=0;i<no_of_networks;i++)
	{
		flag_nw[i] = 0;
		num_hosts[i] = document.getElementById('container').getElementsByTagName('input')[i].value;
	}
	
	//document.body.innerHTML = "";
   // document.getElementById("p1").innerHTML = part[0] + "." + part[1] + "." + part[2] + "." + part[3];
    while (Number(completed_nw) < Number(no_of_networks)) {
			
		/*var newdiv = document.createElement('div');
		output = "output" +(counter-1);
		newdiv.id = output;
		document.getElementById('output').appendChild(newdiv);
		*/
		str += "<br><b>Network"+(turn+1)+"</b><br>";
        console.log(completed_nw);
        var max = 0, no_of_bits = 0, x = 1;
        var sm1 = 255, sm2 = 255, sm3 = 255, sm4 = 255;
		for (var j = 0; j < no_of_networks; j++) {
            if (Number(num_hosts[j]) > Number(max) && flag_nw[j] == 0) {
                max = num_hosts[j];
                start_nw = j + 1;
            }
        }
		console.log(max);
        flag_nw[start_nw - 1] = 1;
        completed_nw++;
        no_of_bits = Math.ceil(Math.log2(Number(max)+2));
		console.log('Number bits :'+no_of_bits+'network:'+max);
        if (Number(32 - no_of_bits) > Number(mask[1])) {
            if (turn == 0) {
                start_addr4 = 0;
                start_addr3 = part[2];
                start_addr2 = part[1];
                start_addr1 = part[0];
            }
            else {
                if (mask[0] < 255) {
                    start_addr4 = part[3] + 1;
                    start_addr3 = part[2];
                    start_addr2 = part[1];
                    start_addr1 = part[0];
                }
                else if (part[2] < 255) {
                    start_addr4 = 0;
                    start_addr3 = part[2] + 1;
                    start_addr2 = part[1];
                    start_addr1 = part[0];
                }
                else if (part[1] < 255) {
                    start_addr4 = 0;
                    start_addr3 = 0;
                    start_addr1 = part[0];
                    start_addr2 = part[1] + 1;
                }
                else {
                    start_addr4 = 0;
                    start_addr3 = 0;
                    start_addr2 = 0;
                    start_addr1 = part[0];
                }
            }
			str += "<br>Network address:";
			str += start_addr1+"."+start_addr2+"."+start_addr3+"."+start_addr4+"/"+(32-no_of_bits);
            //document.getElementById("p1").innerHTML = "changed";
            if (no_of_bits < 8) {
                part[3] = start_addr4 + (Math.pow(2, no_of_bits) - 1);
                sm4 = sm4 ^ (Math.pow(2, no_of_bits) - 1);
            }
            else if (no_of_bits < 16) {
                sm4 = 0;
                sm3 = sm3 ^ (Math.pow(2, no_of_bits - 8) - 1);
                part[3] = start_addr4 + (Math.pow(2, 8) - 1);
                part[2] = start_addr3 + (Math.pow(2, no_of_bits - 8) - 1);
            }
            else if (no_of_bits < 24) {
                sm4 = 0;
                sm3 = 0;
                sm2 = sm2 ^ (int)(Math.pow(2, no_of_bits - 16) - 1);
                part[3] = start_addr4 + (Math.pow(2, 8) - 1);
                part[2] = start_addr3 + (Math.pow(2, 8) - 1);
                part[1] = start_addr2 + (Math.pow(2, no_of_bits - 16) - 1);
            }
            else {
                sm4 = 0;
                sm3 = 0;
                sm2 = 0;
                sm1 = sm1 ^ (Math.pow(2, no_of_bits - 24) - 1);
                part[3] = start_addr4 + (Math.pow(2, 8) - 1);
                part[2] = start_addr3 + (Math.pow(2, 8) - 1);
                part[1] = start_addr2 + (Math.pow(2, 8) - 1);
                part[0] = start_addr1 + (Math.pow(2, no_of_bits - 16) - 1);
            }
            
            str += "<br>Range:" + start_addr1 + "." + start_addr2 + "." + start_addr3 + "." + start_addr4 + "/" + (32 - no_of_bits).toString() + " to " + part[0] + "." + part[1] + "." + part[2] + "." + part[3] + "/" + (32 - no_of_bits).toString();
            str += "<br>DGW:" + part[0] + "." + part[1] + "." + part[2] + "." + (++start_addr4).toString();
            str += "<br>VLAN:" + part[0] + "." + part[1] + "." + part[2] + "." + (++start_addr4).toString();
            str += "<br>Subnet Mask:" + sm1 + "." + sm2 + "." + sm3 + "." + sm4;
			//var output = "output"+(counter-1);
			//console.log(output);
			document.body.style.fontSize = "20px";
			document.body.style.textAlign = "center";
            document.body.innerHTML = str;
			turn++;
        }
    }
	/*for(var i=0;i<no_of_networks;i++)
	{
		menu = "menu"+i;
		document.getElementById(menu).style.display = 'block';
	}*/
    alert('test');
    return false;
}

