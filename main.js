let scanner;
var codescanned = "";

function login(event) {
	event.preventDefault();
	var email = document.getElementById("exampleInputEmail1").value;
	var pass = document.getElementById("exampleInputPassword1").value;
	$.ajax({
        url: 'http://api.luciron.com:3005/v1/user/login',
        type: 'POST',
        data: JSON.stringify({ email: email, password : pass}) ,
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
        	if(response.success) {
        		localStorage.setItem('nbtoken', response.token);
        		window.location = "member.html";
        	} else {
            alert(response.message.toString());
        	}
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    }); 
}

function register() {
	var name = document.getElementById("exampleInputName1").value;
	var email = document.getElementById("exampleInputEmail1").value;
	var pass = document.getElementById("exampleInputPassword1").value;
	$.ajax({
        url: 'http://api.luciron.com:3005/v1/user/register',
        type: 'POST',
        data: JSON.stringify({ fullname: name, email: email, password : pass}) ,
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            alert(response.success.toString());
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function auth(token) {
	// var authenticated = false;
	// $.ajax({
	//   url: 'http://api.luciron.com:3005/v1/user/me',
	//   cache: false,
	//   type: 'GET',
	//   contentType: 'application/json; charset=utf-8',
	//   success: function (response) {
	//       if(response.success) {
	//       	console.log("authenticated");
	//     		authenticated = true;
	//     	} else {
	//     		console.log("authention error");
	//         authenticated = false;
	//     	}
	    	
	//   },
	//   error: function (XMLHttpRequest, textStatus, errorThrown) {
	//       authenticated = false;
	//   },
	//   complete: function() {
	//   	console.log("completed")
	//   	return authenticated;
	//   },
	//   beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization','Bearer ' + token )}
	// });
	axios.get('http://api.luciron.com:3005/v1/user/me', {
  headers: {
    'Authorization': 'Bearer ' + token,
  },
	})
  .then(function (response) {
    return response.data.success;
  })
  .catch(function (error) {
    alert(error);
  });
}

function alreadyLogged() {
	if (localStorage.getItem("nbtoken") !== null) {
	  window.location = "member.html";
	}
}

function notLogged() {
	if(localStorage.getItem("nbtoken") === null) {
		logout();
	} else {
		console.log("has token")
		axios.get('http://api.luciron.com:3005/v1/user/me', {
	  headers: {
	    'Authorization': 'Bearer ' + localStorage.getItem("nbtoken"),
	  },
		})
	  .then(function (response) {
	    if(!response.data.success){

	    	window.location = "login.html";
	    }
	  })
	  .catch(function (error) {
	    alert(error);
	  });
	}
}

function logout() {
	localStorage.removeItem("nbtoken");
	window.location = "index.html";
}

function getqr(id) {
	var url = "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data="+id;
	$("#qrcode").attr("src",url);
}
// checkIfLogged() ? console.log("Loggedin") : console.log("Logged Out");

function scanqr() {
		$('#qrmodal').show();
	  var mirrorOn = true;
	  if($(document).width() <= 1000) {
	    mirrorOn = false;
	  }
	  scanner = new Instascan.Scanner({ video: document.getElementById('preview'), mirror: mirrorOn });
	  scanner.addListener('scan', function (content) {
	  	codescanned = content;
	    alert(content);
	    closeqr;
	  });
	  Instascan.Camera.getCameras().then(function (cameras) {
	    if (cameras.length > 1) {
	      scanner.start(cameras[2]);
	    }
	    else if (cameras.length > 0) {
	      scanner.start(cameras[0]);
	    } else {
	      console.error('No cameras found.');
	    }
	  }).catch(function (e) {
	    console.error(e);
	  });
}

function closeqr() {
	$('#qrmodal').hide();
	Instascan.Camera.getCameras().then(function (cameras) {
	    if (cameras.length > 1) {
	      scanner.stop(cameras[2]);
	    }
	    else if (cameras.length > 0) {
	      scanner.stop(cameras[0]);
	    } else {
	      console.error('No cameras found.');
	    }
	  }).catch(function (e) {
	    console.error(e);
	  });
}